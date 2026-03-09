const express = require('express');
const router = express.Router();
const {
    createDonation,
    getAllDonations,
    getDonation,
    getDonationStats
} = require('../controllers/donation.controller');

// Statistics
router.get('/stats', getDonationStats);

// CRUD routes
router.route('/')
    .get(getAllDonations)
    .post(createDonation);

router.route('/:id')
    .get(getDonation);

module.exports = router;
