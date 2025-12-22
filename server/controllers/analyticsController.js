const HungerArea = require('../models/HungerArea');
const Distribution = require('../models/Distribution');

// @desc    Get all hunger areas with scores
// @route   GET /api/analytics/hunger-areas
// @access  Private (Admin/NGO)
const getHungerAreas = async (req, res) => {
    try {
        const areas = await HungerArea.find({ hungerScore: { $gt: 0 } }).sort({ hungerScore: -1 });
        res.status(200).json({ success: true, count: areas.length, data: areas });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Heatmap Data (lat, lon, intensity)
// @route   GET /api/analytics/heatmap-data
// @access  Private (Admin/NGO)
const getHeatmapData = async (req, res) => {
    try {
        const areas = await HungerArea.find({ hungerScore: { $gt: 0 } });

        const heatmapData = areas.map(area => ({
            lat: area.location.coordinates[1],
            lon: area.location.coordinates[0],
            intensity: area.hungerScore
        }));

        res.status(200).json({ success: true, data: heatmapData });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get Detailed Reports (Area-wise stats)
// @route   GET /api/analytics/reports
// @access  Private (Admin)
const getReports = async (req, res) => {
    try {
        // Aggregate totals
        const totalStats = await HungerArea.aggregate([
            {
                $group: {
                    _id: null,
                    totalMealsServed: { $sum: '$totalMealsServed' },
                    totalUnmetDemand: { $sum: '$totalUnmetDemand' }
                }
            }
        ]);

        const areas = await HungerArea.find().sort({ hungerScore: -1 });

        res.status(200).json({
            success: true,
            summary: totalStats[0] || { totalMealsServed: 0, totalUnmetDemand: 0 },
            details: areas
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getHungerAreas,
    getHeatmapData,
    getReports
};
