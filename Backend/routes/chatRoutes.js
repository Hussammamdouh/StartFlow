const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const Joi = require('joi');

// Validation schemas
const createChatSchema = Joi.object({
  participants: Joi.array().items(Joi.string()).min(2).required()
});

const sendMessageSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required()
});

// Routes
router.post('/', authenticate, validate, chatController.createChat);

router.get('/', authenticate, chatController.getUserChats);

router.get('/:chatId/messages', authenticate, chatController.getChatMessages);

router.post('/:chatId/messages', authenticate, validate, chatController.sendMessage);

router.post('/:chatId/read', authenticate, chatController.markMessagesAsRead);

router.put('/messages/:messageId', authenticate, validate, chatController.editMessage);

router.delete('/messages/:messageId', authenticate, chatController.deleteMessage);

router.post('/messages/:messageId/reactions', authenticate, validate, chatController.addReaction);

router.delete('/messages/:messageId/reactions', authenticate, chatController.removeReaction);

router.patch('/:chatId/settings', authenticate, validate, chatController.updateChatSettings);

router.delete('/:chatId', authenticate, chatController.deleteChat);

module.exports = router;

 