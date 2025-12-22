const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { verifyNGO, getPendingNGOs, getVerifiedNGOs } = require('../controllers/verificationController');

// Admin only routes
router.put('/verify-ngo/:id', protect, authorize('admin'), verifyNGO);
router.get('/pending-ngos', protect, authorize('admin'), getPendingNGOs);
router.get('/verified-ngos', protect, getVerifiedNGOs); // Allow any logged in user (donor) to see valid NGOs

module.exports = router;
