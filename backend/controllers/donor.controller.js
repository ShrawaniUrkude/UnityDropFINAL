const Donor = require('../models/Donor');

// In-memory store for when MongoDB is not available
let inMemoryDonors = [];

// ═══════════════════════════════════════════════════════════════
// ORGAN COST CALCULATION
// ═══════════════════════════════════════════════════════════════

const organBaseCosts = {
    1: { name: 'Kidney', base: 250000, screening: 15000 },
    2: { name: 'Liver', base: 500000, screening: 25000 },
    3: { name: 'Heart', base: 800000, screening: 35000 },
    4: { name: 'Lungs', base: 600000, screening: 30000 },
    5: { name: 'Cornea (Eyes)', base: 50000, screening: 8000 },
    6: { name: 'Bone Marrow', base: 350000, screening: 20000 },
    7: { name: 'Pancreas', base: 450000, screening: 22000 },
    8: { name: 'Skin', base: 80000, screening: 10000 },
};

const calculateCostEstimate = (donorData) => {
    if (!donorData.organs || donorData.organs.length === 0) return null;
    
    // Calculate age
    const today = new Date();
    const birth = new Date(donorData.dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    
    // Age factor
    let ageFactor = 1.0;
    if (age < 18) ageFactor = 1.15;
    else if (age <= 35) ageFactor = 0.9;
    else if (age <= 50) ageFactor = 1.0;
    else if (age <= 65) ageFactor = 1.2;
    else ageFactor = 1.4;
    
    // Habit factor
    let habitFactor = 1.0;
    if (donorData.smoking === 'regular') habitFactor += 0.2;
    else if (donorData.smoking === 'occasional') habitFactor += 0.1;
    else if (donorData.smoking === 'quit') habitFactor += 0.05;
    if (donorData.alcohol === 'heavy') habitFactor += 0.2;
    else if (donorData.alcohol === 'moderate') habitFactor += 0.1;
    else if (donorData.alcohol === 'social') habitFactor += 0.03;
    
    // Medical factor
    let medicalFactor = 1.0;
    if (donorData.chronicDisease && donorData.chronicDisease.toLowerCase() !== 'none') medicalFactor += 0.15;
    if (donorData.previousSurgery && donorData.previousSurgery.toLowerCase() !== 'none') medicalFactor += 0.1;
    
    const breakdown = donorData.organs.map(organId => {
        const organ = organBaseCosts[organId];
        if (!organ) return null;
        const adjustedCost = Math.round(organ.base * ageFactor * habitFactor * medicalFactor);
        return {
            organ: organ.name,
            baseCost: organ.base,
            screeningCost: organ.screening,
            adjustedCost: adjustedCost + organ.screening
        };
    }).filter(Boolean);
    
    const total = breakdown.reduce((sum, item) => sum + item.adjustedCost, 0);
    
    return { total, breakdown };
};

// ═══════════════════════════════════════════════════════════════
// CONTROLLERS
// ═══════════════════════════════════════════════════════════════

// @desc    Register a new organ donor
// @route   POST /api/donors
exports.registerDonor = async (req, res) => {
    try {
        const donorData = req.body;
        
        // Calculate cost estimate
        const costEstimate = calculateCostEstimate(donorData);
        
        // Generate donor ID
        const count = await Donor.countDocuments().catch(() => inMemoryDonors.length);
        const donorId = `UD${String(count + 1).padStart(6, '0')}`;
        
        const newDonor = {
            ...donorData,
            donorId,
            status: 'pending',
            costEstimate,
            trackingHistory: [{
                status: 'registered',
                note: 'Donor registration submitted',
                timestamp: new Date()
            }],
            createdAt: new Date()
        };
        
        try {
            const donor = await Donor.create(newDonor);
            res.status(201).json({
                success: true,
                message: 'Donor registered successfully',
                data: donor
            });
        } catch (dbError) {
            console.error('MongoDB Save Error:', dbError.message);
            // Fallback to in-memory
            inMemoryDonors.push(newDonor);
            res.status(201).json({
                success: true,
                message: 'Donor registered successfully (in-memory)',
                data: newDonor
            });
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all donors
// @route   GET /api/donors
exports.getAllDonors = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;
        const query = status && status !== 'all' ? { status } : {};
        
        try {
            const donors = await Donor.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));
            
            const total = await Donor.countDocuments(query);
            
            res.json({
                success: true,
                data: donors,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit)
                }
            });
        } catch (dbError) {
            // Fallback to in-memory
            let filtered = status && status !== 'all' 
                ? inMemoryDonors.filter(d => d.status === status)
                : inMemoryDonors;
            
            res.json({
                success: true,
                data: filtered,
                pagination: { page: 1, limit: filtered.length, total: filtered.length, pages: 1 }
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get donor by ID or email/phone
// @route   GET /api/donors/:id
exports.getDonor = async (req, res) => {
    try {
        const { id } = req.params;
        
        try {
            let donor = await Donor.findOne({ donorId: id });
            if (!donor) donor = await Donor.findOne({ email: id });
            if (!donor) donor = await Donor.findOne({ phone: id });
            if (!donor) donor = await Donor.findById(id);
            
            if (!donor) {
                return res.status(404).json({
                    success: false,
                    message: 'Donor not found'
                });
            }
            
            res.json({ success: true, data: donor });
        } catch (dbError) {
            // Fallback to in-memory
            const donor = inMemoryDonors.find(d => 
                d.donorId === id || d.email === id || d.phone === id
            );
            
            if (!donor) {
                return res.status(404).json({ success: false, message: 'Donor not found' });
            }
            res.json({ success: true, data: donor });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Search donor by email or phone
// @route   POST /api/donors/search
exports.searchDonor = async (req, res) => {
    try {
        const { email, phone } = req.body;
        
        try {
            const donor = await Donor.findOne({
                $or: [
                    { email: email?.toLowerCase() },
                    { phone }
                ].filter(Boolean)
            });
            
            if (!donor) {
                return res.status(404).json({ success: false, message: 'Donor not found' });
            }
            
            res.json({ success: true, data: donor });
        } catch (dbError) {
            const donor = inMemoryDonors.find(d => 
                (email && d.email?.toLowerCase() === email.toLowerCase()) ||
                (phone && d.phone === phone)
            );
            
            if (!donor) {
                return res.status(404).json({ success: false, message: 'Donor not found' });
            }
            res.json({ success: true, data: donor });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update donor status (approve/reject)
// @route   PUT /api/donors/:id/status
exports.updateDonorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, approvalDetails } = req.body;
        
        const updateData = {
            status,
            $push: {
                trackingHistory: {
                    status,
                    note: `Status updated to ${status}`,
                    timestamp: new Date()
                }
            }
        };
        
        if (status === 'approved' && approvalDetails) {
            updateData.approvalDetails = {
                ...approvalDetails,
                approvedAt: new Date()
            };
        }
        
        try {
            const donor = await Donor.findOneAndUpdate(
                { donorId: id },
                updateData,
                { new: true }
            );
            
            if (!donor) {
                return res.status(404).json({ success: false, message: 'Donor not found' });
            }
            
            res.json({ success: true, data: donor });
        } catch (dbError) {
            // Fallback to in-memory
            const index = inMemoryDonors.findIndex(d => d.donorId === id);
            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Donor not found' });
            }
            
            inMemoryDonors[index] = {
                ...inMemoryDonors[index],
                status,
                approvalDetails: status === 'approved' ? { ...approvalDetails, approvedAt: new Date() } : undefined
            };
            
            res.json({ success: true, data: inMemoryDonors[index] });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Add tracking update
// @route   POST /api/donors/:id/tracking
exports.addTracking = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, location, note } = req.body;
        
        try {
            const donor = await Donor.findOneAndUpdate(
                { donorId: id },
                {
                    $push: {
                        trackingHistory: { status, location, note, timestamp: new Date() }
                    }
                },
                { new: true }
            );
            
            if (!donor) {
                return res.status(404).json({ success: false, message: 'Donor not found' });
            }
            
            res.json({ success: true, data: donor });
        } catch (dbError) {
            const index = inMemoryDonors.findIndex(d => d.donorId === id);
            if (index === -1) {
                return res.status(404).json({ success: false, message: 'Donor not found' });
            }
            
            if (!inMemoryDonors[index].trackingHistory) {
                inMemoryDonors[index].trackingHistory = [];
            }
            inMemoryDonors[index].trackingHistory.push({ status, location, note, timestamp: new Date() });
            
            res.json({ success: true, data: inMemoryDonors[index] });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get donor statistics
// @route   GET /api/donors/stats
exports.getDonorStats = async (req, res) => {
    try {
        try {
            const stats = await Donor.aggregate([
                {
                    $group: {
                        _id: '$status',
                        count: { $sum: 1 }
                    }
                }
            ]);
            
            const total = await Donor.countDocuments();
            
            res.json({
                success: true,
                data: {
                    total,
                    byStatus: stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {})
                }
            });
        } catch (dbError) {
            const stats = {
                total: inMemoryDonors.length,
                byStatus: inMemoryDonors.reduce((acc, d) => {
                    acc[d.status] = (acc[d.status] || 0) + 1;
                    return acc;
                }, {})
            };
            res.json({ success: true, data: stats });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
