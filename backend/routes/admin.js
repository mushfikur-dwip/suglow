import express from 'express';
import {
  getDashboardStats,
  getCustomers,
  getCustomerStats,
  getCustomerDetails,
  updateCustomerStatus,
  getReviews,
  updateReviewStatus
} from '../controllers/adminController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/dashboard', getDashboardStats);
router.get('/customers', getCustomers);
router.get('/customers/stats', getCustomerStats);
router.get('/customers/:id', getCustomerDetails);
router.put('/customers/:id/status', updateCustomerStatus);
router.get('/reviews', getReviews);
router.put('/reviews/:id/status', updateReviewStatus);

export default router;
