import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import StudentProfile from '../models/StudentProfile';
import { sendTokenResponse } from '../utils/tokenUtils';
import { sendSuccess, sendError } from '../utils/apiResponse';
import { AppError } from '../middleware/errorHandler';
import { generateToken } from '../utils/tokenUtils';

// ─── POST /api/auth/register ──────────────────────────────────────────────────
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role = 'student' } = req.body;

    // Validate
    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required', 400);
    }

    // Check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    // Only allow student role from public registration
    const allowedRole = role === 'admin' ? 'student' : role;

    const user = await User.create({
      name,
      email,
      password,
      role: allowedRole,
      authProvider: 'local',
      status: 'active',
    });

    // Create empty student profile
    if (allowedRole === 'student') {
      await StudentProfile.create({
        userId: user._id,
        college: 'K.J. Somaiya College of Engineering',
        department: 'Computer Engineering',
        yearOfStudy: '3rd Year',
        cgpa: 0,
        activeBacklogs: 0,
        skills: [],
        interests: [],
        onboardingComplete: false,
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user._id, user.role, 201, res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    // Include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      throw new AppError('Invalid credentials', 401);
    }

    if (user.authProvider === 'google') {
      throw new AppError('Please sign in with Google', 400);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    if (user.status === 'suspended') {
      throw new AppError('Your account has been suspended. Contact admin.', 403);
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Fetch student profile if applicable
    const profile = user.role === 'student'
      ? await StudentProfile.findOne({ userId: user._id })
      : null;

    sendTokenResponse(user._id, user.role, 200, res, {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        avatar: user.avatar,
        profile: profile || undefined,
        onboardingComplete: profile?.onboardingComplete ?? false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user!;
    const profile = user.role === 'student'
      ? await StudentProfile.findOne({ userId: user._id })
      : null;

    sendSuccess(res, {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar,
      lastLogin: user.lastLogin,
      profile: profile || undefined,
      onboardingComplete: profile?.onboardingComplete ?? false,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/auth/validate ───────────────────────────────────────────────────
export const validateSession = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // If protect middleware passed, session is valid
    sendSuccess(res, { valid: true, userId: req.user!._id, role: req.user!.role });
  } catch (error) {
    next(error);
  }
};

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
export const logout = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    res.cookie('token', '', {
      httpOnly: true,
      expires: new Date(0),
      secure: process.env.NODE_ENV === 'production',
    });
    sendSuccess(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/auth/google/callback ───────────────────────────────────────────
export const googleCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = req.user!;
    const token = generateToken(user._id, user.role);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    // Redirect to frontend with token
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  } catch (error) {
    next(error);
  }
};
