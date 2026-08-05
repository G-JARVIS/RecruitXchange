import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IModule {
  lessonId: mongoose.Types.ObjectId;
  order: number;
  isOptional: boolean;
}

export interface ILearningPath extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  targetRole: string;
  domain: string;
  estimatedHours: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  thumbnail?: string;
  modules: IModule[];
  prerequisites: string[];
  learningOutcomes: string[];
  isPublished: boolean;
  enrollmentCount: number;
  rating: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const LearningPathSchema = new Schema<ILearningPath>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    targetRole: { type: String, required: true },
    domain: { type: String, required: true },
    estimatedHours: { type: Number, required: true, min: 0 },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    thumbnail: { type: String },
    modules: [
      {
        lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
        order: { type: Number, required: true },
        isOptional: { type: Boolean, default: false },
      },
    ],
    prerequisites: [{ type: String }],
    learningOutcomes: [{ type: String }],
    isPublished: { type: Boolean, default: false },
    enrollmentCount: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

LearningPathSchema.index({ domain: 1, difficulty: 1 });
LearningPathSchema.index({ title: 'text', targetRole: 'text' });

const LearningPath: Model<ILearningPath> = mongoose.model<ILearningPath>('LearningPath', LearningPathSchema);
export default LearningPath;
