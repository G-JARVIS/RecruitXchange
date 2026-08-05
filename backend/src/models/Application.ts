import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IApplication extends Document {
  _id: mongoose.Types.ObjectId;
  driveId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  status: 'interested' | 'applied' | 'shortlisted' | 'interview_scheduled' | 'offered' | 'rejected';
  // Interest (first step — before formal application)
  expressedInterestAt?: Date;
  bookmarked: boolean;
  // Application details
  appliedAt?: Date;
  coverNote?: string;
  // Interview scheduling
  interviewDate?: Date;
  interviewLink?: string;
  // Outcome
  offerLetterUrl?: string;
  adminNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    driveId: { type: Schema.Types.ObjectId, ref: 'Drive', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['interested', 'applied', 'shortlisted', 'interview_scheduled', 'offered', 'rejected'],
      default: 'interested',
    },
    expressedInterestAt: { type: Date },
    bookmarked: { type: Boolean, default: false },
    appliedAt: { type: Date },
    coverNote: { type: String, maxlength: 500 },
    interviewDate: { type: Date },
    interviewLink: { type: String },
    offerLetterUrl: { type: String },
    adminNote: { type: String },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index: one record per student per drive
ApplicationSchema.index({ driveId: 1, studentId: 1 }, { unique: true });
ApplicationSchema.index({ studentId: 1, status: 1 });
ApplicationSchema.index({ driveId: 1, status: 1 });

const Application: Model<IApplication> = mongoose.model<IApplication>('Application', ApplicationSchema);
export default Application;
