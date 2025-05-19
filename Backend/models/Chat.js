class Chat {
  constructor({ 
    id, 
    participants = [], 
    type = 'direct', // direct or group
    name = null, // for group chats
    description = null, // for group chats
    createdBy = null, // for group chats
    admins = [], // for group chats
    lastMessage = null, 
    unreadCounts = {}, // { userId: count }
    pinned = false,
    muted = {}, // { userId: true/false }
    archived = {}, // { userId: true/false }
    createdAt, 
    updatedAt 
  }) {
    this.id = id;
    this.participants = participants;
    this.type = type;
    this.name = name;
    this.description = description;
    this.createdBy = createdBy;
    this.admins = admins;
    this.lastMessage = lastMessage;
    this.unreadCounts = unreadCounts;
    this.pinned = pinned;
    this.muted = muted;
    this.archived = archived;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }

  // Helper methods
  incrementUnreadCount(userId) {
    if (!this.muted[userId]) {
      this.unreadCounts[userId] = (this.unreadCounts[userId] || 0) + 1;
    }
  }

  resetUnreadCount(userId) {
    this.unreadCounts[userId] = 0;
  }

  addParticipant(userId) {
    if (!this.participants.includes(userId)) {
      this.participants.push(userId);
      this.unreadCounts[userId] = 0;
      this.muted[userId] = false;
      this.archived[userId] = false;
    }
  }

  removeParticipant(userId) {
    const index = this.participants.indexOf(userId);
    if (index > -1) {
      this.participants.splice(index, 1);
      delete this.unreadCounts[userId];
      delete this.muted[userId];
      delete this.archived[userId];
      const adminIndex = this.admins.indexOf(userId);
      if (adminIndex > -1) {
        this.admins.splice(adminIndex, 1);
      }
    }
  }

  addAdmin(userId) {
    if (!this.admins.includes(userId)) {
      this.admins.push(userId);
    }
  }

  removeAdmin(userId) {
    const index = this.admins.indexOf(userId);
    if (index > -1) {
      this.admins.splice(index, 1);
    }
  }

  toggleMute(userId) {
    this.muted[userId] = !this.muted[userId];
  }

  toggleArchive(userId) {
    this.archived[userId] = !this.archived[userId];
  }

  togglePin() {
    this.pinned = !this.pinned;
  }

  updateLastMessage(message) {
    this.lastMessage = {
      content: message.content,
      senderId: message.senderId,
      timestamp: message.createdAt,
      type: message.type
    };
    this.updatedAt = message.createdAt;
  }

  toJSON() {
    return {
      id: this.id,
      participants: this.participants,
      type: this.type,
      name: this.name,
      description: this.description,
      createdBy: this.createdBy,
      admins: this.admins,
      lastMessage: this.lastMessage,
      unreadCounts: this.unreadCounts,
      pinned: this.pinned,
      muted: this.muted,
      archived: this.archived,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Chat; 