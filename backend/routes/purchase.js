import express from 'express';
import {
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrderStatus,
  deletePurchaseOrder,
  getPurchaseStats,
  getSuppliers,
  createSupplier,
  updateSupplier
} from '../controllers/purchaseController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin access
router.use(authMiddleware, adminMiddleware);

// Supplier routes (must be before :id route)
router.get('/suppliers/all', getSuppliers);
router.post('/suppliers', createSupplier);
router.put('/suppliers/:id', updateSupplier);

// Purchase order routes
router.get('/', getPurchaseOrders);
router.get('/stats', getPurchaseStats);
router.get('/:id', getPurchaseOrderById);
router.post('/', createPurchaseOrder);
router.put('/:id/status', updatePurchaseOrderStatus);
router.delete('/:id', deletePurchaseOrder);

export default router;
