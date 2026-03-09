const FoodDonation = require('../models/FoodDonation');

// In-memory store
let inMemoryFoodDonations = [];

// Mock volunteers
const volunteers = [
    { id: 'VOL001', name: 'Rahul Sharma', phone: '9876543210', area: 'Andheri West', rating: 4.8, deliveries: 127, available: true },
    { id: 'VOL002', name: 'Priya Patel', phone: '9876543211', area: 'Bandra East', rating: 4.9, deliveries: 89, available: true },
    { id: 'VOL003', name: 'Amit Kumar', phone: '9876543212', area: 'Juhu', rating: 4.7, deliveries: 156, available: true },
    { id: 'VOL004', name: 'Sneha Desai', phone: '9876543213', area: 'Malad West', rating: 4.6, deliveries: 72, available: true },
    { id: 'VOL005', name: 'Vikram Singh', phone: '9876543214', area: 'Goregaon', rating: 4.8, deliveries: 201, available: true },
];

const allocateVolunteer = () => {
    const available = volunteers.filter(v => v.available);
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
};

// @desc    Create food donation
// @route   POST /api/food-donations
exports.createFoodDonation = async (req, res) => {
    try {
        const donationData = req.body;
        
        // Allocate volunteer
        const volunteer = allocateVolunteer();
        if (!volunteer) {
            return res.status(400).json({
                success: false,
                message: 'No volunteers available at the moment. Please try again later.'
            });
        }
        
        const donationId = `FD${Date.now()}`;
        
        const newDonation = {
            ...donationData,
            donationId,
            volunteer,
            volunteerStatus: 'pending',
            deliveryStatus: 'waiting',
            statusHistory: [{
                status: 'created',
                timestamp: new Date(),
                message: 'Donation request created'
            }],
            createdAt: new Date()
        };
        
        try {
            const donation = await FoodDonation.create(newDonation);
            res.status(201).json({ success: true, data: donation });
        } catch (dbError) {
            inMemoryFoodDonations.push(newDonation);
            res.status(201).json({ success: true, data: newDonation });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all food donations
// @route   GET /api/food-donations
exports.getAllFoodDonations = async (req, res) => {
    try {
        const { status } = req.query;
        const query = status ? { deliveryStatus: status } : {};
        
        try {
            const donations = await FoodDonation.find(query).sort({ createdAt: -1 });
            res.json({ success: true, data: donations });
        } catch (dbError) {
            let filtered = status 
                ? inMemoryFoodDonations.filter(d => d.deliveryStatus === status)
                : inMemoryFoodDonations;
            res.json({ success: true, data: filtered });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get food donation by ID
// @route   GET /api/food-donations/:id
exports.getFoodDonation = async (req, res) => {
    try {
        const { id } = req.params;
        
        try {
            const donation = await FoodDonation.findOne({ donationId: id });
            if (!donation) {
                return res.status(404).json({ success: false, message: 'Donation not found' });
            }
            res.json({ success: true, data: donation });
        } catch (dbError) {
            const donation = inMemoryFoodDonations.find(d => d.donationId === id);
            if (!donation) {
                return res.status(404).json({ success: false, message: 'Donation not found' });
            }
            res.json({ success: true, data: donation });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update delivery status
// @route   PUT /api/food-donations/:id/status
exports.updateDeliveryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { deliveryStatus, message, location } = req.body;
        
        const statusUpdate = {
            status: deliveryStatus,
            timestamp: new Date(),
            message: message || `Status updated to ${deliveryStatus}`,
            location
        };
        
        try {
            const donation = await FoodDonation.findOneAndUpdate(
                { donationId: id },
                {
                    deliveryStatus,
                    $push: { statusHistory: statusUpdate }
                },
                { new: true }
            );
            
            if (!donation) {
                return res.status(404).json({ success: false, message: 'Donation not found' });
            }
            res.json({ success: true, data: donation });
        } catch (dbError) {
            const index = inMemoryFoodDonations.findIndex(d => d.donationId === id);
            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Donation not found' });
            }
            
            inMemoryFoodDonations[index].deliveryStatus = deliveryStatus;
            inMemoryFoodDonations[index].statusHistory.push(statusUpdate);
            
            res.json({ success: true, data: inMemoryFoodDonations[index] });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Volunteer accepts/declines donation
// @route   PUT /api/food-donations/:id/volunteer-response
exports.volunteerResponse = async (req, res) => {
    try {
        const { id } = req.params;
        const { volunteerStatus } = req.body;
        
        try {
            const donation = await FoodDonation.findOneAndUpdate(
                { donationId: id },
                { volunteerStatus },
                { new: true }
            );
            
            if (!donation) {
                return res.status(404).json({ success: false, message: 'Donation not found' });
            }
            res.json({ success: true, data: donation });
        } catch (dbError) {
            const index = inMemoryFoodDonations.findIndex(d => d.donationId === id);
            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Donation not found' });
            }
            
            inMemoryFoodDonations[index].volunteerStatus = volunteerStatus;
            res.json({ success: true, data: inMemoryFoodDonations[index] });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get available volunteers
// @route   GET /api/food-donations/volunteers
exports.getVolunteers = async (req, res) => {
    res.json({ success: true, data: volunteers });
};
