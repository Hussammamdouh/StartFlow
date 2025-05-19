const { db } = require('../config/firebase');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

class ChatService {
  constructor() {
    this.chatsCollection = db.collection('chats');
    this.messagesCollection = db.collection('messages');
  }

  async createChat({ participants, type = 'direct', name = null, description = null, createdBy = null }) {
    try {
      const chatRef = this.chatsCollection.doc();
      const chat = new Chat({
        id: chatRef.id,
        participants,
        type,
        name,
        description,
        createdBy,
        admins: type === 'group' ? [createdBy] : [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      await chatRef.set(chat);
      return chat;
    } catch (error) {
      console.error('Error creating chat:', error);
      throw new Error('Failed to create chat');
    }
  }

  async sendMessage(chatId, senderId, { content, type = 'text', fileUrl = null, fileName = null, fileType = null, fileSize = null }) {
    try {
      const messageRef = this.messagesCollection.doc();
      const message = new Message({
        id: messageRef.id,
        conversationId: chatId,
        senderId,
        content,
        type,
        fileUrl,
        fileName,
        fileType,
        fileSize,
        createdAt: new Date().toISOString()
      });

      // Use a transaction to ensure atomicity
      await db.runTransaction(async (transaction) => {
        // Create the message
        transaction.set(messageRef, message);

        // Update the chat's lastMessage and updatedAt
        const chatRef = this.chatsCollection.doc(chatId);
        const chatDoc = await transaction.get(chatRef);
        const chat = new Chat(chatDoc.data());

        // Update chat with new message
        chat.updateLastMessage(message);
        
        // Increment unread count for all participants except sender
        chat.participants.forEach(participantId => {
          if (participantId !== senderId) {
            chat.incrementUnreadCount(participantId);
          }
        });

        transaction.update(chatRef, chat);
      });

      return message;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  async getChatMessages(chatId, limit = 50, before = null) {
    try {
      let query = this.messagesCollection
        .where('conversationId', '==', chatId)
        .orderBy('createdAt', 'desc')
        .limit(limit);

      if (before) {
        query = query.startAfter(before);
      }

      const snapshot = await query.get();
      return snapshot.docs.map(doc => new Message(doc.data()));
    } catch (error) {
      console.error('Error getting chat messages:', error);
      throw new Error('Failed to get chat messages');
    }
  }

  async getUserChats(userId) {
    try {
      const snapshot = await this.chatsCollection
        .where('participants', 'array-contains', userId)
        .orderBy('updatedAt', 'desc')
        .get();

      return snapshot.docs.map(doc => new Chat(doc.data()));
    } catch (error) {
      console.error('Error getting user chats:', error);
      throw new Error('Failed to get user chats');
    }
  }

  async getChatById(chatId) {
    try {
      const doc = await this.chatsCollection.doc(chatId).get();
      if (!doc.exists) {
        throw new Error('Chat not found');
      }
      return new Chat(doc.data());
    } catch (error) {
      console.error('Error getting chat:', error);
      throw new Error('Failed to get chat');
    }
  }

  async markMessagesAsRead(chatId, userId) {
    try {
      const chat = await this.getChatById(chatId);
      if (!chat.participants.includes(userId)) {
        throw new Error('User is not a participant in this chat');
      }

      // Reset unread count
      chat.resetUnreadCount(userId);
      await this.chatsCollection.doc(chatId).update({
        [`unreadCounts.${userId}`]: 0
      });

      // Mark all unread messages as read
      const unreadMessages = await this.messagesCollection
        .where('conversationId', '==', chatId)
        .where('readBy', 'array-contains', userId)
        .get();

      const batch = db.batch();
      unreadMessages.docs.forEach(doc => {
        const message = new Message(doc.data());
        message.markAsRead(userId);
        batch.update(doc.ref, { readBy: message.readBy });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw new Error('Failed to mark messages as read');
    }
  }

  async editMessage(messageId, userId, newContent) {
    try {
      const messageRef = this.messagesCollection.doc(messageId);
      const messageDoc = await messageRef.get();
      
      if (!messageDoc.exists) {
        throw new Error('Message not found');
      }

      const message = new Message(messageDoc.data());
      if (message.senderId !== userId) {
        throw new Error('You can only edit your own messages');
      }

      message.edit(newContent);
      await messageRef.update(message);
      return message;
    } catch (error) {
      console.error('Error editing message:', error);
      throw new Error('Failed to edit message');
    }
  }

  async deleteMessage(messageId, userId) {
    try {
      const messageRef = this.messagesCollection.doc(messageId);
      const messageDoc = await messageRef.get();
      
      if (!messageDoc.exists) {
        throw new Error('Message not found');
      }

      const message = new Message(messageDoc.data());
      if (message.senderId !== userId) {
        throw new Error('You can only delete your own messages');
      }

      message.delete();
      await messageRef.update(message);
      return message;
    } catch (error) {
      console.error('Error deleting message:', error);
      throw new Error('Failed to delete message');
    }
  }

  async addReaction(messageId, userId, reaction) {
    try {
      const messageRef = this.messagesCollection.doc(messageId);
      const messageDoc = await messageRef.get();
      
      if (!messageDoc.exists) {
        throw new Error('Message not found');
      }

      const message = new Message(messageDoc.data());
      message.addReaction(userId, reaction);
      await messageRef.update({ reactions: message.reactions });
      return message;
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw new Error('Failed to add reaction');
    }
  }

  async removeReaction(messageId, userId) {
    try {
      const messageRef = this.messagesCollection.doc(messageId);
      const messageDoc = await messageRef.get();
      
      if (!messageDoc.exists) {
        throw new Error('Message not found');
      }

      const message = new Message(messageDoc.data());
      message.removeReaction(userId);
      await messageRef.update({ reactions: message.reactions });
      return message;
    } catch (error) {
      console.error('Error removing reaction:', error);
      throw new Error('Failed to remove reaction');
    }
  }

  async updateChatSettings(chatId, userId, settings) {
    try {
      const chat = await this.getChatById(chatId);
      if (!chat.participants.includes(userId)) {
        throw new Error('User is not a participant in this chat');
      }

      if (chat.type === 'group' && !chat.admins.includes(userId)) {
        throw new Error('Only admins can update group settings');
      }

      const updates = {};
      if (settings.name) updates.name = settings.name;
      if (settings.description) updates.description = settings.description;
      if (settings.pinned !== undefined) updates.pinned = settings.pinned;
      if (settings.muted !== undefined) updates[`muted.${userId}`] = settings.muted;
      if (settings.archived !== undefined) updates[`archived.${userId}`] = settings.archived;

      await this.chatsCollection.doc(chatId).update(updates);
      return this.getChatById(chatId);
    } catch (error) {
      console.error('Error updating chat settings:', error);
      throw new Error('Failed to update chat settings');
    }
  }

  async deleteChat(chatId, userId) {
    try {
      const chat = await this.getChatById(chatId);
      if (!chat.participants.includes(userId)) {
        throw new Error('User is not a participant in this chat');
      }

      if (chat.type === 'group' && !chat.admins.includes(userId)) {
        throw new Error('Only admins can delete group chats');
      }

      // Use a transaction to ensure atomicity
      await db.runTransaction(async (transaction) => {
        // Delete all messages in the chat
        const messagesSnapshot = await this.messagesCollection
          .where('conversationId', '==', chatId)
          .get();

        messagesSnapshot.docs.forEach(doc => {
          transaction.delete(doc.ref);
        });

        // Delete the chat
        transaction.delete(this.chatsCollection.doc(chatId));
      });
    } catch (error) {
      console.error('Error deleting chat:', error);
      throw new Error('Failed to delete chat');
    }
  }
}

module.exports = new ChatService(); 