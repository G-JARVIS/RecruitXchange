import { Request, Response, NextFunction } from 'express';
import CounselingSession from '../models/CounselingSession';
import Notification from '../models/Notification';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';

// ─── POST /api/counseling/request ─────────────────────────────────────────────
export const requestSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { topic, description, type = '1:1', preferredSlots, studentNote } = req.body;

    if (!topic || !preferredSlots || preferredSlots.length === 0) {
      throw new AppError('Topic and at least one preferred slot are required', 400);
    }

    const session = await CounselingSession.create({
      studentId: req.user!._id,
      topic,
      description,
      type,
      preferredSlots,
      studentNote,
      status: 'pending',
    });

    // Notify student
    await Notification.create({
      userId: req.user!._id,
      type: 'counseling_confirmed',
      title: 'Counseling Request Submitted',
      message: `Your request for "${topic}" counseling has been submitted. The placement cell will review and confirm a time slot.`,
      relatedId: session._id,
      relatedType: 'counseling',
      priority: 'medium',
    });

    sendSuccess(res, session, 'Counseling session requested successfully', 201);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/counseling/my-sessions ──────────────────────────────────────────
export const getMySessions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sessions = await CounselingSession.find({ studentId: req.user!._id })
      .sort({ createdAt: -1 });
    sendSuccess(res, sessions);
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN: GET /api/admin/counseling ─────────────────────────────────────────
export const getAllSessions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1', limit = '20', status } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const total = await CounselingSession.countDocuments(filter);
    const sessions = await CounselingSession.find(filter)
      .populate({ path: 'studentId', select: 'name email' })
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    sendPaginated(res, sessions, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

// ─── ADMIN: PUT /api/admin/counseling/:id/status ─────────────────────────────
export const updateSessionStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, scheduledSlot, meetingLink, adminNote } = req.body;

    const session = await CounselingSession.findByIdAndUpdate(
      req.params.id,
      {
        status,
        ...(scheduledSlot && { scheduledSlot }),
        ...(meetingLink && { meetingLink }),
        ...(adminNote && { adminNote }),
        counselorId: req.user!._id,
      },
      { new: true }
    ).populate({ path: 'studentId', select: 'name email _id' });

    if (!session) throw new AppError('Session not found', 404);

    // Notify student
    const student = session.studentId as any;
    if (student?._id) {
      const notifMap: Record<string, { title: string; message: string }> = {
        scheduled: {
          title: 'Counseling Session Scheduled! 📅',
          message: `Your "${session.topic}" session has been scheduled. Check your dashboard for the meeting link.`,
        },
        rescheduled: {
          title: 'Session Rescheduled',
          message: `Your "${session.topic}" session has been rescheduled. Please check the new time slot.`,
        },
        cancelled: {
          title: 'Session Cancelled',
          message: `Your "${session.topic}" counseling session was cancelled. You may request a new session.`,
        },
      };

      if (notifMap[status]) {
        await Notification.create({
          userId: student._id,
          type: 'counseling_confirmed',
          title: notifMap[status].title,
          message: notifMap[status].message,
          relatedId: session._id,
          relatedType: 'counseling',
          priority: 'high',
        });
      }
    }

    sendSuccess(res, session, `Session status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};
