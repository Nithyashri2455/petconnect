import jwt from 'jsonwebtoken';

// Verify JWT token
export const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please login again.'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
};

// Check if user is premium
export const requirePremium = (req, res, next) => {
    if (!req.user.isPremium) {
        return res.status(403).json({
            success: false,
            message: 'This feature requires a premium membership.'
        });
    }
    next();
};

// Optional authentication (doesn't fail if no token)
export const optionalAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }
    } catch (error) {
        // Continue without user if token is invalid
        req.user = null;
    }
    next();
};
