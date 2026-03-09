const express = require('express');
const router = express.Router();
const {
    registerDonor,
    getAllDonors,
    getDonor,
    searchDonor,
    updateDonorStatus,
    addTracking,
    getDonorStats
} = require('../controllers/donor.controller');

// Statistics (must be before :id route)
router.get('/stats', getDonorStats);

// Search donor by email/phone
router.post('/search', searchDonor);

// CRUD routes
router.route('/')
    .get(getAllDonors)
    .post(registerDonor);

router.route('/:id')
    .get(getDonor);

// Status updates
router.put('/:id/status', updateDonorStatus);

// Tracking updates
router.post('/:id/tracking', addTracking);

module.exports = router;
