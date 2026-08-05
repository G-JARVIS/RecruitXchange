import mongoose, { Document, Schema, Model } from 'mongoose';

// ─── Sub-document Interfaces ──────────────────────────────────────────────────
export interface IExperience {
  company: string;
  role: string;
  duration: string;
  description?: string;
}

export interface IEducation {
  institution: string;
  degree: string;
  year: string;
  cgpa?: number;
}

export interface ISocialLinks {
  github?: string;
  linkedin?: string;
  portfolio?: string;
  leetcode?: string;
  codechef?: string;
  hackerrank?: string;
}

// ─── Main Interface ───────────────────────────────────────────────────────────
export interface IStudentProfile extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  // Basic Info
  rollNumber?: string;
  phone?: string;
  college: string;
  department: string;
  yearOfStudy: '1st Year' | '2nd Year' | '3rd Year' | '4th Year' | 'Alumni';
  // Academic
  cgpa: number;
  activeBacklogs: number;
  education: IEducation[];
  // Skills & Career
  skills: string[];
  interests: string[];
  experience: IExperience[];
  socialLinks: ISocialLinks;
  // Resume
  resumeUrl?: string;
  resumePublicId?: string; // Cloudinary public_id for deletion
  atsScore?: number;
  atsKeywords: string[];
  // Readiness & Gamification
  readinessScore: number;
  level: number;
  xp: number;
  badges: string[];
  // Admin Verification
  isVerified: boolean;
  verifiedAt?: Date;
  // Onboarding
  onboardingComplete: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Schema ───────────────────────────────────────────────────────────────────
const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    rollNumber: { type: String, trim: true, sparse: true },
    phone: { type: String, trim: true },
    college: { type: String, default: 'K.J. Somaiya College of Engineering' },
    department: {
      type: String,
      enum: [
        'Computer Engineering',
        'Information Technology',
        'Data Science & Algorithms',
        'Electronics & Telecommunication',
        'Mechanical Engineering',
        'Civil Engineering',
        'Electrical Engineering',
        'AI & Machine Learning',
        'Other',
      ],
      default: 'Computer Engineering',
    },
    yearOfStudy: {
      type: String,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Alumni'],
      default: '3rd Year',
    },
    cgpa: { type: Number, min: 0, max: 10, default: 0 },
    activeBacklogs: { type: Number, min: 0, default: 0 },
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        year: { type: String, required: true },
        cgpa: { type: Number },
      },
    ],
    skills: [{ type: String, trim: true }],
    interests: [{ type: String, trim: true }],
    experience: [
      {
        company: { type: String, required: true },
        role: { type: String, required: true },
        duration: { type: String, required: true },
        description: { type: String },
      },
    ],
    socialLinks: {
      github: { type: String },
      linkedin: { type: String },
      portfolio: { type: String },
      leetcode: { type: String },
      codechef: { type: String },
      hackerrank: { type: String },
    },
    resumeUrl: { type: String },
    resumePublicId: { type: String },
    atsScore: { type: Number, min: 0, max: 100 },
    atsKeywords: [{ type: String }],
    readinessScore: { type: Number, min: 0, max: 100, default: 0 },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    badges: [{ type: String }],
    isVerified: { type: Boolean, default: false },
    verifiedAt: { type: Date },
    onboardingComplete: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
StudentProfileSchema.index({ userId: 1 });
StudentProfileSchema.index({ department: 1, cgpa: -1 });
StudentProfileSchema.index({ skills: 1 });
StudentProfileSchema.index({ readinessScore: -1 });

const StudentProfile: Model<IStudentProfile> = mongoose.model<IStudentProfile>(
  'StudentProfile',
  StudentProfileSchema
);
export default StudentProfile;
