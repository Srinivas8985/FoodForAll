const express = require('express');
const router = express.Router();
const { createConversation, getConversations, addMessage, getMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// Conversations
router.post('/conversation', protect, createConversation);
router.get('/conversation/:userId', protect, getConversations);

// Messages
router.post('/message', protect, addMessage);
router.get('/message/:conversationId', protect, getMessages);

module.exports = router;
