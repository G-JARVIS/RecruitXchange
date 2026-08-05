import { Request, Response, NextFunction } from 'express';
import Notification from '../models/Notification';
import { sendSuccess } from '../utils/apiResponse';

// ─── GET /api/notifications ───────────────────────────────────────────────────
export const getNotifications = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { unreadOnly } = req.query;
    const filter: Record<string, unknown> = { userId: req.user!._id };
    if (unreadOnly === 'true') filter.isRead = false;

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({ userId: req.user!._id, isRead: false });

    sendSuccess(res, { notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/notifications/:id/read ───────────────────────────────────────
export const markRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user!._id },
      { isRead: true, readAt: new Date() }
    );
    sendSuccess(res, null, 'Notification marked as read');
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/notifications/read-all ───────────────────────────────────────
export const markAllRead = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Notification.updateMany(
      { userId: req.user!._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    sendSuccess(res, null, 'All notifications marked as read');
  } catch (error) {
    next(error);
  }
};

// ─── DELETE /api/notifications/:id ───────────────────────────────────────────
export const deleteNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user!._id });
    sendSuccess(res, null, 'Notification deleted');
  } catch (error) {
    next(error);
  }
};
