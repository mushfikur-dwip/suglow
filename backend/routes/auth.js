import express from 'express';
import { register, login, getProfile, updateProfile, uploadProfilePicture as uploadProfilePictureController } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import { uploadProfilePicture } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/profile/picture', authMiddleware, uploadProfilePicture, uploadProfilePictureController);

export default router;
