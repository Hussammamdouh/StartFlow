class FundingEntity {
  constructor({ uid, email, firstName, lastName, phone, role, status, fundingDetails, createdAt }) {
    this.uid = uid;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.role = role || 'fundingEntity';
    this.status = status;
    this.fundingDetails = fundingDetails;
    this.createdAt = createdAt;
  }
}

module.exports = FundingEntity; 