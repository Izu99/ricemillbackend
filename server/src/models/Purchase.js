const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
    // Purchase Details
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: [true, 'Customer is required']
    },
    paddyTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PaddyType',
        required: [true, 'Paddy type is required']
    },
    numberOfBags: {
        type: Number,
        required: [true, 'Number of bags is required'],
        min: [1, 'Number of bags must be at least 1']
    },
    totalWeight: {
        type: Number,
        required: [true, 'Total weight is required'],
        min: [0.1, 'Total weight must be greater than 0']
    },
    pricePerKg: {
        type: Number,
        required: [true, 'Price per kg is required'],
        min: [0, 'Price cannot be negative']
    },
    totalPrice: {
        type: Number,
        required: true
    },

    // Reference to User (Rice Mill Owner)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Purchase Date
    purchaseDate: {
        type: Date,
        default: Date.now
    },

    // Optional Notes
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },

    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Auto-calculate total price before saving
PurchaseSchema.pre('save', function () {
    this.totalPrice = this.totalWeight * this.pricePerKg;
});

// Indexes for efficient queries
PurchaseSchema.index({ userId: 1, purchaseDate: -1 });
PurchaseSchema.index({ userId: 1, customerId: 1 });
PurchaseSchema.index({ userId: 1, paddyTypeId: 1 });

// Method to get detailed purchase info
PurchaseSchema.methods.getDetailedInfo = function () {
    return {
        id: this._id,
        customer: this.customerId,
        paddyType: this.paddyTypeId,
        numberOfBags: this.numberOfBags,
        totalWeight: this.totalWeight,
        pricePerKg: this.pricePerKg,
        totalPrice: this.totalPrice,
        purchaseDate: this.purchaseDate,
        notes: this.notes,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model('Purchase', PurchaseSchema);
