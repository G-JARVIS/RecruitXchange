import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { requestSession, getMySessions, getAllSessions, updateSessionStatus } from '../controllers/counselingController';

const router = Router();

// Student routes
router.post('/request', protect, authorize('student'), requestSession);
router.get('/my-sessions', protect, authorize('student'), getMySessions);

// Admin routes
router.get('/all', protect, authorize('admin'), getAllSessions);
router.put('/:id/status', protect, authorize('admin'), updateSessionStatus);

export default router;
