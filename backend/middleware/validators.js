import { body, validationResult } from 'express-validator';

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Registration validation rules
export const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    handleValidationErrors
];

// Login validation rules
export const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors
];

// Booking validation rules
export const bookingValidation = [
    body('serviceId')
        .notEmpty()
        .withMessage('Service ID is required')
        .isInt()
        .withMessage('Service ID must be a number'),
    body('bookingDate')
        .notEmpty()
        .withMessage('Booking date is required')
        .isISO8601()
        .withMessage('Please provide a valid date'),
    body('bookingTime')
        .notEmpty()
        .withMessage('Booking time is required')
        .matches(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i)
        .withMessage('Please provide a valid time (e.g., 11:30 AM)'),
    handleValidationErrors
];
