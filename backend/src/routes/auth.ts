import { Router } from 'express';
import passport from 'passport';
import {
  register,
  login,
  getMe,
  validateSession,
  logout,
  googleCallback,
} from '../controllers/authController';
import { protect } from '../middleware/auth';

const router = Router();

// ─── Public Routes ────────────────────────────────────────────────────────────
router.post('/register', register);
router.post('/login', login);

// ─── Google OAuth ─────────────────────────────────────────────────────────────
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=oauth_failed' }),
  googleCallback
);

// ─── Protected Routes ─────────────────────────────────────────────────────────
router.use(protect);
router.get('/me', getMe);
router.get('/validate', validateSession);
router.post('/logout', logout);

export default router;
