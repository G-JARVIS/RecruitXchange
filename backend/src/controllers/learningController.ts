import { Request, Response, NextFunction } from 'express';
import LearningPath from '../models/LearningPath';
import Lesson from '../models/Lesson';
import StudentProfile from '../models/StudentProfile';
import Notification from '../models/Notification';
import { sendSuccess, sendPaginated } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';

// ─── GET /api/learning/paths ──────────────────────────────────────────────────
export const getPaths = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1', limit = '12', domain, difficulty, search } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const filter: Record<string, unknown> = { isPublished: true };
    if (domain) filter.domain = domain;
    if (difficulty) filter.difficulty = difficulty;
    if (search) filter.$text = { $search: search as string };

    const total = await LearningPath.countDocuments(filter);
    const paths = await LearningPath.find(filter)
      .sort({ enrollmentCount: -1, rating: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    sendPaginated(res, paths, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/learning/paths/:id ──────────────────────────────────────────────
export const getPathById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const path = await LearningPath.findById(req.params.id).populate({
      path: 'modules.lessonId',
      select: 'title description duration difficulty tags',
    });
    if (!path) throw new AppError('Learning path not found', 404);

    sendSuccess(res, path);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/learning/lessons ────────────────────────────────────────────────
export const getLessons = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = '1', limit = '20', pathId, difficulty, tags } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);

    const filter: Record<string, unknown> = { isPublished: true };
    if (pathId) filter.pathId = pathId;
    if (difficulty) filter.difficulty = difficulty;
    if (tags) filter.tags = { $in: (tags as string).split(',') };

    const total = await Lesson.countDocuments(filter);
    const lessons = await Lesson.find(filter)
      .select('-content -codeSnippets') // Don't send full content in list
      .sort(pathId ? { order: 1 } : { viewCount: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum)
      .lean();

    sendPaginated(res, lessons, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/learning/lessons/:id ───────────────────────────────────────────
export const getLessonById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate({
      path: 'quizQuestions',
      select: 'title type difficulty -correctAnswer -solutionCode',
    });
    if (!lesson) throw new AppError('Lesson not found', 404);

    // Increment view count
    await Lesson.findByIdAndUpdate(lesson._id, { $inc: { viewCount: 1 } });

    sendSuccess(res, lesson);
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/learning/lessons/:id/complete ─────────────────────────────────
export const markLessonComplete = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) throw new AppError('Lesson not found', 404);

    // Award XP for lesson completion
    const xpEarned = lesson.difficulty === 'advanced' ? 25 : lesson.difficulty === 'intermediate' ? 15 : 10;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user!._id },
      { $inc: { xp: xpEarned } },
      { new: true }
    );

    // Check for level up (every 100 XP = 1 level)
    const newLevel = Math.floor((profile?.xp || 0) / 100) + 1;
    if (newLevel > (profile?.level || 1)) {
      await StudentProfile.findOneAndUpdate(
        { userId: req.user!._id },
        { $set: { level: newLevel } }
      );
      await Notification.create({
        userId: req.user!._id,
        type: 'badge_earned',
        title: `Level ${newLevel} Unlocked! 🎉`,
        message: `Congratulations! You've reached Level ${newLevel}. Keep learning!`,
        priority: 'high',
      });
    }

    // Create completion notification
    await Notification.create({
      userId: req.user!._id,
      type: 'lesson_completed',
      title: 'Lesson Completed!',
      message: `You completed "${lesson.title}" and earned ${xpEarned} XP!`,
      relatedId: lesson._id,
      relatedType: 'lesson',
      priority: 'low',
    });

    sendSuccess(res, { xpEarned, currentXp: profile?.xp, level: profile?.level }, `Lesson completed! +${xpEarned} XP`);
  } catch (error) {
    next(error);
  }
};
