const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
    // Personal Details
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    nic: {
        type: String,
        required: [true, 'NIC is required'],
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                // Sri Lankan NIC format: 9 digits + V or 12 digits
                return /^(\d{9}[vVxX]|\d{12})$/.test(v);
            },
            message: 'Please enter a valid NIC number'
        }
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        maxlength: [200, 'Address cannot exceed 200 characters']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        unique: true,
        trim: true,
        validate: {
            validator: function (v) {
                // International phone format
                return /^\+?[\d\s\-()]+$/.test(v);
            },
            message: 'Please enter a valid phone number'
        }
    },

    // Company Details
    companyName: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    companyUserName: {
        type: String,
        required: [true, 'Company user name is required'],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [3, 'Company user name must be at least 3 characters'],
        maxlength: [30, 'Company user name cannot exceed 30 characters'],
        validate: {
            validator: function (v) {
                // Only alphanumeric, underscore, and hyphen allowed
                return /^[a-z0-9_-]+$/.test(v);
            },
            message: 'Company user name can only contain lowercase letters, numbers, underscore, and hyphen'
        }
    },
    companyAddress: {
        type: String,
        required: [true, 'Company address is required'],
        trim: true,
        maxlength: [200, 'Company address cannot exceed 200 characters']
    },
    companyPhoneNumber: {
        type: String,
        required: [true, 'Company phone number is required'],
        trim: true,
        validate: {
            validator: function (v) {
                return /^\+?[\d\s\-()]+$/.test(v);
            },
            message: 'Please enter a valid company phone number'
        }
    },

    // Authentication
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't return password by default
    },

    // Account Status
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'manager'],
        default: 'user'
    },

    // Metadata
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function () {
    // Only hash if password is modified
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function () {
    const payload = {
        id: this._id,
        companyUserName: this.companyUserName,
        role: this.role
    };

    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Method to get public profile (without sensitive data)
UserSchema.methods.getPublicProfile = function () {
    return {
        id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        nic: this.nic,
        address: this.address,
        phoneNumber: this.phoneNumber,
        companyName: this.companyName,
        companyUserName: this.companyUserName,
        companyAddress: this.companyAddress,
        companyPhoneNumber: this.companyPhoneNumber,
        role: this.role,
        isActive: this.isActive,
        createdAt: this.createdAt,
        lastLogin: this.lastLogin
    };
};

module.exports = mongoose.model('User', UserSchema);
