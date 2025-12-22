const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { postFood, getMyPosts } = require('../controllers/foodAvailabilityController');

// NGO routes
router.post('/post-food', protect, authorize('ngo'), postFood);
router.get('/my-posts', protect, authorize('ngo'), getMyPosts);

module.exports = router;
