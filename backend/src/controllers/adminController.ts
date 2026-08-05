import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import StudentProfile from '../models/StudentProfile';
import Drive from '../models/Drive';
import Application from '../models/Application';
import Question from '../models/Question';
import Attempt from '../models/Attempt';
import CounselingSession from '../models/CounselingSession';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';

// ─── GET /api/admin/dashboard ─────────────────────────────────────────────────
export const getDashboardStats = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const [
      totalStudents,
      verifiedStudents,
      pendingCounseling,
      totalDrives,
      publishedDrives,
      pendingDrives,
      totalApplications,
      totalQuestions,
      pendingQuestions,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      StudentProfile.countDocuments({ isVerified: true }),
      CounselingSession.countDocuments({ status: 'pending' }),
      Drive.countDocuments(),
      Drive.countDocuments({ approvalStatus: 'published' }),
      Drive.countDocuments({ approvalStatus: 'pending_admin_approval' }),
      Application.countDocuments(),
      Question.countDocuments(),
      Question.countDocuments({ approvalStatus: 'pending' }),
    ]);

    // Recent activity
    const recentDrives = await Drive.find().sort({ createdAt: -1 }).limit(5).lean();
    const recentStudents = await User.find({ role: 'student' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt')
      .lean();

    sendSuccess(res, {
      stats: {
        totalStudents,
        verifiedStudents,
        pendingCounseling,
        totalDrives,
        publishedDrives,
        pendingDrives,
        totalApplications,
        totalQuestions,
        pendingQuestions,
      },
      recentDrives,
      recentStudents,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/admin/students ──────────────────────────────────────────────────
export const getStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1', limit = '20', search, department, verified } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const userFilter: Record<string, unknown> = { role: 'student' };
    if (search) {
      userFilter.$or = [
        { name: new RegExp(search as string, 'i') },
        { email: new RegExp(search as string, 'i') },
      ];
    }

    const users = await User.find(userFilter)
      .select('-password')
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    const total = await User.countDocuments(userFilter);

    // Attach profiles
    const userIds = users.map((u) => u._id);
    const profiles = await StudentProfile.find({ userId: { $in: userIds } }).lean();
    const profileMap: Record<string, typeof profiles[0]> = {};
    profiles.forEach((p) => {
      profileMap[p.userId.toString()] = p;
    });

    const studentsWithProfiles = users
      .map((u) => ({ ...u, profile: profileMap[u._id.toString()] || null }))
      .filter((u) => {
        if (department && u.profile?.department !== department) return false;
        if (verified !== undefined && u.profile?.isVerified !== (verified === 'true')) return false;
        return true;
      });

    sendPaginated(res, studentsWithProfiles, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/admin/students/:id ─────────────────────────────────────────────
export const getStudentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) throw new AppError('Student not found', 404);

    const profile = await StudentProfile.findOne({ userId: user._id });
    const attempts = await Attempt.find({ studentId: user._id })
      .sort({ submittedAt: -1 })
      .limit(20);
    const applications = await Application.find({ studentId: user._id })
      .populate('driveId', 'companyName role deadline');

    sendSuccess(res, { user, profile, attempts, applications });
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/admin/students/:id/verify ────────────────────────────────────
export const verifyStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { isVerified } = req.body;
    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.params.id },
      { isVerified, ...(isVerified && { verifiedAt: new Date() }) },
      { new: true }
    );
    if (!profile) throw new AppError('Profile not found', 404);
    sendSuccess(res, profile, `Student ${isVerified ? 'verified' : 'unverified'}`);
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/admin/users/:id/status ────────────────────────────────────────
export const updateUserStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');
    if (!user) throw new AppError('User not found', 404);
    sendSuccess(res, user, `User status updated to ${status}`);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/admin/moderation/questions ─────────────────────────────────────
export const getModerationQueue = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const pending = await Question.find({ approvalStatus: 'pending' })
      .populate({ path: 'createdBy', select: 'name email' })
      .sort({ createdAt: 1 });
    sendSuccess(res, pending);
  } catch (error) {
    next(error);
  }
};

// ─── PATCH /api/admin/moderation/questions/:id ───────────────────────────────
export const moderateQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, note } = req.body; // status: 'approved' | 'rejected'
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: status },
      { new: true }
    );
    if (!question) throw new AppError('Question not found', 404);
    sendSuccess(res, question, `Question ${status}`);
  } catch (error) {
    next(error);
  }
};
