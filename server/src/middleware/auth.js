const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/responseHandler');

/**
 * Middleware to protect routes - verifies JWT token
 */
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return errorResponse(res, 'Access denied. No token provided.', 401);
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if user still exists
            const user = await User.findById(decoded.id);

            if (!user) {
                return errorResponse(res, 'User no longer exists', 401);
            }

            // Check if user is active
            if (!user.isActive) {
                return errorResponse(res, 'Your account has been deactivated', 403);
            }

            // Attach user to request object
            req.user = {
                id: decoded.id,
                companyUserName: decoded.companyUserName,
                role: decoded.role
            };

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return errorResponse(res, 'Token has expired. Please login again.', 401);
            }
            if (error.name === 'JsonWebTokenError') {
                return errorResponse(res, 'Invalid token', 401);
            }
            throw error;
        }
    } catch (error) {
        console.error('Auth Middleware Error:', error);
        return errorResponse(res, 'Authentication failed', 500, error.message);
    }
};

/**
 * Middleware to authorize specific roles
 * @param  {...string} roles - Allowed roles
 */
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return errorResponse(res, 'User not authenticated', 401);
        }

        if (!roles.includes(req.user.role)) {
            return errorResponse(
                res,
                `User role '${req.user.role}' is not authorized to access this resource`,
                403
            );
        }

        next();
    };
};

/**
 * Optional authentication - doesn't require token but sets user if valid token is provided
 */
exports.optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return next();
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);

            if (user && user.isActive) {
                req.user = {
                    id: decoded.id,
                    companyUserName: decoded.companyUserName,
                    role: decoded.role
                };
            }
        } catch (error) {
            // Silently fail - optional auth
            console.log('Optional auth failed:', error.message);
        }

        next();
    } catch (error) {
        console.error('Optional Auth Middleware Error:', error);
        next();
    }
};
