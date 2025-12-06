const express = require('express');
const router = express.Router();
const paddyTypeController = require('../controllers/paddyTypeController');
const { protect } = require('../middleware/auth');
const {
    createPaddyTypeValidation,
    updatePaddyTypeValidation
} = require('../middleware/validators');

/**
 * @route   POST /api/paddy-types
 * @desc    Create a new paddy type
 * @access  Private
 */
router.post('/', protect, ...createPaddyTypeValidation, paddyTypeController.createPaddyType);

/**
 * @route   GET /api/paddy-types
 * @desc    Get all paddy types
 * @access  Private
 */
router.get('/', protect, paddyTypeController.getPaddyTypes);

/**
 * @route   GET /api/paddy-types/:id
 * @desc    Get paddy type by ID
 * @access  Private
 */
router.get('/:id', protect, paddyTypeController.getPaddyTypeById);

/**
 * @route   PUT /api/paddy-types/:id
 * @desc    Update paddy type
 * @access  Private
 */
router.put('/:id', protect, ...updatePaddyTypeValidation, paddyTypeController.updatePaddyType);

/**
 * @route   DELETE /api/paddy-types/:id
 * @desc    Delete paddy type
 * @access  Private
 */
router.delete('/:id', protect, paddyTypeController.deletePaddyType);

module.exports = router;
