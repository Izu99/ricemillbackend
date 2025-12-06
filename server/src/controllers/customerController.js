const Customer = require('../models/Customer');
const { validationResult } = require('express-validator');
const { errorResponse, successResponse } = require('../utils/responseHandler');

/**
 * @desc    Create a new customer
 * @route   POST /api/customers
 * @access  Private
 */
exports.createCustomer = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }

        const { name, phoneNumber, address } = req.body;

        // Check if customer with same phone already exists for this user
        const existingCustomer = await Customer.findOne({
            userId: req.user.id,
            phoneNumber
        });

        if (existingCustomer) {
            return errorResponse(res, 'Customer with this phone number already exists', 409);
        }

        // Create customer
        const customer = await Customer.create({
            name,
            phoneNumber,
            address,
            userId: req.user.id
        });

        return successResponse(res, 'Customer created successfully', {
            customer: customer.getPublicProfile()
        }, 201);

    } catch (error) {
        console.error('Create Customer Error:', error);
        return errorResponse(res, 'Error creating customer', 500, error.message);
    }
};

/**
 * @desc    Get all customers
 * @route   GET /api/customers
 * @access  Private
 */
exports.getCustomers = async (req, res) => {
    try {
        const { search, isActive } = req.query;

        // Build query
        const query = { userId: req.user.id };

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { phoneNumber: { $regex: search, $options: 'i' } }
            ];
        }

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const customers = await Customer.find(query).sort({ createdAt: -1 });

        return successResponse(res, 'Customers retrieved successfully', {
            customers: customers.map(c => c.getPublicProfile()),
            count: customers.length
        });

    } catch (error) {
        console.error('Get Customers Error:', error);
        return errorResponse(res, 'Error retrieving customers', 500, error.message);
    }
};

/**
 * @desc    Get customer by ID
 * @route   GET /api/customers/:id
 * @access  Private
 */
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!customer) {
            return errorResponse(res, 'Customer not found', 404);
        }

        return successResponse(res, 'Customer retrieved successfully', {
            customer: customer.getPublicProfile()
        });

    } catch (error) {
        console.error('Get Customer Error:', error);
        return errorResponse(res, 'Error retrieving customer', 500, error.message);
    }
};

/**
 * @desc    Update customer
 * @route   PUT /api/customers/:id
 * @access  Private
 */
exports.updateCustomer = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return errorResponse(res, 'Validation failed', 400, errors.array());
        }

        const allowedUpdates = ['name', 'phoneNumber', 'address', 'isActive'];
        const updates = {};

        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const customer = await Customer.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            updates,
            { new: true, runValidators: true }
        );

        if (!customer) {
            return errorResponse(res, 'Customer not found', 404);
        }

        return successResponse(res, 'Customer updated successfully', {
            customer: customer.getPublicProfile()
        });

    } catch (error) {
        console.error('Update Customer Error:', error);
        return errorResponse(res, 'Error updating customer', 500, error.message);
    }
};

/**
 * @desc    Delete customer
 * @route   DELETE /api/customers/:id
 * @access  Private
 */
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findOneAndDelete({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!customer) {
            return errorResponse(res, 'Customer not found', 404);
        }

        return successResponse(res, 'Customer deleted successfully');

    } catch (error) {
        console.error('Delete Customer Error:', error);
        return errorResponse(res, 'Error deleting customer', 500, error.message);
    }
};
