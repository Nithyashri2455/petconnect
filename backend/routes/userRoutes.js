import express from 'express';
import {
    getProfile,
    updateProfile,
    changePassword,
    upgradeToPremium
} from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All user routes require authentication
router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, updateProfile);
router.patch('/change-password', authenticate, changePassword);
router.post('/upgrade-premium', authenticate, upgradeToPremium);

export default router;
