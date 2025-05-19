const chatService = require('../services/chatService');
const { validate } = require('../middlewares/validate');
const Joi = require('joi');

// Validation schemas
const createChatSchema = Joi.object({
  participants: Joi.array().items(Joi.string()).min(2).required(),
  type: Joi.string().valid('direct', 'group').default('direct'),
  name: Joi.string().when('type', {
    is: 'group',
    then: Joi.string().required(),
    otherwise: Joi.string().allow(null)
  }),
  description: Joi.string().allow(null, '')
});

const sendMessageSchema = Joi.object({
  content: Joi.string().required(),
  type: Joi.string().valid('text', 'image', 'file').default('text'),
  fileUrl: Joi.string().when('type', {
    is: Joi.string().valid('image', 'file'),
    then: Joi.string().required(),
    otherwise: Joi.string().allow(null)
  }),
  fileName: Joi.string().when('type', {
    is: Joi.string().valid('image', 'file'),
    then: Joi.string().required(),
    otherwise: Joi.string().allow(null)
  }),
  fileType: Joi.string().when('type', {
    is: Joi.string().valid('image', 'file'),
    then: Joi.string().required(),
    otherwise: Joi.string().allow(null)
  }),
  fileSize: Joi.number().when('type', {
    is: Joi.string().valid('image', 'file'),
    then: Joi.number().required(),
    otherwise: Joi.number().allow(null)
  })
});

const editMessageSchema = Joi.object({
  content: Joi.string().required()
});

const reactionSchema = Joi.object({
  reaction: Joi.string().required()
});

const chatSettingsSchema = Joi.object({
  name: Joi.string().allow(null, ''),
  description: Joi.string().allow(null, ''),
  pinned: Joi.boolean(),
  muted: Joi.boolean(),
  archived: Joi.boolean()
});

class ChatController {
  async createChat(req, res) {
    try {
      const { error } = createChatSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const chat = await chatService.createChat({
        ...req.body,
        createdBy: req.user.uid
      });

      res.status(201).json(chat);
    } catch (error) {
      console.error('Error creating chat:', error);
      res.status(500).json({ error: 'Failed to create chat' });
    }
  }

  async sendMessage(req, res) {
    try {
      const { error } = sendMessageSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const message = await chatService.sendMessage(
        req.params.chatId,
        req.user.uid,
        req.body
      );

      res.status(201).json(message);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  }

  async getChatMessages(req, res) {
    try {
      const { limit = 50, before } = req.query;
      const messages = await chatService.getChatMessages(
        req.params.chatId,
        parseInt(limit),
        before
      );

      res.json(messages);
    } catch (error) {
      console.error('Error getting chat messages:', error);
      res.status(500).json({ error: 'Failed to get chat messages' });
    }
  }

  async getUserChats(req, res) {
    try {
      const chats = await chatService.getUserChats(req.user.uid);
      res.json(chats);
    } catch (error) {
      console.error('Error getting user chats:', error);
      res.status(500).json({ error: 'Failed to get user chats' });
    }
  }

  async markMessagesAsRead(req, res) {
    try {
      await chatService.markMessagesAsRead(req.params.chatId, req.user.uid);
      res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({ error: 'Failed to mark messages as read' });
    }
  }

  async editMessage(req, res) {
    try {
      const { error } = editMessageSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const message = await chatService.editMessage(
        req.params.messageId,
        req.user.uid,
        req.body.content
      );

      res.json(message);
    } catch (error) {
      console.error('Error editing message:', error);
      res.status(500).json({ error: 'Failed to edit message' });
    }
  }

  async deleteMessage(req, res) {
    try {
      const message = await chatService.deleteMessage(
        req.params.messageId,
        req.user.uid
      );

      res.json(message);
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ error: 'Failed to delete message' });
    }
  }

  async addReaction(req, res) {
    try {
      const { error } = reactionSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const message = await chatService.addReaction(
        req.params.messageId,
        req.user.uid,
        req.body.reaction
      );

      res.json(message);
    } catch (error) {
      console.error('Error adding reaction:', error);
      res.status(500).json({ error: 'Failed to add reaction' });
    }
  }

  async removeReaction(req, res) {
    try {
      const message = await chatService.removeReaction(
        req.params.messageId,
        req.user.uid
      );

      res.json(message);
    } catch (error) {
      console.error('Error removing reaction:', error);
      res.status(500).json({ error: 'Failed to remove reaction' });
    }
  }

  async updateChatSettings(req, res) {
    try {
      const { error } = chatSettingsSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      const chat = await chatService.updateChatSettings(
        req.params.chatId,
        req.user.uid,
        req.body
      );

      res.json(chat);
    } catch (error) {
      console.error('Error updating chat settings:', error);
      res.status(500).json({ error: 'Failed to update chat settings' });
    }
  }

  async deleteChat(req, res) {
    try {
      await chatService.deleteChat(req.params.chatId, req.user.uid);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting chat:', error);
      res.status(500).json({ error: 'Failed to delete chat' });
    }
  }
}

module.exports = new ChatController(); 