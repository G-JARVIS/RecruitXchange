import { Router } from 'express';
import { protect, authorize, optionalAuth } from '../middleware/auth';
import {
  getDrives,
  getDriveById,
  expressInterest,
  bookmarkDrive,
  getBookmarkedDrives,
} from '../controllers/driveController';

const router = Router();

// Public with optional auth (authenticated students get eligibility filter)
router.get('/', optionalAuth, getDrives);
router.get('/:id', optionalAuth, getDriveById);

// Protected student routes
router.use(protect);
router.use(authorize('student'));
router.post('/:id/interest', expressInterest);
router.post('/:id/bookmark', bookmarkDrive);
router.get('/user/bookmarks', getBookmarkedDrives);

export default router;
