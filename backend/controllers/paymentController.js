import db from '../config/database.js';

// Process payment (mock implementation)
export const processPayment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bookingId, amount, paymentType, paymentMethod, cardLast4 } = req.body;

        // Default payment type to 'booking' if not specified
        const type = paymentType || 'booking';
        
        // Validate payment type
        const validTypes = ['booking', 'premium_upgrade'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment type'
            });
        }

        // If booking payment, verify booking exists and belongs to user
        if (type === 'booking' && bookingId) {
            const [bookings] = await db.query(
                'SELECT id FROM bookings WHERE id = ? AND user_id = ?',
                [bookingId, userId]
            );

            if (bookings.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }
        }

        // Generate mock transaction ID
        const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 10000)}`;

        // Create payment record
        const [result] = await db.query(
            `INSERT INTO payments (user_id, booking_id, amount, payment_type, payment_method, transaction_id, status)
            VALUES (?, ?, ?, ?, ?, ?, 'completed')`,
            [userId, bookingId || null, amount, type, paymentMethod || 'card', transactionId]
        );

        // If premium upgrade, update user status
        if (type === 'premium_upgrade') {
            await db.query(
                'UPDATE users SET is_premium = true WHERE id = ?',
                [userId]
            );
        }

        res.status(201).json({
            success: true,
            message: 'Payment processed successfully',
            data: {
                id: result.insertId,
                paymentId: result.insertId,
                transactionId,
                amount: parseFloat(amount),
                status: 'completed',
                cardLast4: cardLast4 || '****'
            }
        });
    } catch (error) {
        console.error('Process payment error:', error);
        res.status(500).json({
            success: false,
            message: 'Error processing payment',
            error: error.message
        });
    }
};

// Get user's payment history
export const getPaymentHistory = async (req, res) => {
    try {
        const userId = req.user.id;

        const [payments] = await db.query(
            `SELECT p.*, b.booking_date, b.booking_time, s.name as service_name
            FROM payments p
            LEFT JOIN bookings b ON p.booking_id = b.id
            LEFT JOIN services s ON b.service_id = s.id
            WHERE p.user_id = ?
            ORDER BY p.created_at DESC`,
            [userId]
        );

        const formattedPayments = payments.map(payment => ({
            id: payment.id,
            bookingId: payment.booking_id,
            serviceName: payment.service_name,
            bookingDate: payment.booking_date,
            bookingTime: payment.booking_time,
            amount: parseFloat(payment.amount),
            paymentType: payment.payment_type,
            paymentMethod: payment.payment_method,
            transactionId: payment.transaction_id,
            status: payment.status,
            createdAt: payment.created_at
        }));

        res.json({
            success: true,
            count: formattedPayments.length,
            data: formattedPayments
        });
    } catch (error) {
        console.error('Get payment history error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment history',
            error: error.message
        });
    }
};

// Get payment by ID
export const getPaymentById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const [payments] = await db.query(
            `SELECT p.*, b.booking_date, b.booking_time, s.name as service_name
            FROM payments p
            LEFT JOIN bookings b ON p.booking_id = b.id
            LEFT JOIN services s ON b.service_id = s.id
            WHERE p.id = ? AND p.user_id = ?`,
            [id, userId]
        );

        if (payments.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found'
            });
        }

        const payment = payments[0];

        res.json({
            success: true,
            data: {
                id: payment.id,
                bookingId: payment.booking_id,
                serviceName: payment.service_name,
                bookingDate: payment.booking_date,
                bookingTime: payment.booking_time,
                amount: parseFloat(payment.amount),
                paymentType: payment.payment_type,
                paymentMethod: payment.payment_method,
                transactionId: payment.transaction_id,
                status: payment.status,
                createdAt: payment.created_at
            }
        });
    } catch (error) {
        console.error('Get payment by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching payment',
            error: error.message
        });
    }
};
