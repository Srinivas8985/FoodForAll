const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getAllUsers, verifyNGO, getAnalytics } = require('../controllers/adminController');

// All routes are protected and for admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getAllUsers);
router.put('/verify/:id', verifyNGO);
router.get('/analytics', getAnalytics);

// New Routes for Planning & Alerts
const { createFoodDrive, getFoodDrives, getAlerts, resolveAlert } = require('../controllers/adminController');

router.post('/food-drive', createFoodDrive);
router.get('/food-drives', getFoodDrives);
router.get('/alerts', getAlerts);
router.put('/alerts/:id/resolve', resolveAlert);

module.exports = router;
