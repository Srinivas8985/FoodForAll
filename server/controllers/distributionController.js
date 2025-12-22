const DistributionLog = require('../models/DistributionLog');
const User = require('../models/User');

// @desc    Log a food distribution event (NGO/Admin)
// @route   POST /api/distribution/log
// @access  Private (NGO/Admin)
exports.logDistribution = async (req, res) => {
    try {
        const { foodDetails, location, distributionDate, status, contactNumber } = req.body;

        // Basic Validation
        if (!location || !location.pincode || !location.area || !location.address) {
            return res.status(400).json({ success: false, message: 'Address, Area, and Pincode are required' });
        }

        // Create Log
        const log = await DistributionLog.create({
            ngo: req.user.id, // The logged-in user (NGO or Admin)
            createdBy: req.user.id,
            foodDetails,
            location: {
                ...location,
                coordinates: location.coordinates || { type: 'Point', coordinates: [0, 0] } // Default if missing
            },
            distributionDate: distributionDate || Date.now(),
            status: status || 'active',
            contactNumber: contactNumber || req.user.phone || 'Contact NGO' // Fallback to profile phone
        });

        res.status(201).json({ success: true, data: log });
    } catch (error) {
        console.error('Log Distribution Error:', error);
        res.status(500).json({ success: false, message: 'Server Error logging distribution' });
    }
};

// @desc    Get public distribution logs (Discovery)
// @route   GET /api/distribution/public
// @access  Public
exports.getPublicDistributions = async (req, res) => {
    try {
        const { pincode, area } = req.query;
        let query = { status: { $in: ['active', 'upcoming'] } };

        // Search logic: Pincode OR Area (regex)
        if (pincode) {
            query['location.pincode'] = pincode;
        } else if (area) {
            query['location.area'] = { $regex: area, $options: 'i' };
        }

        const logs = await DistributionLog.find(query)
            .populate('ngo', 'name email phone') // Show NGO details
            .sort({ distributionDate: 1 }); // Soonest first

        res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (error) {
        console.error('Public Discovery Error:', error);
        res.status(500).json({ success: false, message: 'Server Error fetching distributions' });
    }
};

// @desc    Get distribution history for logged-in NGO
// @route   GET /api/distribution/my
// @access  Private (NGO)
exports.getDistributionHistory = async (req, res) => {
    try {
        const logs = await DistributionLog.find({ ngo: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (error) {
        console.error('History Fetch Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
