const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");
const Notification = require("../models/Notification");

// @desc    Create new conversation
// @route   POST /api/chat/conversation
// @access  Private
exports.createConversation = async (req, res) => {
    try {
        // Check if conversation already exists
        const existingConversation = await Conversation.findOne({
            members: { $all: [req.body.senderId, req.body.receiverId] },
        });

        if (existingConversation) {
            return res.status(200).json(existingConversation);
        }

        const newConversation = new Conversation({
            members: [req.body.senderId, req.body.receiverId],
        });

        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// @desc    Get conversations of a user
// @route   GET /api/chat/conversation/:userId
// @access  Private
exports.getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            members: { $in: [req.params.userId] },
        }).sort({ updatedAt: -1 });

        // Populate member details for UI (optional but helpful)
        // We'll manual populate logic or promise all to get user details
        const populatedConversations = await Promise.all(conversations.map(async (conv) => {
            const otherUserId = conv.members.find(m => m !== req.params.userId);
            const otherUser = await User.findById(otherUserId).select('name email role');
            return {
                ...conv._doc,
                otherUser
            };
        }));

        res.status(200).json(populatedConversations);
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// @desc    Add new message
// @route   POST /api/chat/message
// @access  Private
exports.addMessage = async (req, res) => {
    const newMessage = new Message(req.body);

    try {
        const savedMessage = await newMessage.save();
        // Update conversation updated_at
        const conversation = await Conversation.findByIdAndUpdate(req.body.conversationId, { updatedAt: Date.now() }, { new: true });

        // Create Notification for the receiver
        const receiverId = conversation.members.find(member => member !== req.body.sender);

        if (receiverId) {
            const sender = await User.findById(req.body.sender);
            const senderName = sender ? sender.name : 'Someone';

            await Notification.create({
                user: receiverId,
                title: 'New Message',
                message: `You have received a new message from ${senderName}`,
                type: 'info',
                relatedId: conversation._id // Link to conversation so we might deep link later
            });
        }

        res.status(200).json(savedMessage);
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// @desc    Get messages of a conversation
// @route   GET /api/chat/message/:conversationId
// @access  Private
exports.getMessages = async (req, res) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};

// @desc    Get contacts for checking new chat
// @route   GET /api/chat/contacts
// @access  Private
exports.getChatContacts = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        let contacts = [];

        if (currentUser.role === 'admin') {
            // Admins can chat with all Verified NGOs
            contacts = await User.find({ role: 'ngo', verificationStatus: 'approved' }).select('name email role organizationName mobile');
        } else if (currentUser.role === 'ngo') {
            // NGOs can chat with Admins
            contacts = await User.find({ role: 'admin' }).select('name email role');
        } else if (currentUser.role === 'donor') {
            // Donors can chat with Verified NGOs and Admins
            const ngos = await User.find({ role: 'ngo', verificationStatus: 'approved' }).select('name email role organizationName');
            const admins = await User.find({ role: 'admin' }).select('name email role');
            contacts = [...ngos, ...admins];
        }

        res.status(200).json(contacts);
    } catch (err) {
        res.status(500).json({ status: false, message: err.message });
    }
};
