const express = require('express');
const router = express.Router();
const {
    getAllNGOs,
    getNGO,
    getNGOStats
} = require('../controllers/ngo.controller');

// Statistics
router.get('/stats', getNGOStats);

// CRUD routes
router.route('/')
    .get(getAllNGOs);

router.route('/:id')
    .get(getNGO);

module.exports = router;
