import mongoose, { Document, Schema, Model } from 'mongoose';

// ─── Sub-document Interfaces ──────────────────────────────────────────────────
export interface IRound {
  name: string;
  type: 'aptitude' | 'coding' | 'technical' | 'hr' | 'group_discussion' | 'other';
  duration?: string;
  description?: string;
}

// ─── Main Interface ───────────────────────────────────────────────────────────
export interface IDrive extends Document {
  _id: mongoose.Types.ObjectId;
  // Company Info
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyDescription?: string;
  // Role Info
  role: string;
  domain: 'Software Development' | 'Data Science' | 'DevOps' | 'QA Testing' | 'Product Management' | 'UI/UX Design' | 'Business Analyst' | 'Other';
  package: string;           // e.g. "12-18 LPA"
  location: string;
  workMode: 'on-site' | 'remote' | 'hybrid';
  jobType: 'full-time' | 'internship' | 'part-time';
  // Eligibility
  minCgpa: number;
  allowedBranches: string[];
  maxBacklogs: number;
  allowedYears: string[];
  skills: string[];           // Required skills
  // Drive Details
  description: string;
  rounds: IRound[];
  deadline: Date;
  driveDate?: Date;
  venue?: string;
  practiceSetId?: mongoose.Types.ObjectId;
  // Status
  approvalStatus: 'draft' | 'pending_admin_approval' | 'published' | 'rejected' | 'closed';
  rejectionReason?: string;
  // Counts (cached)
  interestCount: number;
  applicationCount: number;
  // Metadata
  createdBy: mongoose.Types.ObjectId; // Admin/Recruiter who created
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const DriveSchema = new Schema<IDrive>(
  {
    companyName: { type: String, required: true, trim: true },
    companyLogo: { type: String },
    companyWebsite: { type: String },
    companyDescription: { type: String },
    role: { type: String, required: true, trim: true },
    domain: {
      type: String,
      enum: ['Software Development', 'Data Science', 'DevOps', 'QA Testing', 'Product Management', 'UI/UX Design', 'Business Analyst', 'Other'],
      required: true,
    },
    package: { type: String, required: true },
    location: { type: String, required: true },
    workMode: { type: String, enum: ['on-site', 'remote', 'hybrid'], default: 'on-site' },
    jobType: { type: String, enum: ['full-time', 'internship', 'part-time'], default: 'full-time' },
    minCgpa: { type: Number, min: 0, max: 10, default: 6.0 },
    allowedBranches: [{ type: String }],
    maxBacklogs: { type: Number, default: 0 },
    allowedYears: [{ type: String }],
    skills: [{ type: String }],
    description: { type: String, required: true },
    rounds: [
      {
        name: { type: String, required: true },
        type: {
          type: String,
          enum: ['aptitude', 'coding', 'technical', 'hr', 'group_discussion', 'other'],
          required: true,
        },
        duration: { type: String },
        description: { type: String },
      },
    ],
    deadline: { type: Date, required: true },
    driveDate: { type: Date },
    venue: { type: String },
    practiceSetId: { type: Schema.Types.ObjectId, ref: 'PracticeSet' },
    approvalStatus: {
      type: String,
      enum: ['draft', 'pending_admin_approval', 'published', 'rejected', 'closed'],
      default: 'draft',
    },
    rejectionReason: { type: String },
    interestCount: { type: Number, default: 0 },
    applicationCount: { type: Number, default: 0 },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
DriveSchema.index({ approvalStatus: 1, deadline: 1 });
DriveSchema.index({ domain: 1 });
DriveSchema.index({ companyName: 'text', role: 'text' });

const Drive: Model<IDrive> = mongoose.model<IDrive>('Drive', DriveSchema);
export default Drive;
