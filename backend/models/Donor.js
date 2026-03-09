const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
    donorId: {
        type: String,
        unique: true,
        required: true
    },
    // Personal Information
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required']
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    
    // Address
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    
    // Identity
    aadhaar: {
        type: String,
        required: true,
        unique: true
    },
    
    // Organ Donation Details
    organs: [{
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8] // Kidney, Liver, Heart, Lungs, Cornea, Bone Marrow, Pancreas, Skin
    }],
    donationType: {
        type: String,
        enum: ['living', 'posthumous', 'both'],
        required: true
    },
    
    // Medical History
    medicalConditions: { type: String, default: '' },
    smoking: {
        type: String,
        enum: ['never', 'quit', 'occasional', 'regular'],
        default: 'never'
    },
    alcohol: {
        type: String,
        enum: ['never', 'social', 'moderate', 'heavy'],
        default: 'never'
    },
    chronicDisease: { type: String, default: '' },
    previousSurgery: { type: String, default: '' },
    
    // Emergency Contact
    emergencyName: { type: String, required: true },
    emergencyPhone: { type: String, required: true },
    
    // Consent
    consent: {
        type: Boolean,
        required: true,
        default: false
    },
    
    // Status & Tracking
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'on-hold'],
        default: 'pending'
    },
    
    // Approval Details (when approved by NGO)
    approvalDetails: {
        donationDate: Date,
        donationTime: String,
        hospitalName: String,
        hospitalAddress: String,
        doctorName: String,
        contactNumber: String,
        instructions: String,
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        approvedAt: Date
    },
    
    // Tracking History
    trackingHistory: [{
        status: String,
        location: String,
        note: String,
        timestamp: { type: Date, default: Date.now }
    }],
    
    // Cost Estimate
    costEstimate: {
        total: Number,
        breakdown: [{
            organ: String,
            baseCost: Number,
            screeningCost: Number,
            adjustedCost: Number
        }]
    }
    
}, { timestamps: true });

// Generate unique donor ID before saving
donorSchema.pre('save', async function() {
    if (!this.donorId) {
        const count = await this.constructor.countDocuments();
        this.donorId = `UD${String(count + 1).padStart(6, '0')}`;
    }
});

// Index for search
donorSchema.index({ email: 1, phone: 1 });
donorSchema.index({ status: 1 });

module.exports = mongoose.model('Donor', donorSchema);
