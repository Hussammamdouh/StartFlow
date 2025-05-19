class JobPosting {
  constructor({ id, userId, title, description, requirements = [], applicants = [], createdAt, updatedAt }) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.description = description;
    this.requirements = requirements;
    this.applicants = applicants;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }
}

module.exports = JobPosting; 