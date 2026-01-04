import express from 'express';
import * as stockController from '../controllers/stockController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin privileges
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/stock - Get all stock with filters
router.get('/', stockController.getStock);

// GET /api/stock/stats - Get stock statistics
router.get('/stats', stockController.getStockStats);

// PUT /api/stock/:id - Update stock for a product
router.put('/:id', stockController.updateStock);

// PUT /api/stock/bulk - Bulk update stock
router.put('/bulk/update', stockController.bulkUpdateStock);

export default router;
