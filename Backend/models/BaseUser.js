class BaseUser {
  constructor({ uid, email, firstName, lastName, phone, role, status, createdAt }) {
    this.uid = uid;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.role = role;
    this.status = status;
    this.createdAt = createdAt;
  }
}

module.exports = BaseUser; 