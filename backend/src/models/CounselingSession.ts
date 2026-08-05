import mongoose, { Document, Schema, Model } from 'mongoose';

export interface ITimeSlot {
  date: Date;
  startTime: string;
  endTime: string;
}

export interface ICounselingSession extends Document {
  _id: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  counselorId?: mongoose.Types.ObjectId; // Admin who accepts
  topic: string;
  description?: string;
  type: '1:1' | 'group';
  preferredSlots: ITimeSlot[];
  scheduledSlot?: ITimeSlot;
  meetingLink?: string;
  status: 'pending' | 'accepted' | 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  adminNote?: string;
  studentNote?: string;
  rating?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CounselingSessionSchema = new Schema<ICounselingSession>(
  {
    studentId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    counselorId: { type: Schema.Types.ObjectId, ref: 'User' },
    topic: { type: String, required: true, trim: true },
    description: { type: String },
    type: { type: String, enum: ['1:1', 'group'], default: '1:1' },
    preferredSlots: [
      {
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
      },
    ],
    scheduledSlot: {
      date: { type: Date },
      startTime: { type: String },
      endTime: { type: String },
    },
    meetingLink: { type: String },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'pending',
    },
    adminNote: { type: String },
    studentNote: { type: String },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String },
  },
  { timestamps: true }
);

CounselingSessionSchema.index({ studentId: 1, status: 1 });
CounselingSessionSchema.index({ status: 1, createdAt: -1 });

const CounselingSession: Model<ICounselingSession> = mongoose.model<ICounselingSession>(
  'CounselingSession',
  CounselingSessionSchema
);
export default CounselingSession;
