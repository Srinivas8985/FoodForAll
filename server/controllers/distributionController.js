const DistributionLog = require('../models/DistributionLog');
const FoodDrive = require('../models/FoodDrive');
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
        let logQuery = { status: { $in: ['active', 'upcoming'] } };
        let driveQuery = { status: { $in: ['planned', 'ongoing'] } };

        // Search logic: Pincode OR Area (regex)
        if (pincode) {
            logQuery['location.pincode'] = pincode;
            driveQuery.pincode = pincode;
        } else if (area) {
            logQuery['location.area'] = { $regex: area, $options: 'i' };
            driveQuery.areaName = { $regex: area, $options: 'i' };
        }

        // 1. Fetch Distribution Logs (NGO Posted)
        const logs = await DistributionLog.find(logQuery)
            .populate('ngo', 'name email phone')
            .lean();

        // 2. Fetch Planned Food Drives (Admin Planned)
        const drives = await FoodDrive.find(driveQuery)
            .populate('assignedNGOs', 'name email phone')
            .lean();

        // 3. Normalize Food Drives to match Distribution Log structure for frontend
        const normalizedDrives = drives.map(drive => ({
            _id: drive._id,
            isDrive: true,
            status: drive.status === 'planned' ? 'upcoming' : 'active',
            ngo: { name: 'Food For All Drive', isSystem: true }, // Placeholder or use assigned NGO names
            location: {
                address: drive.address || drive.areaName,
                area: drive.areaName,
                pincode: drive.pincode,
                coordinates: drive.location ? drive.location.coordinates : [0, 0]
            },
            distributionDate: drive.driveDate,
            foodDetails: {
                quantity: `${drive.plannedMeals} Meals`,
                type: 'cooked',
                description: 'Community Food Drive'
            },
            contactNumber: 'Contact Support'
        }));

        // 4. Combine and Sort
        const results = [...logs, ...normalizedDrives].sort((a, b) =>
            new Date(a.distributionDate) - new Date(b.distributionDate)
        );

        res.status(200).json({ success: true, count: results.length, data: results });
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
