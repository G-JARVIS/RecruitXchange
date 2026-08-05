import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// ─── Extend Express Request ───────────────────────────────────────────────────
declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser;
  }
}

// ─── JWT Token Payload ────────────────────────────────────────────────────────
interface JwtPayload {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

// ─── Protect Route (Require Authentication) ───────────────────────────────────
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Check Authorization header
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Also check cookie (for web-browser sessions)
    else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized — no token provided',
      });
      return;
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as JwtPayload;

    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }

    if (user.status === 'suspended') {
      res.status(403).json({ success: false, message: 'Account suspended' });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, message: 'Token expired — please log in again' });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ success: false, message: 'Invalid token' });
      return;
    }
    res.status(500).json({ success: false, message: 'Authentication error' });
  }
};

// ─── Role-Based Access Control ────────────────────────────────────────────────
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`,
      });
      return;
    }
    next();
  };
};

// ─── Optional Auth (does NOT reject unauthenticated, just attaches user if present) ─
export const optionalAuth = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret'
      ) as JwtPayload;
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.status !== 'suspended') {
        req.user = user;
      }
    }
  } catch {
    // Silently ignore errors in optional auth
  }
  next();
};
