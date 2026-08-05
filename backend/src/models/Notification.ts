import mongoose, { Document, Schema, Model } from 'mongoose';

export type NotificationType =
  | 'drive_published'
  | 'drive_deadline'
  | 'interest_acknowledged'
  | 'application_status'
  | 'counseling_confirmed'
  | 'counseling_rescheduled'
  | 'lesson_completed'
  | 'badge_earned'
  | 'readiness_milestone'
  | 'admin_message'
  | 'system';

export interface INotification extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  // Optional deep link
  relatedId?: mongoose.Types.ObjectId;
  relatedType?: 'drive' | 'lesson' | 'question' | 'counseling' | 'application';
  actionUrl?: string;
  // Metadata
  icon?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  readAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'drive_published', 'drive_deadline', 'interest_acknowledged',
        'application_status', 'counseling_confirmed', 'counseling_rescheduled',
        'lesson_completed', 'badge_earned', 'readiness_milestone',
        'admin_message', 'system',
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    relatedId: { type: Schema.Types.ObjectId },
    relatedType: {
      type: String,
      enum: ['drive', 'lesson', 'question', 'counseling', 'application'],
    },
    actionUrl: { type: String },
    icon: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    readAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });

const Notification: Model<INotification> = mongoose.model<INotification>('Notification', NotificationSchema);
export default Notification;
