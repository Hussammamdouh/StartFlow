class FundingEntity {
  constructor({ 
    uid, 
    email, 
    firstName, 
    lastName, 
    phone, 
    role, 
    status, 
    fundingEntityName,
    fundingEntityResponsibleName,
    fundingEntityPhone,
    fundingEntityEmail,
    fundingTaxRegister,
    fundingLocation,
    fundingPreferences,
    createdAt 
  }) {
    this.uid = uid;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.role = role || 'fundingEntity';
    this.status = status;
    
    // Funding entity-specific fields
    this.fundingEntityName = fundingEntityName;
    this.fundingEntityResponsibleName = fundingEntityResponsibleName;
    this.fundingEntityPhone = fundingEntityPhone;
    this.fundingEntityEmail = fundingEntityEmail;
    this.fundingTaxRegister = fundingTaxRegister;
    this.fundingLocation = fundingLocation;
    this.fundingPreferences = fundingPreferences;
    
    this.createdAt = createdAt;
  }

  // Method to get funding entity details as an object
  getFundingEntityDetails() {
    return {
      fundingEntityName: this.fundingEntityName,
      fundingEntityResponsibleName: this.fundingEntityResponsibleName,
      fundingEntityPhone: this.fundingEntityPhone,
      fundingEntityEmail: this.fundingEntityEmail,
      fundingTaxRegister: this.fundingTaxRegister,
      fundingLocation: this.fundingLocation,
      fundingPreferences: this.fundingPreferences
    };
  }

  // Method to update funding entity details
  updateFundingEntityDetails(fundingData) {
    Object.keys(fundingData).forEach(key => {
      if (this.hasOwnProperty(key)) {
        this[key] = fundingData[key];
      }
    });
  }

  // Method to validate funding entity data
  validateFundingEntityData() {
    const requiredFields = [
      'fundingEntityName',
      'fundingEntityResponsibleName',
      'fundingEntityPhone',
      'fundingEntityEmail',
      'fundingTaxRegister',
      'fundingLocation'
    ];

    const missingFields = requiredFields.filter(field => !this[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required funding entity fields: ${missingFields.join(', ')}`);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.fundingEntityEmail)) {
      throw new Error('Invalid funding entity email format');
    }

    // Validate phone format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(this.fundingEntityPhone)) {
      throw new Error('Invalid funding entity phone format');
    }

    return true;
  }
}

module.exports = FundingEntity; 