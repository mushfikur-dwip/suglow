import express from 'express';
import { getRewards, addRewardPoints } from '../controllers/rewardsController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get user rewards (requires authentication)
router.get('/', authMiddleware, getRewards);

// Add reward points (admin only)
router.post('/', authMiddleware, adminMiddleware, addRewardPoints);

export default router;
