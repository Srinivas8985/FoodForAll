const FoodAvailability = require('../models/FoodAvailability');
const User = require('../models/User');

// @desc    Search Food by Pincode
// @route   GET /api/food/search
// @access  Public
exports.searchFood = async (req, res) => {
    try {
        const { pincode, date } = req.query;

        if (!pincode) {
            return res.status(400).json({ success: false, message: 'Pincode is required' });
        }

        let query = {
            pincode,
            status: 'available'
        };

        if (date) {
            const searchDate = new Date(date);
            const nextDay = new Date(date);
            nextDay.setDate(searchDate.getDate() + 1);

            query.date = {
                $gte: searchDate,
                $lt: nextDay
            };
        }

        // Find availability and populate NGO details (but hide sensitive until needed?)
        // Requirement says: "Hide contact details until search". Response here IS the search result.
        // So we send contact details here. Frontend can hide/show on click.
        const results = await FoodAvailability.find(query)
            .populate('ngoId', 'organizationName fullAddress isVerified')
            .sort({ date: 1 });

        // Filter out if NGO is not verified (redundant safety check)
        const verifiedResults = results.filter(item => item.ngoId && item.ngoId.isVerified);

        res.status(200).json({ success: true, count: verifiedResults.length, data: verifiedResults });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
