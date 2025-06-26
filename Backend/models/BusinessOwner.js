class BusinessOwner {
  constructor({ 
    uid, 
    email, 
    firstName, 
    lastName, 
    phone, 
    role, 
    status, 
    businessName,
    businessOwnerName,
    idNumber,
    idPhoto,
    teamSize,
    taxRegister,
    businessEmail,
    businessPhone,
    businessLocation,
    businessIndustry,
    fundingRounds,
    fundingTotal,
    createdAt 
  }) {
    this.uid = uid;
    this.email = email;
    this.firstName = firstName;
    this.lastName = lastName;
    this.phone = phone;
    this.role = role || 'businessOwner';
    this.status = status;
    
    // Business-specific fields
    this.businessName = businessName;
    this.businessOwnerName = businessOwnerName;
    this.idNumber = idNumber;
    this.idPhoto = idPhoto;
    this.teamSize = teamSize;
    this.taxRegister = taxRegister;
    this.businessEmail = businessEmail;
    this.businessPhone = businessPhone;
    this.businessLocation = businessLocation;
    this.businessIndustry = businessIndustry;
    this.fundingRounds = fundingRounds || 0;
    this.fundingTotal = fundingTotal || '0';
    
    this.createdAt = createdAt;
  }

  // Method to get business details as an object
  getBusinessDetails() {
    return {
      businessName: this.businessName,
      businessOwnerName: this.businessOwnerName,
      idNumber: this.idNumber,
      idPhoto: this.idPhoto,
      teamSize: this.teamSize,
      taxRegister: this.taxRegister,
      businessEmail: this.businessEmail,
      businessPhone: this.businessPhone,
      businessLocation: this.businessLocation,
      businessIndustry: this.businessIndustry,
      fundingRounds: this.fundingRounds,
      fundingTotal: this.fundingTotal
    };
  }

  // Method to update business details
  updateBusinessDetails(businessData) {
    Object.keys(businessData).forEach(key => {
      if (this.hasOwnProperty(key)) {
        this[key] = businessData[key];
      }
    });
  }

  // Method to validate business data
  validateBusinessData() {
    const requiredFields = [
      'businessName',
      'businessOwnerName', 
      'idNumber',
      'teamSize',
      'taxRegister',
      'businessEmail',
      'businessPhone',
      'businessLocation',
      'businessIndustry'
    ];

    const missingFields = requiredFields.filter(field => !this[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required business fields: ${missingFields.join(', ')}`);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.businessEmail)) {
      throw new Error('Invalid business email format');
    }

    // Validate phone format
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(this.businessPhone)) {
      throw new Error('Invalid business phone format');
    }

    // Validate team size
    if (this.teamSize < 1) {
      throw new Error('Team size must be at least 1');
    }

    return true;
  }
}

module.exports = BusinessOwner; 