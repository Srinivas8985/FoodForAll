const MoneyDonation = require('../models/MoneyDonation');
const User = require('../models/User');

// @desc    Process a money donation
// @route   POST /api/money/donate
// @access  Private (Donor)
exports.donateMoney = async (req, res) => {
    try {
        const { amount, donationType, recipientNGO, paymentMethod } = req.body;

        // Simple validation
        if (!amount || !donationType) {
            return res.status(400).json({ success: false, message: 'Please provide amount and donation type' });
        }

        // If donation is for a specific NGO, verify it exists
        if (donationType === 'ngo') {
            if (!recipientNGO) {
                return res.status(400).json({ success: false, message: 'Please provide recipient NGO ID' });
            }
            const ngo = await User.findById(recipientNGO);
            if (!ngo) {
                return res.status(404).json({ success: false, message: 'NGO not found' });
            }
        }

        // Mock Payment Processing
        // In a real app, this would integrate with Stripe/Razorpay
        const isSuccess = true; // maximize realism by assuming success for dummy

        if (!isSuccess) {
            return res.status(400).json({ success: false, message: 'Payment failed' });
        }

        const donation = await MoneyDonation.create({
            donor: req.user.id,
            amount,
            donationType,
            recipientNGO: donationType === 'ngo' ? recipientNGO : undefined,
            paymentMethod,
            status: 'success'
        });

        // Notify Admins
        const Notification = require('../models/Notification');
        const admins = await User.find({ role: 'admin' });
        const notifications = admins.map(admin => ({
            user: admin._id,
            title: 'New Money Donation',
            message: `New Money Donation of ₹${amount} received from ${req.user.name}`,
            type: 'success',
            relatedId: donation._id
        }));

        // Notify Recipient NGO if applicable
        if (donationType === 'ngo' && recipientNGO) {
            notifications.push({
                user: recipientNGO,
                title: 'New Fund Received',
                message: `You received a donation of ₹${amount} from ${req.user.name}`,
                type: 'success',
                relatedId: donation._id
            });
        }

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json({
            success: true,
            data: donation,
            message: 'Donation successful!'
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get logged in user's donations
// @route   GET /api/money/my
// @access  Private
exports.getMyMoneyDonations = async (req, res) => {
    try {
        const donations = await MoneyDonation.find({ donor: req.user.id })
            .populate('recipientNGO', 'name')
            .sort({ transactionDate: -1 });

        res.status(200).json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all money donations (Admin only)
// @route   GET /api/money/all
// @access  Private (Admin)
exports.getAllMoneyDonations = async (req, res) => {
    try {
        const donations = await MoneyDonation.find()
            .populate('donor', 'name email')
            .populate('recipientNGO', 'name')
            .sort({ transactionDate: -1 });

        res.status(200).json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get money donations for logged in NGO
// @route   GET /api/money/ngo
// @access  Private (NGO)
exports.getNgoMoneyDonations = async (req, res) => {
    try {
        console.log(`[${new Date().toISOString()}] Fetching money for NGO: ${req.user.id}`);

        const donations = await MoneyDonation.find({ recipientNGO: req.user.id })
            .populate('donor', 'name email')
            .sort({ transactionDate: -1 });

        console.log(`[${new Date().toISOString()}] Found ${donations.length} money donations`);

        res.status(200).json({
            success: true,
            count: donations.length,
            data: donations
        });
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Error fetching money: ${error.message}\nStack: ${error.stack}`);
        console.error('Error fetching NGO money donations:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Add usage proof to a money donation
// @route   PUT /api/money/:id/proof
// @access  Private (NGO)
exports.addUsageProof = async (req, res) => {
    try {
        const { images, description } = req.body;
        const donationId = req.params.id;

        let donation = await MoneyDonation.findById(donationId);

        if (!donation) {
            return res.status(404).json({ success: false, message: 'Donation not found' });
        }

        // Verify that the logged in user is the recipient NGO
        if (donation.recipientNGO.toString() !== req.user.id) {
            return res.status(401).json({ success: false, message: 'Not authorized to add proof for this donation' });
        }

        donation.usageProofImages = images || donation.usageProofImages;
        donation.usageProofDescription = description || donation.usageProofDescription;

        await donation.save();

        res.status(200).json({
            success: true,
            data: donation,
            message: 'Usage proof added successfully'
        });

    } catch (error) {
        console.error('Error adding usage proof:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
