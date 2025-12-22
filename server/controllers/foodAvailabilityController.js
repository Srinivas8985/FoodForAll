const FoodAvailability = require('../models/FoodAvailability');

// @desc    Post Food Availability
// @route   POST /api/ngo/post-food
// @access  Private (Verified NGO)
exports.postFood = async (req, res) => {
    try {
        const { address, pincode, foodType, quantity, date, timeWindow, contactPhone, relatedDonationId } = req.body;

        const availability = await FoodAvailability.create({
            ngoId: req.user.id,
            address,
            pincode,
            foodType,
            quantity,
            date,
            timeWindow,
            contactPhone,
            relatedDonationId
        });

        res.status(201).json({ success: true, data: availability });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get My Posted Food
// @route   GET /api/ngo/my-posts
// @access  Private (Verified NGO)
exports.getMyPosts = async (req, res) => {
    try {
        const posts = await FoodAvailability.find({ ngoId: req.user.id }).sort({ date: -1 });
        res.status(200).json({ success: true, count: posts.length, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
