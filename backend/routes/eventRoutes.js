import express from 'express';
import { getEvents, getEventById, createEvent } from '../controllers/eventController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Public routes (with optional auth to filter premium events)
router.get('/', optionalAuth, getEvents);
router.get('/:id', optionalAuth, getEventById);

// Protected routes (for creating events - admin functionality)
router.post('/', createEvent);

export default router;
