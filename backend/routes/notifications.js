import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getNotificationSettings, updateNotificationSettings } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', authMiddleware, getNotificationSettings);
router.put('/', authMiddleware, updateNotificationSettings);

export default router;
