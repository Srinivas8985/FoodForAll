const express = require('express');
const router = express.Router();
const { searchFood } = require('../controllers/foodDiscoveryController');

// Public route
router.get('/search', searchFood);

module.exports = router;
