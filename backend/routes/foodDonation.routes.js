const express = require('express');
const router = express.Router();
const {
    createFoodDonation,
    getAllFoodDonations,
    getFoodDonation,
    updateDeliveryStatus,
    volunteerResponse,
    getVolunteers
} = require('../controllers/foodDonation.controller');

// Get volunteers
router.get('/volunteers', getVolunteers);

// CRUD routes
router.route('/')
    .get(getAllFoodDonations)
    .post(createFoodDonation);

router.route('/:id')
    .get(getFoodDonation);

// Status updates
router.put('/:id/status', updateDeliveryStatus);
router.put('/:id/volunteer-response', volunteerResponse);

module.exports = router;
