const FoodRequest = require('../models/FoodRequest');

// @desc    Get all requests
// @route   GET /api/requests
// @access  Private (Donor, NGO, Admin)
exports.getRequests = async (req, res) => {
    try {
        const requests = await FoodRequest.find({ status: 'active' })
            .populate('requester', 'name email phone')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get single request
// @route   GET /api/requests/:id
// @access  Private
exports.getRequest = async (req, res) => {
    try {
        const request = await FoodRequest.findById(req.params.id).populate('requester', 'name email phone');

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        res.status(200).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new request
// @route   POST /api/requests
// @access  Private (NGO)
exports.createRequest = async (req, res) => {
    try {
        req.body.requester = req.user.id;

        const request = await FoodRequest.create(req.body);

        // Notify Admins
        const Notification = require('../models/Notification');
        const User = require('../models/User');
        const admins = await User.find({ role: 'admin' });
        const notifications = admins.map(admin => ({
            user: admin._id,
            title: 'New Food Request',
            message: `New Request for ${req.body.itemsNeeded} (${req.body.quantityNeeded})`,
            type: 'warning', // Warning color for urgency
            relatedId: request._id
        }));

        if (notifications.length > 0) {
            await Notification.insertMany(notifications);
        }

        res.status(201).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update request
// @route   PUT /api/requests/:id
// @access  Private
exports.updateRequest = async (req, res) => {
    try {
        let request = await FoodRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        // Check ownership
        if (request.requester.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        request = await FoodRequest.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: request });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete request
// @route   DELETE /api/requests/:id
// @access  Private
exports.deleteRequest = async (req, res) => {
    try {
        const request = await FoodRequest.findById(req.params.id);

        if (!request) {
            return res.status(404).json({ success: false, message: 'Request not found' });
        }

        // Check ownership
        if (request.requester.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, message: 'Not authorized' });
        }

        await request.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my requests (As an NGO)
// @route   GET /api/requests/my
// @access  Private
exports.getMyRequests = async (req, res) => {
    try {
        const requests = await FoodRequest.find({ requester: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
