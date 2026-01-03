const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/User");

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
        await Conversation.findByIdAndUpdate(req.body.conversationId, { updatedAt: Date.now() });
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
