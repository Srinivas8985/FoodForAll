const User = require('../models/User');
const FoodDonation = require('../models/FoodDonation');
const MoneyDonation = require('../models/MoneyDonation');

// @desc    Get all users (admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify NGO
// @route   PUT /api/admin/verify/:id
// @access  Private/Admin
exports.verifyNGO = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.role !== 'ngo') {
            return res.status(400).json({ success: false, message: 'User is not an NGO' });
        }

        user.isVerified = true;
        user.verificationStatus = 'approved';
        await user.save();

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get System Analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
exports.getAnalytics = async (req, res) => {
    try {
        // 1. Total Food Donations Count
        const foodCount = await FoodDonation.countDocuments();

        // 2. Total Meals Served (Sum of 'servings' field)
        const mealsAgg = await FoodDonation.aggregate([
            {
                $group: {
                    _id: null,
                    totalServings: { $sum: "$servings" }
                }
            }
        ]);
        const mealsServed = mealsAgg.length > 0 ? mealsAgg[0].totalServings : 0;

        // 3. Total Money Raised
        const moneyAgg = await MoneyDonation.aggregate([
            { $match: { status: 'success' } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        const totalMoney = moneyAgg.length > 0 ? moneyAgg[0].totalAmount : 0;

        // 4. Active NGOs
        const ngoCount = await User.countDocuments({ role: 'ngo', isVerified: true });

        res.status(200).json({
            success: true,
            data: {
                foodCount,
                mealsServed,
                totalMoney,
                ngoCount
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

/* --- NEW: Food Drive Planning & Alerts --- */

const FoodDrive = require('../models/FoodDrive');
const Alert = require('../models/Alert');

// @desc    Create a Food Drive Plan
// @route   POST /api/admin/food-drive
// @access  Private/Admin
exports.createFoodDrive = async (req, res) => {
    try {
        const { areaName, location, plannedMeals, assignedNGOs, driveDate } = req.body;

        const foodDrive = await FoodDrive.create({
            areaName,
            location,
            plannedMeals,
            assignedNGOs,
            driveDate
        });

        res.status(201).json({ success: true, data: foodDrive });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all Food Drives
// @route   GET /api/admin/food-drives
// @access  Private/Admin
exports.getFoodDrives = async (req, res) => {
    try {
        const drives = await FoodDrive.find().populate('assignedNGOs', 'name email phone');
        res.status(200).json({ success: true, count: drives.length, data: drives });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Alerts
// @route   GET /api/admin/alerts
// @access  Private/Admin
exports.getAlerts = async (req, res) => {
    try {
        const alerts = await Alert.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: alerts.length, data: alerts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Resolve Alert
// @route   PUT /api/admin/alerts/:id/resolve
// @access  Private/Admin
exports.resolveAlert = async (req, res) => {
    try {
        const alert = await Alert.findById(req.params.id);
        if (!alert) {
            return res.status(404).json({ success: false, message: 'Alert not found' });
        }

        alert.isResolved = true;
        await alert.save();

        res.status(200).json({ success: true, data: alert });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
