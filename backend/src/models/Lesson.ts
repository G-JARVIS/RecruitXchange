import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ICodeSnippet {
  language: string;
  code: string;
  description?: string;
}

export interface IExternalResource {
  title: string;
  url: string;
  source: string; // 'GeeksforGeeks', 'MDN', 'YouTube', etc.
  type: 'article' | 'video' | 'exercise' | 'documentation';
}

export interface ILesson extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  content: string; // Markdown content
  codeSnippets: ICodeSnippet[];
  externalResources: IExternalResource[];
  duration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  pathId?: mongoose.Types.ObjectId;
  order?: number;
  thumbnail?: string;
  quizQuestions: mongoose.Types.ObjectId[]; // Questions for end-of-lesson quiz
  isPublished: boolean;
  viewCount: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    codeSnippets: [
      {
        language: { type: String, required: true },
        code: { type: String, required: true },
        description: { type: String },
      },
    ],
    externalResources: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        source: { type: String, required: true },
        type: {
          type: String,
          enum: ['article', 'video', 'exercise', 'documentation'],
          required: true,
        },
      },
    ],
    duration: { type: Number, required: true, min: 1 },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    pathId: { type: Schema.Types.ObjectId, ref: 'LearningPath' },
    order: { type: Number },
    thumbnail: { type: String },
    quizQuestions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    isPublished: { type: Boolean, default: false },
    viewCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

LessonSchema.index({ pathId: 1, order: 1 });
LessonSchema.index({ tags: 1, difficulty: 1 });
LessonSchema.index({ title: 'text' });

const Lesson: Model<ILesson> = mongoose.model<ILesson>('Lesson', LessonSchema);
export default Lesson;
