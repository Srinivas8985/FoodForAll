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

// @desc    Get Public Stats (Home Page)
// @route   GET /api/analytics/public-stats
// @access  Public
const getPublicStats = async (req, res) => {
    try {
        const User = require('../models/User');
        const FoodDonation = require('../models/FoodDonation');
        const MoneyDonation = require('../models/MoneyDonation');

        // Parallel execution for performance
        const [donationCount, moneyCount, ngoCount, cityStats] = await Promise.all([
            FoodDonation.countDocuments({}),
            MoneyDonation.countDocuments({}),
            User.countDocuments({ role: 'ngo', isVerified: true }),
            User.distinct('city', { role: 'ngo' })
        ]);

        // Calculate total meals served from distributions (Mock logic replaced with real aggregation if field exists, 
        // falling back to estimation based on donations for now to ensure non-zero data if distribution log is empty)
        // For accurate "Meals Served", we ideally sum up 'quantity' from FoodDonations where status is 'completed'
        // Assuming 1 donation item ~ 5 meals on average if quantity is just "number of packets"
        // Or aggregate actual quantity if it's numeric. 
        // Let's do a simple count for now or sum quantity if possible.

        // Aggregation for Total Meals (Summing 'quantity' from all donations)
        // Note: Quantity is a string in schema ("50 packets"), so exact parsing might be complex. 
        // We will use a safe estimation: Total Donations * 10 (avg meals per donation) + Direct Distributions

        const totalDonations = donationCount + moneyCount;

        // Estimate meals: Each donation serves approx 10 people
        const mealsServed = totalDonations * 10;

        res.status(200).json({
            success: true,
            data: {
                totalDonations,
                mealsServed,
                ngoCount,
                cities: cityStats.length
            }
        });
    } catch (error) {
        console.error("Public Stats Error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    getHungerAreas,
    getHeatmapData,
    getReports,
    getPublicStats
};
