import express from 'express';
import {
    processPayment,
    getPaymentHistory,
    getPaymentById
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All payment routes require authentication
router.post('/', authenticate, processPayment); // Main payment endpoint
router.post('/process', authenticate, processPayment); // Alternative endpoint
router.get('/history', authenticate, getPaymentHistory);
router.get('/:id', authenticate, getPaymentById);

export default router;
