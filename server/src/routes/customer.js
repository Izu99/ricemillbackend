const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { protect } = require('../middleware/auth');
const {
    createCustomerValidation,
    updateCustomerValidation
} = require('../middleware/validators');

/**
 * @route   POST /api/customers
 * @desc    Create a new customer
 * @access  Private
 */
router.post('/', protect, ...createCustomerValidation, customerController.createCustomer);

/**
 * @route   GET /api/customers
 * @desc    Get all customers
 * @access  Private
 */
router.get('/', protect, customerController.getCustomers);

/**
 * @route   GET /api/customers/:id
 * @desc    Get customer by ID
 * @access  Private
 */
router.get('/:id', protect, customerController.getCustomerById);

/**
 * @route   PUT /api/customers/:id
 * @desc    Update customer
 * @access  Private
 */
router.put('/:id', protect, ...updateCustomerValidation, customerController.updateCustomer);

/**
 * @route   DELETE /api/customers/:id
 * @desc    Delete customer
 * @access  Private
 */
router.delete('/:id', protect, customerController.deleteCustomer);

module.exports = router;
