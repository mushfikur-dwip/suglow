import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderDetails,
  updateOrderStatus,
  getAllOrders,
  getOrderStats,
  getAdminOrderDetails
} from '../controllers/orderController.js';
import { authMiddleware, adminMiddleware, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', optionalAuth, createOrder);
router.get('/', authMiddleware, getOrders);
router.get('/admin/all', authMiddleware, adminMiddleware, getAllOrders);
router.get('/admin/stats', authMiddleware, adminMiddleware, getOrderStats);
router.get('/admin/:id', authMiddleware, adminMiddleware, getAdminOrderDetails);
router.get('/:id', authMiddleware, getOrderDetails);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
