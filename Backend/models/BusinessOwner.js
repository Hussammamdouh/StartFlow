class BusinessOwner {
  constructor({ uid, email, firstName, lastName, phone, role, status, businessDetails, createdAt }) {
    this.uid = uid;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.role = role || 'businessOwner';
    this.status = status;
    this.businessDetails = businessDetails;
    this.createdAt = createdAt;
  }
}

module.exports = BusinessOwner; 