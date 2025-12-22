const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');


const { logDistribution, getPublicDistributions, getDistributionHistory } = require('../controllers/distributionController');

// Public Discovery
router.get('/public', getPublicDistributions);

// Protected Routes
router.post('/log', protect, authorize('ngo', 'admin'), logDistribution); // Added admin
router.get('/my', protect, authorize('ngo', 'admin'), getDistributionHistory); // Changed to /my standard

module.exports = router;
