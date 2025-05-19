class FundingRequest {
  constructor({ id, businessId, businessOwnerId, title, description, amountRequested, status = 'pending', offers = [], createdAt, updatedAt }) {
    this.id = id;
    this.businessId = businessId;
    this.businessOwnerId = businessOwnerId;
    this.title = title;
    this.description = description;
    this.amountRequested = amountRequested;
    this.status = status;
    this.offers = offers;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }
}

module.exports = FundingRequest; 