const User = require('../models/User');
const VerificationLog = require('../models/VerificationLog');
const sendEmail = require('../utils/sendEmail');

// @desc    Verify or Reject NGO
// @route   PUT /api/admin/verify-ngo/:id
// @access  Private/Admin
exports.verifyNGO = async (req, res) => {
    try {
        const { action, method, notes } = req.body; // action: 'verified' | 'rejected'
        const ngoId = req.params.id;

        const user = await User.findById(ngoId);
        if (!user || user.role !== 'ngo') {
            return res.status(404).json({ success: false, message: 'NGO not found' });
        }

        // Update User Status
        user.verificationStatus = action === 'verified' ? 'approved' : 'rejected';
        user.isVerified = action === 'verified';
        await user.save();

        // Log Verification Action
        await VerificationLog.create({
            ngoId,
            adminId: req.user._id,
            action,
            verificationMethod: method,
            notes
        });

        // Send Email Notification
        const message = `Your NGO verification status has been updated to: ${user.verificationStatus.toUpperCase()}. \n\nNotes: ${notes}`;
        try {
            await sendEmail({
                email: user.email,
                subject: 'NGO Verification Status Update',
                message
            });
        } catch (emailError) {
            console.error('Email send failed', emailError);
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        console.error('VERIFICATION ERROR:', error);
        console.error('Payload:', {
            action: req.body.action,
            method: req.body.method,
            notes: req.body.notes,
            ngoId: req.params.id,
            adminId: req.user ? req.user._id : 'MISSING_USER'
        });
        res.status(500).json({
            success: false,
            message: error.message,
            errorName: error.name,
            stack: error.stack,
            fullError: error.toString() // Explicitly send this to see the proper error
        });
    }
};

// @desc    Get Pending APIs
// @route   GET /api/admin/pending-ngos
// @access  Private/Admin
exports.getPendingNGOs = async (req, res) => {
    try {
        const ngos = await User.find({ role: 'ngo', verificationStatus: 'pending' });
        res.status(200).json({ success: true, count: ngos.length, data: ngos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Verified NGOs (Public/Donor)
// @route   GET /api/admin/verified-ngos (or moved to public route)
// @access  Public/Protected
exports.getVerifiedNGOs = async (req, res) => {
    try {
        const ngos = await User.find({
            role: 'ngo',
            verificationStatus: 'approved',
            isActive: true
        }).select('name organizationName organizationId email phone fullAddress address city pincode location');

        res.status(200).json({ success: true, count: ngos.length, data: ngos });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
