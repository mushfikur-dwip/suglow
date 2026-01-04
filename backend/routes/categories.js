import express from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCategories); // Public
router.post('/', authMiddleware, adminMiddleware, createCategory); // Admin only
router.put('/:id', authMiddleware, adminMiddleware, updateCategory); // Admin only
router.delete('/:id', authMiddleware, adminMiddleware, deleteCategory); // Admin only

export default router;
