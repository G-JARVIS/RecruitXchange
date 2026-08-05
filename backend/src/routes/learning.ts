import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth';
import { getPaths, getPathById, getLessons, getLessonById, markLessonComplete } from '../controllers/learningController';

const router = Router();

router.get('/paths', optionalAuth, getPaths);
router.get('/paths/:id', optionalAuth, getPathById);
router.get('/lessons', optionalAuth, getLessons);
router.get('/lessons/:id', optionalAuth, getLessonById);

// Protected
router.post('/lessons/:id/complete', protect, markLessonComplete);

export default router;
