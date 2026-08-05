import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IAttempt extends Document {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  questionId: mongoose.Types.ObjectId;
  // Attempt details
  type: 'mcq' | 'coding' | 'aptitude';
  answer?: string;          // MCQ: selected option label; Aptitude: text answer
  code?: string;            // Coding: submitted code
  language?: string;        // Coding: e.g., 'javascript', 'python'
  // Results
  isCorrect: boolean;
  score: number;            // 0-100
  timeTaken: number;        // seconds
  // Coding-specific
  testCasesPassed?: number;
  totalTestCases?: number;
  executionOutput?: string;
  errorOutput?: string;
  // Context (which set/lesson this attempt was from)
  practiceSetId?: mongoose.Types.ObjectId;
  lessonId?: mongoose.Types.ObjectId;
  // Hints used
  hintsUsed: number;
  solutionViewed: boolean;
  submittedAt: Date;
  createdAt: Date;
}

const AttemptSchema = new Schema<IAttempt>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    questionId: { type: Schema.Types.ObjectId, ref: 'Question', required: true },
    type: { type: String, enum: ['mcq', 'coding', 'aptitude'], required: true },
    answer: { type: String },
    code: { type: String },
    language: { type: String },
    isCorrect: { type: Boolean, required: true },
    score: { type: Number, min: 0, max: 100, default: 0 },
    timeTaken: { type: Number, default: 0 },
    testCasesPassed: { type: Number },
    totalTestCases: { type: Number },
    executionOutput: { type: String },
    errorOutput: { type: String },
    practiceSetId: { type: Schema.Types.ObjectId, ref: 'PracticeSet' },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson' },
    hintsUsed: { type: Number, default: 0 },
    solutionViewed: { type: Boolean, default: false },
    submittedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

AttemptSchema.index({ studentId: 1, submittedAt: -1 });
AttemptSchema.index({ studentId: 1, questionId: 1 });
AttemptSchema.index({ questionId: 1, isCorrect: 1 });

const Attempt: Model<IAttempt> = mongoose.model<IAttempt>('Attempt', AttemptSchema);
export default Attempt;
