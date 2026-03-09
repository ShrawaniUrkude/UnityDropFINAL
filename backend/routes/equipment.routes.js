const express = require('express');
const router = express.Router();
const {
    getAllEquipment,
    getEquipment,
    updateLocation,
    getMovementHistory,
    updateStatus,
    seedEquipment,
    getZoneStats
} = require('../controllers/equipment.controller');

// GET /api/equipment - Get all equipment with optional filters
router.get('/', getAllEquipment);

// GET /api/equipment/zones - Get zone statistics
router.get('/zones', getZoneStats);

// POST /api/equipment/seed - Seed initial equipment data
router.post('/seed', seedEquipment);

// POST /api/equipment/update-location - Update equipment location (BLE beacon event)
router.post('/update-location', updateLocation);

// GET /api/equipment/:id - Get single equipment by device_id
router.get('/:id', getEquipment);

// PUT /api/equipment/:id/status - Update equipment status
router.put('/:id/status', updateStatus);

module.exports = router;
