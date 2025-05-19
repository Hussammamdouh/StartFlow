class CommunityComment {
  constructor({ id, postId, userId, content, createdAt }) {
    this.id = id;
    this.postId = postId;
    this.userId = userId;
    this.content = content;
    this.createdAt = createdAt || new Date().toISOString();
  }
}

module.exports = CommunityComment; 