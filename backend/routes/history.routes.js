const express = require('express');
const router = express.Router();
const { getMovementHistory } = require('../controllers/equipment.controller');

// GET /api/history - Get movement history with optional device_id filter
router.get('/', getMovementHistory);

module.exports = router;
