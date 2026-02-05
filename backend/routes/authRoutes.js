import express from 'express';
import { register, login, getCurrentUser, googleAuth } from '../controllers/authController.js';
import { registerValidation, loginValidation } from '../middleware/validators.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/google', googleAuth);

// Protected routes
router.get('/me', authenticate, getCurrentUser);

export default router;
