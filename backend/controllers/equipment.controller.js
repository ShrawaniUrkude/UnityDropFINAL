const Equipment = require('../models/Equipment');
const MovementHistory = require('../models/MovementHistory');

// Hospital locations for simulation
const HOSPITAL_LOCATIONS = [
    'Emergency Room',
    'ICU',
    'Ward A',
    'Ward B',
    'Corridor',
    'Radiology'
];

// Initial equipment data
const INITIAL_EQUIPMENT = [
    { device_id: 'WC101', equipment_type: 'Wheelchair', location: 'Ward A', status: 'Available', battery_level: 85 },
    { device_id: 'WC102', equipment_type: 'Wheelchair', location: 'ICU', status: 'In Use', battery_level: 72 },
    { device_id: 'ST201', equipment_type: 'Stretcher', location: 'Emergency Room', status: 'Available', battery_level: 90 },
    { device_id: 'ST202', equipment_type: 'Stretcher', location: 'Ward B', status: 'In Use', battery_level: 45 },
    { device_id: 'OC301', equipment_type: 'Oxygen Cylinder', location: 'ICU', status: 'In Use', battery_level: 100 },
    { device_id: 'OC302', equipment_type: 'Oxygen Cylinder', location: 'Emergency Room', status: 'Available', battery_level: 100 },
    { device_id: 'IV401', equipment_type: 'IV Stand', location: 'Ward A', status: 'Available', battery_level: 100 },
    { device_id: 'IV402', equipment_type: 'IV Stand', location: 'Ward B', status: 'In Use', battery_level: 100 },
    { device_id: 'DF501', equipment_type: 'Defibrillator', location: 'Emergency Room', status: 'Available', battery_level: 95 },
    { device_id: 'MN601', equipment_type: 'Monitor', location: 'ICU', status: 'In Use', battery_level: 78 },
];

// @desc    Get all equipment
// @route   GET /api/equipment
exports.getAllEquipment = async (req, res) => {
    try {
        const { location, status, type } = req.query;
        const query = {};
        
        if (location) query.location = location;
        if (status) query.status = status;
        if (type) query.equipment_type = type;
        
        const equipment = await Equipment.find(query).sort({ device_id: 1 });
        
        // Calculate statistics
        const total = await Equipment.countDocuments();
        const available = await Equipment.countDocuments({ status: 'Available' });
        const inUse = await Equipment.countDocuments({ status: 'In Use' });
        const lowBattery = await Equipment.countDocuments({ battery_level: { $lt: 20 } });
        
        // Zone statistics
        const zoneStats = await Equipment.aggregate([
            { $group: { _id: '$location', count: { $sum: 1 } } }
        ]);
        
        res.json({
            success: true,
            data: equipment,
            stats: {
                total,
                available,
                inUse,
                lowBattery,
                activeDevices: total
            },
            zoneStats: zoneStats.reduce((acc, z) => ({ ...acc, [z._id]: z.count }), {})
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single equipment by ID
// @route   GET /api/equipment/:id
exports.getEquipment = async (req, res) => {
    try {
        const { id } = req.params;
        const equipment = await Equipment.findOne({ device_id: id });
        
        if (!equipment) {
            return res.status(404).json({ success: false, message: 'Equipment not found' });
        }
        
        // Get recent movement history for this device
        const history = await MovementHistory.find({ device_id: id })
            .sort({ timestamp: -1 })
            .limit(10);
        
        res.json({ success: true, data: equipment, history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update equipment location (simulated beacon event)
// @route   POST /api/equipment/update-location
exports.updateLocation = async (req, res) => {
    try {
        const { device_id, location, signal_strength } = req.body;
        
        if (!device_id || !location) {
            return res.status(400).json({ success: false, message: 'device_id and location are required' });
        }
        
        if (!HOSPITAL_LOCATIONS.includes(location)) {
            return res.status(400).json({ success: false, message: 'Invalid location' });
        }
        
        const equipment = await Equipment.findOne({ device_id });
        if (!equipment) {
            return res.status(404).json({ success: false, message: 'Equipment not found' });
        }
        
        const previousLocation = equipment.location;
        
        // Only log movement if location changed
        if (previousLocation !== location) {
            // Save movement history
            await MovementHistory.create({
                device_id,
                equipment_type: equipment.equipment_type,
                previous_location: previousLocation,
                new_location: location,
                signal_strength: signal_strength || Math.floor(Math.random() * 30) - 70,
                timestamp: new Date()
            });
        }
        
        // Update equipment location
        equipment.location = location;
        equipment.signal_strength = signal_strength || Math.floor(Math.random() * 30) - 70;
        equipment.last_updated = new Date();
        await equipment.save();
        
        res.json({
            success: true,
            message: previousLocation !== location 
                ? `${device_id} moved from ${previousLocation} to ${location}`
                : `${device_id} location confirmed at ${location}`,
            data: equipment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get movement history
// @route   GET /api/history
exports.getMovementHistory = async (req, res) => {
    try {
        const { limit = 20, device_id } = req.query;
        const query = device_id ? { device_id } : {};
        
        const history = await MovementHistory.find(query)
            .sort({ timestamp: -1 })
            .limit(parseInt(limit));
        
        res.json({ success: true, data: history });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update equipment status
// @route   PUT /api/equipment/:id/status
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, battery_level } = req.body;
        
        const equipment = await Equipment.findOneAndUpdate(
            { device_id: id },
            { 
                ...(status && { status }),
                ...(battery_level !== undefined && { battery_level }),
                last_updated: new Date()
            },
            { new: true }
        );
        
        if (!equipment) {
            return res.status(404).json({ success: false, message: 'Equipment not found' });
        }
        
        res.json({ success: true, data: equipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Seed initial equipment data
// @route   POST /api/equipment/seed
exports.seedEquipment = async (req, res) => {
    try {
        // Clear existing data
        await Equipment.deleteMany({});
        await MovementHistory.deleteMany({});
        
        // Insert initial equipment
        const equipment = await Equipment.insertMany(INITIAL_EQUIPMENT.map(e => ({
            ...e,
            signal_strength: Math.floor(Math.random() * 30) - 70,
            last_updated: new Date()
        })));
        
        res.json({
            success: true,
            message: `Seeded ${equipment.length} equipment devices`,
            data: equipment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get zone statistics
// @route   GET /api/equipment/zones
exports.getZoneStats = async (req, res) => {
    try {
        const zoneStats = await Equipment.aggregate([
            {
                $group: {
                    _id: '$location',
                    count: { $sum: 1 },
                    available: {
                        $sum: { $cond: [{ $eq: ['$status', 'Available'] }, 1, 0] }
                    },
                    inUse: {
                        $sum: { $cond: [{ $eq: ['$status', 'In Use'] }, 1, 0] }
                    },
                    equipment: { $push: { device_id: '$device_id', type: '$equipment_type', status: '$status' } }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        
        res.json({ success: true, data: zoneStats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
