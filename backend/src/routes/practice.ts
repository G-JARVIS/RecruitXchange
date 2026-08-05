import { Router } from 'express';
import { protect, optionalAuth } from '../middleware/auth';
import { getQuestions, getQuestionById, submitAttempt, getAttempts, getMasteryRadar } from '../controllers/practiceController';

const router = Router();

router.get('/questions', optionalAuth, getQuestions);
router.get('/questions/:id', optionalAuth, getQuestionById);
router.post('/questions/:id/attempt', protect, submitAttempt);
router.get('/attempts', protect, getAttempts);
router.get('/mastery', protect, getMasteryRadar);

export default router;
