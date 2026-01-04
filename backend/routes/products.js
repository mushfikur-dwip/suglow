import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/by-slug/:slug', getProductBySlug); // Changed to avoid conflict
router.get('/:id', authMiddleware, adminMiddleware, getProductById); // Admin get by ID
router.post('/', authMiddleware, adminMiddleware, upload.single('main_image'), createProduct);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('main_image'), updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;
