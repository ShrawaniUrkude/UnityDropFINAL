const mongoose = require('mongoose');

const foodDonationSchema = new mongoose.Schema({
    donationId: {
        type: String,
        unique: true,
        required: true
    },
    
    // Donor Information
    donorName: {
        type: String,
        required: [true, 'Donor name is required'],
        trim: true
    },
    donorPhone: {
        type: String,
        required: [true, 'Phone number is required']
    },
    donorAddress: {
        type: String,
        required: true
    },
    pickupAddress: {
        type: String,
        required: true
    },
    
    // Food Details
    selectedItems: [{
        type: String,
        enum: ['cooked-food', 'vegetables', 'fruits', 'grains', 'dairy', 'packaged']
    }],
    quantity: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    preferredTime: {
        type: String,
        required: true
    },
    
    // Volunteer Assignment
    volunteer: {
        id: String,
        name: String,
        phone: String,
        area: String,
        rating: Number
    },
    volunteerStatus: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'
    },
    
    // Delivery Status
    deliveryStatus: {
        type: String,
        enum: ['waiting', 'picked_up', 'in_transit', 'delivered', 'cancelled'],
        default: 'waiting'
    },
    
    // Status History
    statusHistory: [{
        status: String,
        timestamp: { type: Date, default: Date.now },
        message: String,
        location: String
    }],
    
    // Beneficiary Details (when delivered)
    beneficiary: {
        name: String,
        location: String,
        deliveredAt: Date,
        photoProof: String
    }
    
}, { timestamps: true });

// Generate unique donation ID
foodDonationSchema.pre('save', async function(next) {
    if (!this.donationId) {
        this.donationId = `FD${Date.now()}`;
    }
    next();
});

module.exports = mongoose.model('FoodDonation', foodDonationSchema);
