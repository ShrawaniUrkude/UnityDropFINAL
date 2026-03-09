const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['donor', 'ngo', 'volunteer', 'admin'],
        default: 'donor'
    },
    
    // For NGO users
    ngoDetails: {
        ngoName: String,
        registrationNumber: String,
        focus: String,
        address: String,
        verified: { type: Boolean, default: false }
    },
    
    // For Volunteer users
    volunteerDetails: {
        area: String,
        available: { type: Boolean, default: true },
        rating: { type: Number, default: 5 },
        deliveries: { type: Number, default: 0 }
    },
    
    // Account Status
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: Date,
    
    // Verification
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date
    
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
