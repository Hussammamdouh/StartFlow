class FundingOffer {
  constructor({ id, fundingEntityId, fundingRequestId, businessId, amountOffered, terms, status = 'pending', createdAt, updatedAt }) {
    this.id = id;
    this.fundingEntityId = fundingEntityId;
    this.fundingRequestId = fundingRequestId;
    this.businessId = businessId;
    this.amountOffered = amountOffered;
    this.terms = terms;
    this.status = status;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || new Date().toISOString();
  }
}

module.exports = FundingOffer; 