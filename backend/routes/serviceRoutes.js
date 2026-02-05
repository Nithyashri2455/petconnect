import express from 'express';
import { getServices, getServiceById, createService } from '../controllers/serviceController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes (with optional auth for personalization)
router.get('/', optionalAuth, getServices);
router.get('/:id', optionalAuth, getServiceById);

// Protected routes (for creating services - admin functionality)
router.post('/', createService);

export default router;
