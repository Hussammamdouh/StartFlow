const socketIO = require('socket.io');
const chatService = require('./chatService');
const { auth } = require('../config/firebase');
const config = require('../config/config');

class SocketService {
  constructor() {
    this.io = null;
    this.userSockets = new Map(); // Map to store user ID to socket ID mapping
  }

  initialize(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.NODE_ENV === 'production' ? config.allowedOrigins : '*',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    // Authentication middleware
    this.io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error('Authentication error'));
        }

        const decodedToken = await auth.verifyIdToken(token);
        socket.userId = decodedToken.uid;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`User connected: ${socket.userId}`);
      this.userSockets.set(socket.userId, socket.id);

      // Join user's chats
      this.joinUserChats(socket);

      // Handle new message
      socket.on('send_message', async (data) => {
        try {
          const { chatId, content } = data;
          
          // Verify user is part of the chat
          const chat = await chatService.getChatById(chatId);
          if (!chat.participants.includes(socket.userId)) {
            socket.emit('error', { message: 'You are not a participant in this chat' });
            return;
          }

          // Save message to database
          const message = await chatService.sendMessage(chatId, socket.userId, content);

          // Emit message to all participants
          chat.participants.forEach(participantId => {
            const participantSocketId = this.userSockets.get(participantId);
            if (participantSocketId) {
              this.io.to(participantSocketId).emit('new_message', {
                chatId,
                message
              });
            }
          });
        } catch (error) {
          socket.emit('error', { message: error.message });
        }
      });

      // Handle typing indicator
      socket.on('typing', (data) => {
        const { chatId } = data;
        socket.to(chatId).emit('user_typing', {
          chatId,
          userId: socket.userId
        });
      });

      // Handle stop typing
      socket.on('stop_typing', (data) => {
        const { chatId } = data;
        socket.to(chatId).emit('user_stop_typing', {
          chatId,
          userId: socket.userId
        });
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
        this.userSockets.delete(socket.userId);
      });
    });
  }

  async joinUserChats(socket) {
    try {
      const chats = await chatService.getUserChats(socket.userId);
      chats.forEach(chat => {
        socket.join(chat.id);
      });
    } catch (error) {
      console.error('Error joining user chats:', error);
    }
  }

  // Method to emit events to specific users
  emitToUser(userId, event, data) {
    const socketId = this.userSockets.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Method to emit events to all users in a chat
  emitToChat(chatId, event, data) {
    this.io.to(chatId).emit(event, data);
  }
}

module.exports = new SocketService(); 