import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } from '../controllers/addressController.js';

const router = express.Router();

router.get('/', authMiddleware, getAddresses);
router.post('/', authMiddleware, createAddress);
router.put('/:id', authMiddleware, updateAddress);
router.delete('/:id', authMiddleware, deleteAddress);
router.patch('/:id/default', authMiddleware, setDefaultAddress);

export default router;
