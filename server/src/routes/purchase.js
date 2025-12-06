const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const { protect } = require('../middleware/auth');
const {
    createPurchaseValidation,
    updatePurchaseValidation
} = require('../middleware/validators');

/**
 * @route   GET /api/purchases/summary
 * @desc    Get purchase summary and statistics
 * @access  Private
 * @note    Must be before /:id route
 */
router.get('/summary', protect, purchaseController.getPurchaseSummary);

/**
 * @route   POST /api/purchases
 * @desc    Create a new purchase
 * @access  Private
 */
router.post('/', protect, ...createPurchaseValidation, purchaseController.createPurchase);

/**
 * @route   GET /api/purchases
 * @desc    Get all purchases with filtering
 * @access  Private
 */
router.get('/', protect, purchaseController.getPurchases);

/**
 * @route   GET /api/purchases/:id
 * @desc    Get purchase by ID
 * @access  Private
 */
router.get('/:id', protect, purchaseController.getPurchaseById);

/**
 * @route   PUT /api/purchases/:id
 * @desc    Update purchase
 * @access  Private
 */
router.put('/:id', protect, ...updatePurchaseValidation, purchaseController.updatePurchase);

/**
 * @route   DELETE /api/purchases/:id
 * @desc    Delete purchase
 * @access  Private
 */
router.delete('/:id', protect, purchaseController.deletePurchase);

module.exports = router;
