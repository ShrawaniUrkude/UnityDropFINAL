const Donation = require('../models/Donation');

// In-memory store
let inMemoryDonations = [];

// @desc    Create monetary donation
// @route   POST /api/donations
exports.createDonation = async (req, res) => {
    try {
        const donationData = req.body;
        
        const receiptId = `SB${Date.now().toString().slice(-8)}`;
        
        const newDonation = {
            ...donationData,
            receiptId,
            paymentStatus: 'completed', // Simulating successful payment
            createdAt: new Date()
        };
        
        try {
            const donation = await Donation.create(newDonation);
            res.status(201).json({
                success: true,
                message: 'Donation received successfully',
                data: donation
            });
        } catch (dbError) {
            inMemoryDonations.push(newDonation);
            res.status(201).json({
                success: true,
                message: 'Donation received successfully',
                data: newDonation
            });
        }
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Get all donations
// @route   GET /api/donations
exports.getAllDonations = async (req, res) => {
    try {
        const { category, page = 1, limit = 20 } = req.query;
        const query = category && category !== 'all' ? { category } : {};
        
        try {
            const donations = await Donation.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));
            
            const total = await Donation.countDocuments(query);
            
            res.json({
                success: true,
                data: donations,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (dbError) {
            let filtered = category && category !== 'all'
                ? inMemoryDonations.filter(d => d.category === category)
                : inMemoryDonations;
            
            res.json({
                success: true,
                data: filtered,
                pagination: { page: 1, limit: filtered.length, total: filtered.length, pages: 1 }
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get donation by receipt ID
// @route   GET /api/donations/:id
exports.getDonation = async (req, res) => {
    try {
        const { id } = req.params;
        
        try {
            const donation = await Donation.findOne({ receiptId: id });
            if (!donation) {
                return res.status(404).json({ success: false, message: 'Donation not found' });
            }
            res.json({ success: true, data: donation });
        } catch (dbError) {
            const donation = inMemoryDonations.find(d => d.receiptId === id);
            if (!donation) {
                return res.status(404).json({ success: false, message: 'Donation not found' });
            }
            res.json({ success: true, data: donation });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get donation statistics
// @route   GET /api/donations/stats
exports.getDonationStats = async (req, res) => {
    try {
        try {
            const totalAmount = await Donation.aggregate([
                { $match: { paymentStatus: 'completed' } },
                { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
            ]);
            
            const byCategory = await Donation.aggregate([
                { $match: { paymentStatus: 'completed' } },
                { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } }
            ]);
            
            res.json({
                success: true,
                data: {
                    totalAmount: totalAmount[0]?.total || 0,
                    totalDonations: totalAmount[0]?.count || 0,
                    byCategory: byCategory.reduce((acc, c) => ({
                        ...acc,
                        [c._id]: { total: c.total, count: c.count }
                    }), {})
                }
            });
        } catch (dbError) {
            const completed = inMemoryDonations.filter(d => d.paymentStatus === 'completed');
            const totalAmount = completed.reduce((sum, d) => sum + d.amount, 0);
            
            res.json({
                success: true,
                data: {
                    totalAmount,
                    totalDonations: completed.length,
                    byCategory: {}
                }
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
