class CommunityReaction {
  constructor({ id, postId, userId, type, createdAt }) {
    this.id = id;
    this.postId = postId;
    this.userId = userId;
    this.type = type; // e.g., 'like', 'love', 'insightful', etc.
    this.createdAt = createdAt || new Date().toISOString();
  }
}

module.exports = CommunityReaction; 