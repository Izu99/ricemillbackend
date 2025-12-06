const { body } = require('express-validator');

/**
 * Validation rules for user registration
 */
exports.registerValidation = [
    body('firstName')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('First name can only contain letters'),

    body('lastName')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Last name can only contain letters'),

    body('nic')
        .trim()
        .notEmpty().withMessage('NIC is required')
        .matches(/^(\d{9}[vVxX]|\d{12})$/).withMessage('Please enter a valid NIC number (9 digits + V or 12 digits)'),

    body('address')
        .trim()
        .notEmpty().withMessage('Address is required')
        .isLength({ max: 200 }).withMessage('Address cannot exceed 200 characters'),

    body('phoneNumber')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^\+?[\d\s\-()]+$/).withMessage('Please enter a valid phone number'),

    body('companyName')
        .trim()
        .notEmpty().withMessage('Company name is required')
        .isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),

    body('companyUserName')
        .trim()
        .notEmpty().withMessage('Company user name is required')
        .isLength({ min: 3, max: 30 }).withMessage('Company user name must be between 3-30 characters')
        .matches(/^[a-z0-9_-]+$/).withMessage('Company user name can only contain lowercase letters, numbers, underscore, and hyphen')
        .toLowerCase(),

    body('companyAddress')
        .trim()
        .notEmpty().withMessage('Company address is required')
        .isLength({ max: 200 }).withMessage('Company address cannot exceed 200 characters'),

    body('companyPhoneNumber')
        .trim()
        .notEmpty().withMessage('Company phone number is required')
        .matches(/^\+?[\d\s\-()]+$/).withMessage('Please enter a valid company phone number'),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),

    body('confirmPassword')
        .notEmpty().withMessage('Please confirm your password')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

/**
 * Validation rules for user login
 * Users can login with either phoneNumber or companyUserName
 */
exports.loginValidation = [
    body('phoneNumber')
        .optional()
        .trim()
        .notEmpty().withMessage('Phone number cannot be empty if provided'),

    body('companyUserName')
        .optional()
        .trim()
        .notEmpty().withMessage('Company user name cannot be empty if provided'),

    body('password')
        .notEmpty().withMessage('Password is required'),

    // Custom validation to ensure at least one login method is provided
    body().custom((value, { req }) => {
        if (!req.body.phoneNumber && !req.body.companyUserName) {
            throw new Error('Please provide either phoneNumber or companyUserName');
        }
        return true;
    })
];

/**
 * Validation rules for profile update
 */
exports.updateProfileValidation = [
    body('firstName')
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('First name can only contain letters'),

    body('lastName')
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Last name can only contain letters'),

    body('address')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Address cannot exceed 200 characters'),

    body('phoneNumber')
        .optional()
        .trim()
        .matches(/^\+?[\d\s\-()]+$/).withMessage('Please enter a valid phone number'),

    body('companyName')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),

    body('companyAddress')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Company address cannot exceed 200 characters'),

    body('companyPhoneNumber')
        .optional()
        .trim()
        .matches(/^\+?[\d\s\-()]+$/).withMessage('Please enter a valid company phone number')
];

/**
 * Validation rules for password change
 */
exports.changePasswordValidation = [
    body('currentPassword')
        .notEmpty().withMessage('Current password is required'),

    body('newPassword')
        .notEmpty().withMessage('New password is required')
        .isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),

    body('confirmNewPassword')
        .notEmpty().withMessage('Please confirm your new password')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

/**
 * Validation rules for customer creation
 */
exports.createCustomerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Customer name is required')
        .isLength({ max: 100 }).withMessage('Customer name cannot exceed 100 characters'),

    body('phoneNumber')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^\+?[\d\s\-()]+$/).withMessage('Please enter a valid phone number'),

    body('address')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Address cannot exceed 200 characters')
];

/**
 * Validation rules for customer update
 */
exports.updateCustomerValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Customer name cannot exceed 100 characters'),

    body('phoneNumber')
        .optional()
        .trim()
        .matches(/^\+?[\d\s\-()]+$/).withMessage('Please enter a valid phone number'),

    body('address')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Address cannot exceed 200 characters'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean')
];

/**
 * Validation rules for paddy type creation
 */
exports.createPaddyTypeValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Paddy type name is required')
        .isLength({ max: 50 }).withMessage('Paddy type name cannot exceed 50 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters')
];

/**
 * Validation rules for paddy type update
 */
exports.updatePaddyTypeValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ max: 50 }).withMessage('Paddy type name cannot exceed 50 characters'),

    body('description')
        .optional()
        .trim()
        .isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters'),

    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean')
];

/**
 * Validation rules for purchase creation
 */
exports.createPurchaseValidation = [
    body('customerId')
        .notEmpty().withMessage('Customer ID is required')
        .isMongoId().withMessage('Invalid customer ID'),

    body('paddyTypeId')
        .notEmpty().withMessage('Paddy type ID is required')
        .isMongoId().withMessage('Invalid paddy type ID'),

    body('numberOfBags')
        .notEmpty().withMessage('Number of bags is required')
        .isInt({ min: 1 }).withMessage('Number of bags must be at least 1'),

    body('totalWeight')
        .notEmpty().withMessage('Total weight is required')
        .isFloat({ min: 0.1 }).withMessage('Total weight must be greater than 0'),

    body('pricePerKg')
        .notEmpty().withMessage('Price per kg is required')
        .isFloat({ min: 0 }).withMessage('Price must be a positive number'),

    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];

/**
 * Validation rules for purchase update
 */
exports.updatePurchaseValidation = [
    body('numberOfBags')
        .optional()
        .isInt({ min: 1 }).withMessage('Number of bags must be at least 1'),

    body('totalWeight')
        .optional()
        .isFloat({ min: 0.1 }).withMessage('Total weight must be greater than 0'),

    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];
