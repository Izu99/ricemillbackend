const User = require('../models/User');
const { validationResult } = require('express-validator');
const { errorResponse, successResponse } = require('../utils/responseHandler');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }

        const {
            firstName,
            lastName,
            nic,
            address,
            phoneNumber,
            companyName,
            companyUserName,
            companyAddress,
            companyPhoneNumber,
            password
        } = req.body;

        // Check if user already exists (by NIC, company username, or phone number)
        const existingUser = await User.findOne({
            $or: [{ nic }, { companyUserName }, { phoneNumber }]
        });

        if (existingUser) {
            if (existingUser.nic === nic) {
                return errorResponse(res, 'User with this NIC already exists', 409);
            }
            if (existingUser.companyUserName === companyUserName) {
                return errorResponse(res, 'Company user name is already taken', 409);
            }
            if (existingUser.phoneNumber === phoneNumber) {
                return errorResponse(res, 'Phone number is already registered', 409);
            }
        }

        // Create new user
        const user = await User.create({
            firstName,
            lastName,
            nic,
            address,
            phoneNumber,
            companyName,
            companyUserName,
            companyAddress,
            companyPhoneNumber,
            password
        });

        // Generate JWT token
        const token = user.generateAuthToken();

        // Get public profile
        const userProfile = user.getPublicProfile();

        return successResponse(res, 'User registered successfully', {
            user: userProfile,
            token
        }, 201);

    } catch (error) {
        console.error('Register Error:', error);

        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return errorResponse(res, `${field} already exists`, 409);
        }

        return errorResponse(res, 'Error registering user', 500, error.message);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }

        const { phoneNumber, companyUserName, password } = req.body;

        // Build query based on which field is provided
        const query = {};
        if (phoneNumber) {
            query.phoneNumber = phoneNumber;
        } else if (companyUserName) {
            query.companyUserName = companyUserName;
        }

        // Find user by phone number OR company username and include password
        const user = await User.findOne(query).select('+password');

        if (!user) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        // Check if account is active
        if (!user.isActive) {
            return errorResponse(res, 'Your account has been deactivated. Please contact support.', 403);
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            return errorResponse(res, 'Invalid credentials', 401);
        }

        // Update last login time
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false });

        // Generate JWT token
        const token = user.generateAuthToken();

        // Get public profile
        const userProfile = user.getPublicProfile();

        return successResponse(res, 'Login successful', {
            user: userProfile,
            token
        });

    } catch (error) {
        console.error('Login Error:', error);
        return errorResponse(res, 'Error logging in', 500, error.message);
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getCurrentUser = async (req, res) => {
    try {
        // User is already attached to req by auth middleware
        const user = await User.findById(req.user.id);

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        const userProfile = user.getPublicProfile();

        return successResponse(res, 'User profile retrieved successfully', {
            user: userProfile
        });

    } catch (error) {
        console.error('Get Current User Error:', error);
        return errorResponse(res, 'Error retrieving user profile', 500, error.message);
    }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
exports.updateProfile = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }

        const allowedUpdates = [
            'firstName',
            'lastName',
            'address',
            'phoneNumber',
            'companyName',
            'companyAddress',
            'companyPhoneNumber'
        ];

        // Filter only allowed fields
        const updates = {};
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const user = await User.findByIdAndUpdate(
            req.user.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        const userProfile = user.getPublicProfile();

        return successResponse(res, 'Profile updated successfully', {
            user: userProfile
        });

    } catch (error) {
        console.error('Update Profile Error:', error);
        return errorResponse(res, 'Error updating profile', 500, error.message);
    }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
exports.changePassword = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }

        const { currentPassword, newPassword } = req.body;

        // Get user with password
        const user = await User.findById(req.user.id).select('+password');

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);

        if (!isPasswordValid) {
            return errorResponse(res, 'Current password is incorrect', 401);
        }

        // Update password
        user.password = newPassword;
        await user.save();

        return successResponse(res, 'Password changed successfully');

    } catch (error) {
        console.error('Change Password Error:', error);
        return errorResponse(res, 'Error changing password', 500, error.message);
    }
};
