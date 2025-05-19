class CommunityPost {
  constructor({ id, userId, content, media = [], reactions = [], comments = [], createdAt, updatedAt }) {
    this.id = id;
    this.userId = userId;
    this.content = content;
    this.media = media;
    this.reactions = reactions;
    this.comments = comments;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }
}

module.exports = CommunityPost; 