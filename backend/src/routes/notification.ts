import { Router } from 'express';
import { protect } from '../middleware/auth';
import { getNotifications, markRead, markAllRead, deleteNotification } from '../controllers/notificationController';

const router = Router();

router.use(protect);
router.get('/', getNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);
router.delete('/:id', deleteNotification);

export default router;
