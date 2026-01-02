const FoodDonation = require('../models/FoodDonation');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all donations
// @route   GET /api/donations
// @access  Public
exports.getDonations = async (req, res) => {
    try {
        const donations = await FoodDonation.find({ status: 'available' })
            .populate('donor', 'name email phone address fullAddress city pincode')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: donations.length, data: donations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get public specific donation data (limited fields)
// @route   GET /api/donations/public
// @access  Public
exports.getPublicDonations = async (req, res) => {
    try {
        const donations = await FoodDonation.find({ status: 'available' })
            .select('foodName quantity foodType expiryTime pickupLocation location servings message')
            .populate('donor', 'name') // Only show name
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: donations.length, data: donations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single donation
// @route   GET /api/donations/:id
// @access  Public
exports.getDonation = async (req, res) => {
    try {
        const donation = await FoodDonation.findById(req.params.id).populate('donor', 'name email phone');

        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }

        res.status(200).json({ success: true, data: donation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new food donation
// @route   POST /api/donations
// @access  Private
exports.createDonation = async (req, res) => {
    try {
        // Add user to req.body
        req.body.donor = req.user.id;

        // Enforce default GeoJSON to prevent 500 errors
        if (!req.body.location || !req.body.location.coordinates || req.body.location.coordinates.length === 0) {
            req.body.location = {
                type: 'Point',
                coordinates: [0, 0]
            };
        }

        const { recipientType, recipientId, donorNotes } = req.body;

        // If donating to specific NGO, validate recipient
        if (recipientType === 'ngo' && recipientId) {
            const recipient = await User.findById(recipientId);
            if (!recipient || recipient.role !== 'ngo' || !recipient.isVerified) {
                return res.status(400).json({ success: false, message: 'Invalid or unverified NGO recipient' });
            }
        }

        const donation = await FoodDonation.create(req.body);

        // Notify Admins about new donation
        // Also notify NGO if recipientType is 'ngo'
        const notifications = [];

        // Notify Admins
        const admins = await User.find({ role: 'admin' });
        admins.forEach(admin => {
            notifications.push({
                user: admin._id,
                title: 'New Donation',
                message: `New Donation Alert: ${req.body.foodName} (${req.body.quantity})`,
                type: 'info',
                relatedId: donation._id
            });
        });

        // Notify Specific NGO if selected
        if (recipientType === 'ngo' && recipientId) {
            notifications.push({
                user: recipientId,
                title: 'Direct Donation',
                message: `New Direct Donation: ${req.body.foodName} from ${req.user.name}`,
                type: 'info',
                relatedId: donation._id
            });
        }

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json({ success: true, data: donation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update donation status
// @route   PUT /api/donations/:id
// @access  Private
exports.updateDonation = async (req, res) => {
    try {
        let donation = await FoodDonation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }

        // Make sure user is donation owner or admin
        if (donation.donor.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'ngo') {
            return res.status(401).json({ success: false, message: 'Not authorized to update this donation' });
        }

        donation = await FoodDonation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: donation });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete donation
// @route   DELETE /api/donations/:id
// @access  Private
exports.deleteDonation = async (req, res) => {
    try {
        const donation = await FoodDonation.findById(req.params.id);

        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }

        // Make sure user is donation owner or admin
        if (donation.donor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this donation' });
        }

        await donation.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get donations for logged in NGO
// @route   GET /api/donations/ngo
// @access  Private (NGO)

exports.getNgoDonations = async (req, res) => {
    try {
        console.log(`[${new Date().toISOString()}] Fetching donations for NGO: ${req.user.id}`);

        const donations = await FoodDonation.find({ recipientId: req.user.id })
            .populate('donor', 'name email phone address fullAddress city pincode')
            .sort({ createdAt: -1 });

        console.log(`[${new Date().toISOString()}] Found ${donations.length} donations`);
        res.status(200).json({ success: true, count: donations.length, data: donations });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error fetching donations: ${error.message}\nStack: ${error.stack}`);
        console.error('Error fetching NGO donations:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyDonations = async (req, res) => {
    try {
        const donations = await FoodDonation.find({ donor: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: donations });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
