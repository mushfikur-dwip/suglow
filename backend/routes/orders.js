import express from 'express';
import {
  createOrder,
  getOrders,
  getOrderDetails,
  updateOrderStatus,
  getAllOrders
} from '../controllers/orderController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createOrder);
router.get('/', authMiddleware, getOrders);
router.get('/all', authMiddleware, adminMiddleware, getAllOrders);
router.get('/:id', authMiddleware, getOrderDetails);
router.put('/:id/status', authMiddleware, adminMiddleware, updateOrderStatus);

export default router;
