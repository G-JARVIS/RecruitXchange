import { Request, Response, NextFunction } from 'express';
import StudentProfile from '../models/StudentProfile';
import Attempt from '../models/Attempt';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';
import { runPredictor } from '../utils/predictorEngine';
import { uploadToCloudinary, deleteFromCloudinary } from '../middleware/upload';
import { isCloudinaryEnabled } from '../config/cloudinary';
import path from 'path';

// ─── GET /api/student/profile ─────────────────────────────────────────────────
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user!._id });
    if (!profile) {
      throw new AppError('Profile not found', 404);
    }
    sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
};

// ─── PUT /api/student/profile ─────────────────────────────────────────────────
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const allowedFields = [
      'phone', 'rollNumber', 'college', 'department', 'yearOfStudy',
      'cgpa', 'activeBacklogs', 'skills', 'interests', 'experience',
      'education', 'socialLinks', 'onboardingComplete',
    ];

    const updates: Record<string, unknown> = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user!._id },
      { $set: updates },
      { new: true, runValidators: true, upsert: true }
    );

    sendSuccess(res, profile, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/student/resume ─────────────────────────────────────────────────
export const uploadResume = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      throw new AppError('No file uploaded', 400);
    }

    let resumeUrl: string;
    let resumePublicId: string | undefined;

    if (isCloudinaryEnabled && req.file.buffer) {
      // Upload to Cloudinary
      const result = await uploadToCloudinary(
        req.file.buffer,
        `recruitxchange/resumes/${req.user!._id}`,
        'raw',
        `resume_${req.user!._id}`
      );
      resumeUrl = result.url;
      resumePublicId = result.publicId;

      // Delete old resume from Cloudinary
      const existing = await StudentProfile.findOne({ userId: req.user!._id });
      if (existing?.resumePublicId) {
        await deleteFromCloudinary(existing.resumePublicId).catch(() => {});
      }
    } else {
      // Local fallback
      const filename = req.file.filename || path.basename(req.file.path || '');
      resumeUrl = `/uploads/${filename}`;
    }

    // Mock ATS scoring (in production, integrate a real ATS parser)
    const mockAtsScore = Math.floor(Math.random() * 30) + 55; // 55-85
    const mockKeywords = ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Problem Solving', 'Team Player'];

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user!._id },
      {
        $set: {
          resumeUrl,
          resumePublicId,
          atsScore: mockAtsScore,
          atsKeywords: mockKeywords,
        },
      },
      { new: true }
    );

    sendSuccess(res, {
      resumeUrl,
      atsScore: mockAtsScore,
      atsKeywords: mockKeywords,
      profile,
    }, 'Resume uploaded successfully');
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/student/predictor ───────────────────────────────────────────────
export const runPredictorForStudent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user!._id });
    if (!profile) {
      throw new AppError('Complete your profile before running the predictor', 400);
    }

    // Get practice success rate
    const attempts = await Attempt.find({ studentId: req.user!._id });
    const successRate = attempts.length > 0
      ? (attempts.filter((a) => a.isCorrect).length / attempts.length) * 100
      : 0;

    const result = runPredictor(profile, successRate);

    // Save score to profile
    await StudentProfile.findOneAndUpdate(
      { userId: req.user!._id },
      { $set: { readinessScore: result.readinessScore } }
    );

    sendSuccess(res, result, 'Predictor run successfully');
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/student/dashboard-stats ────────────────────────────────────────
export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await StudentProfile.findOne({ userId: req.user!._id });
    const attempts = await Attempt.find({ studentId: req.user!._id })
      .sort({ submittedAt: -1 })
      .limit(10);

    const totalAttempts = await Attempt.countDocuments({ studentId: req.user!._id });
    const correctAttempts = await Attempt.countDocuments({ studentId: req.user!._id, isCorrect: true });
    const passRate = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;

    sendSuccess(res, {
      profile,
      stats: {
        readinessScore: profile?.readinessScore ?? 0,
        totalAttempts,
        passRate,
        level: profile?.level ?? 1,
        xp: profile?.xp ?? 0,
        badges: profile?.badges ?? [],
        onboardingComplete: profile?.onboardingComplete ?? false,
      },
      recentAttempts: attempts,
    });
  } catch (error) {
    next(error);
  }
};
