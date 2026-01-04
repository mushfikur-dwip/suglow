import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/reviews - Get all reviews with filters
router.get('/', reviewController.getReviews);

// GET /api/reviews/stats - Get review statistics
router.get('/stats', reviewController.getReviewStats);

// PUT /api/reviews/:id/status - Update review status (approve/reject)
router.put('/:id/status', reviewController.updateReviewStatus);

// DELETE /api/reviews/:id - Delete review
router.delete('/:id', reviewController.deleteReview);

// PUT /api/reviews/bulk/status - Bulk update review status
router.put('/bulk/status', reviewController.bulkUpdateReviewStatus);

export default router;
