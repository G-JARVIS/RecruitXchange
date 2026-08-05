import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import { resumeUpload } from '../middleware/upload';
import {
  getProfile,
  updateProfile,
  uploadResume,
  runPredictorForStudent,
  getDashboardStats,
} from '../controllers/studentController';

const router = Router();
router.use(protect);
router.use(authorize('student'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.post('/resume', resumeUpload.single('resume'), uploadResume);
router.get('/predictor', runPredictorForStudent);
router.post('/predictor/run', runPredictorForStudent);
router.get('/dashboard', getDashboardStats);

export default router;
