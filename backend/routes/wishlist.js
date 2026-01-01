import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist
} from '../controllers/wishlistController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// All wishlist routes require authentication
router.get('/', authMiddleware, getWishlist);
router.post('/', authMiddleware, addToWishlist);
router.delete('/:id', authMiddleware, removeFromWishlist);
router.get('/check/:product_id', authMiddleware, checkWishlist);

export default router;
