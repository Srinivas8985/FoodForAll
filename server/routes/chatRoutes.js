const express = require('express');
const router = express.Router();
const { createConversation, getConversations, addMessage, getMessages, getChatContacts } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// Conversations
router.post('/conversation', protect, createConversation);
router.get('/conversation/:userId', protect, getConversations);

// Messages
router.post('/message', protect, addMessage);
router.get('/message/:conversationId', protect, getMessages);

// Contacts
router.get('/contacts', protect, getChatContacts);

module.exports = router;
