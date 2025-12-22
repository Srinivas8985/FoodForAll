const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getHungerAreas, getHeatmapData, getReports } = require('../controllers/analyticsController');

router.get('/hunger-areas', protect, authorize('admin', 'ngo'), getHungerAreas);
router.get('/heatmap-data', protect, authorize('admin', 'ngo'), getHeatmapData);
router.get('/reports', protect, authorize('admin'), getReports);

module.exports = router;
