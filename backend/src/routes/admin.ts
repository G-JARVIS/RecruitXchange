import { Router } from 'express';
import { protect, authorize } from '../middleware/auth';
import {
  getDashboardStats,
  getStudents,
  getStudentById,
  verifyStudent,
  updateUserStatus,
  getModerationQueue,
  moderateQuestion,
} from '../controllers/adminController';
import {
  createDrive,
  updateDriveStatus,
  getDriveApplications,
} from '../controllers/driveController';
import { getAllSessions, updateSessionStatus } from '../controllers/counselingController';

const router = Router();
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// Students
router.get('/students', getStudents);
router.get('/students/:id', getStudentById);
router.patch('/students/:id/verify', verifyStudent);
router.patch('/users/:id/status', updateUserStatus);

// Drives
router.post('/drives', createDrive);
router.patch('/drives/:id/status', updateDriveStatus);
router.get('/drives/:driveId/applications', getDriveApplications);

// Counseling
router.get('/counseling', getAllSessions);
router.put('/counseling/:id/status', updateSessionStatus);

// Moderation
router.get('/moderation/questions', getModerationQueue);
router.patch('/moderation/questions/:id', moderateQuestion);

export default router;
