import express from 'express';
import { 
  getAllReturns, 
  getReturnStats, 
  processRefund,
  cancelRefund
} from '../controllers/returnController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require admin authentication
router.get('/', authMiddleware, adminMiddleware, getAllReturns);
router.get('/stats', authMiddleware, adminMiddleware, getReturnStats);
router.put('/:id/refund', authMiddleware, adminMiddleware, processRefund);
router.put('/:id/cancel', authMiddleware, adminMiddleware, cancelRefund);

export default router;
