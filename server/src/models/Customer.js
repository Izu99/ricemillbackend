const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    // Customer/Farmer Details
    name: {
        type: String,
        required: [true, 'Customer name is required'],
        trim: true,
        maxlength: [100, 'Customer name cannot exceed 100 characters']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        validate: {
            validator: function (v) {
                return /^\+?[\d\s\-()]+$/.test(v);
            },
            message: 'Please enter a valid phone number'
        }
    },
    address: {
        type: String,
        trim: true,
        maxlength: [200, 'Address cannot exceed 200 characters']
    },

    // Reference to User (Rice Mill Owner)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Status
    isActive: {
        type: Boolean,
        default: true
    },

    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
CustomerSchema.index({ userId: 1, phoneNumber: 1 });
CustomerSchema.index({ userId: 1, name: 1 });

// Method to get public profile
CustomerSchema.methods.getPublicProfile = function () {
    return {
        id: this._id,
        name: this.name,
        phoneNumber: this.phoneNumber,
        address: this.address,
        isActive: this.isActive,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model('Customer', CustomerSchema);
