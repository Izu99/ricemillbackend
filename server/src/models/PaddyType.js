const mongoose = require('mongoose');

const PaddyTypeSchema = new mongoose.Schema({
    // Paddy Type Details
    name: {
        type: String,
        required: [true, 'Paddy type name is required'],
        trim: true,
        maxlength: [50, 'Paddy type name cannot exceed 50 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description cannot exceed 200 characters']
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

// Compound index to ensure unique paddy type names per user
PaddyTypeSchema.index({ userId: 1, name: 1 }, { unique: true });

// Method to get public profile
PaddyTypeSchema.methods.getPublicProfile = function () {
    return {
        id: this._id,
        name: this.name,
        description: this.description,
        isActive: this.isActive,
        createdAt: this.createdAt
    };
};

module.exports = mongoose.model('PaddyType', PaddyTypeSchema);
