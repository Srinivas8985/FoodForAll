const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Notification = require('../models/Notification');
const FoodDonation = require('../models/FoodDonation');

// @desc    Get my notifications
// @route   GET /api/notifications
router.get('/', protect, async (req, res) => {
    try {
        // If Admin, sync today's donations to notifications
        if (req.user.role === 'admin') {
            const startOfDay = new Date();
            startOfDay.setHours(0, 0, 0, 0);

            const todaysDonations = await FoodDonation.find({
                createdAt: { $gte: startOfDay }
            });

            // Create notifications for any missing ones
            for (const donation of todaysDonations) {
                const exists = await Notification.findOne({
                    user: req.user.id,
                    relatedId: donation._id,
                    type: 'info'
                });

                if (!exists) {
                    await Notification.create({
                        user: req.user.id,
                        title: 'New Donation Posted',
                        message: `A new donation "${donation.foodName}" has been posted today.`,
                        type: 'info',
                        relatedId: donation._id,
                        createdAt: donation.createdAt // Keep original time
                    });
                }
            }
        }

        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
router.put('/:id/read', protect, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return res.status(404).json({ success: false, message: 'Not found' });
        }

        if (notification.user.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        notification.isRead = true;
        await notification.save();

        res.status(200).json({ success: true, data: notification });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Mark ALL as read
// @route   PUT /api/notifications/readall
router.put('/readall', protect, async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
