class Message {
  constructor({ 
    id, 
    conversationId, 
    senderId, 
    content, 
    type = 'text', // text, image, file
    fileUrl = null,
    fileName = null,
    fileType = null,
    fileSize = null,
    edited = false,
    editedAt = null,
    deleted = false,
    deletedAt = null,
    reactions = {}, // { userId: reaction }
    readBy = [], // array of userIds
    createdAt 
  }) {
    this.id = id;
    this.conversationId = conversationId;
    this.senderId = senderId;
    this.content = content;
    this.type = type;
    this.fileUrl = fileUrl;
    this.fileName = fileName;
    this.fileType = fileType;
    this.fileSize = fileSize;
    this.edited = edited;
    this.editedAt = editedAt;
    this.deleted = deleted;
    this.deletedAt = deletedAt;
    this.reactions = reactions;
    this.readBy = readBy;
    this.createdAt = createdAt || new Date().toISOString();
  }

  // Helper methods
  markAsRead(userId) {
    if (!this.readBy.includes(userId)) {
      this.readBy.push(userId);
    }
  }

  addReaction(userId, reaction) {
    this.reactions[userId] = reaction;
  }

  removeReaction(userId) {
    delete this.reactions[userId];
  }

  edit(newContent) {
    this.content = newContent;
    this.edited = true;
    this.editedAt = new Date().toISOString();
  }

  delete() {
    this.deleted = true;
    this.deletedAt = new Date().toISOString();
    this.content = null;
  }

  toJSON() {
    return {
      id: this.id,
      conversationId: this.conversationId,
      senderId: this.senderId,
      content: this.content,
      type: this.type,
      fileUrl: this.fileUrl,
      fileName: this.fileName,
      fileType: this.fileType,
      fileSize: this.fileSize,
      edited: this.edited,
      editedAt: this.editedAt,
      deleted: this.deleted,
      deletedAt: this.deletedAt,
      reactions: this.reactions,
      readBy: this.readBy,
      createdAt: this.createdAt
    };
  }
}

module.exports = Message; 