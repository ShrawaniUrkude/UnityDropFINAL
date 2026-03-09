const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    receiptId: {
        type: String,
        unique: true,
        required: true
    },
    
    // Donor Info
    donorName: {
        type: String,
        required: true
    },
    donorEmail: {
        type: String,
        required: true
    },
    donorPhone: {
        type: String,
        required: true
    },
    
    // Donation Details
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    currency: {
        type: String,
        default: 'INR'
    },
    paymentType: {
        type: String,
        enum: ['one-time', 'monthly'],
        default: 'one-time'
    },
    category: {
        type: String,
        enum: ['where-needed', 'food', 'education', 'healthcare', 'emergency'],
        default: 'where-needed'
    },
    
    // Payment Status
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'failed', 'refunded'],
        default: 'pending'
    },
    paymentMethod: {
        type: String,
        enum: ['upi', 'card', 'netbanking', 'wallet'],
        default: 'upi'
    },
    transactionId: String,
    
    // Tax Receipt
    taxReceipt: {
        generated: { type: Boolean, default: false },
        receiptUrl: String,
        pan: String
    },
    
    // Campaign (if specific campaign)
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Campaign'
    },
    
    // Impact Tracking
    impactUpdate: [{
        message: String,
        timestamp: Date,
        photoUrl: String
    }]
    
}, { timestamps: true });

// Generate receipt ID
donationSchema.pre('save', async function(next) {
    if (!this.receiptId) {
        this.receiptId = `SB${Date.now().toString().slice(-8)}`;
    }
    next();
});

module.exports = mongoose.model('Donation', donationSchema);
