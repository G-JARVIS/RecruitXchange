import mongoose, { Document, Schema, Model } from 'mongoose';

// ─── Sub-document Interfaces ──────────────────────────────────────────────────
export interface IMCQOption {
  label: string;  // A, B, C, D
  text: string;
}

export interface ITestCase {
  input: string;
  expectedOutput: string;
  isHidden: boolean;
}

// ─── Main Interface ───────────────────────────────────────────────────────────
export interface IQuestion extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: 'mcq' | 'coding' | 'aptitude';
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  company: string[];
  // MCQ fields
  options?: IMCQOption[];
  correctAnswer?: string;  // For MCQ: 'A', 'B', 'C', 'D'
  explanation?: string;
  // Coding fields
  starterCode?: string;
  solutionCode?: string;
  testCases?: ITestCase[];
  languagesAllowed?: string[];
  // Aptitude
  hint?: string;
  // Visibility & Source
  visibility: 'public' | 'college' | 'drive_specific';
  driveId?: mongoose.Types.ObjectId;
  practiceSetId?: mongoose.Types.ObjectId;
  approvalStatus: 'draft' | 'pending' | 'approved' | 'rejected';
  createdBy: mongoose.Types.ObjectId;
  // Stats
  totalAttempts: number;
  correctRate: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['mcq', 'coding', 'aptitude'], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    company: [{ type: String, trim: true }],
    // MCQ
    options: [
      {
        label: { type: String, required: true },
        text: { type: String, required: true },
      },
    ],
    correctAnswer: { type: String },
    explanation: { type: String },
    // Coding
    starterCode: { type: String },
    solutionCode: { type: String, select: false }, // Hidden from students
    testCases: [
      {
        input: { type: String, required: true },
        expectedOutput: { type: String, required: true },
        isHidden: { type: Boolean, default: false },
      },
    ],
    languagesAllowed: [{ type: String }],
    // Aptitude
    hint: { type: String },
    // Visibility
    visibility: { type: String, enum: ['public', 'college', 'drive_specific'], default: 'public' },
    driveId: { type: Schema.Types.ObjectId, ref: 'Drive' },
    practiceSetId: { type: Schema.Types.ObjectId, ref: 'PracticeSet' },
    approvalStatus: {
      type: String,
      enum: ['draft', 'pending', 'approved', 'rejected'],
      default: 'approved',
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    totalAttempts: { type: Number, default: 0 },
    correctRate: { type: Number, default: 0, min: 0, max: 100 },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
QuestionSchema.index({ tags: 1, difficulty: 1 });
QuestionSchema.index({ approvalStatus: 1, visibility: 1 });
QuestionSchema.index({ title: 'text', description: 'text' });

const Question: Model<IQuestion> = mongoose.model<IQuestion>('Question', QuestionSchema);
export default Question;
