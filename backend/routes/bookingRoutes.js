import express from 'express';
import {
    createBooking,
    getUserBookings,
    getBookingById,
    cancelBooking
} from '../controllers/bookingController.js';
import { authenticate, requirePremium } from '../middleware/auth.js';
import { bookingValidation } from '../middleware/validators.js';

const router = express.Router();

// All booking routes require authentication and premium membership
router.post('/', authenticate, requirePremium, bookingValidation, createBooking);
router.get('/', authenticate, getUserBookings);
router.get('/:id', authenticate, getBookingById);
router.patch('/:id/cancel', authenticate, cancelBooking);

export default router;
