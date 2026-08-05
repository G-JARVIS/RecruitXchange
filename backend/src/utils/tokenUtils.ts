import jwt from 'jsonwebtoken';
import { Response } from 'express';
import mongoose from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

interface TokenPayload {
  id: string;
  role: string;
}

// ─── Generate JWT Token ────────────────────────────────────────────────────────
export const generateToken = (
  userId: mongoose.Types.ObjectId | string,
  role: string
): string => {
  return jwt.sign(
    { id: userId.toString(), role } as TokenPayload,
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE } as jwt.SignOptions
  );
};

// ─── Send Token as Cookie + JSON Response ─────────────────────────────────────
export const sendTokenResponse = (
  userId: mongoose.Types.ObjectId | string,
  role: string,
  statusCode: number,
  res: Response,
  data: Record<string, unknown>
): void => {
  const token = generateToken(userId, role);

  const cookieExpireDays = parseInt(process.env.JWT_COOKIE_EXPIRE || '7', 10);
  const cookieOptions = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    token,
    ...data,
  });
};

// ─── Verify Token (utility, not middleware) ───────────────────────────────────
export const verifyToken = (token: string): TokenPayload => {
  return jwt.verify(token, JWT_SECRET) as TokenPayload;
};
