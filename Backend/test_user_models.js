const BusinessOwner = require('./models/BusinessOwner');
const FundingEntity = require('./models/FundingEntity');

// Test BusinessOwner model
console.log('=== Testing BusinessOwner Model ===');

const businessOwnerData = {
  uid: 'business123',
  email: 'john@techstart.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1234567890',
  role: 'businessOwner',
  status: 'approved',
  businessName: 'TechStart Inc.',
  businessOwnerName: 'John Doe',
  idNumber: 'BUS123456',
  idPhoto: 'https://example.com/id-photo.jpg',
  teamSize: 10,
  taxRegister: 'TAX789012',
  businessEmail: 'contact@techstart.com',
  businessPhone: '+1234567890',
  businessLocation: 'San Francisco, CA',
  businessIndustry: 'Technology',
  fundingRounds: 2,
  fundingTotal: '1.5M',
  createdAt: new Date().toISOString()
};

try {
  const businessOwner = new BusinessOwner(businessOwnerData);
  console.log('✅ BusinessOwner created successfully');
  console.log('Business Details:', businessOwner.getBusinessDetails());
  
  // Test validation
  const isValid = businessOwner.validateBusinessData();
  console.log('✅ Business data validation passed');
  
  // Test update
  businessOwner.updateBusinessDetails({
    teamSize: 15,
    fundingRounds: 3
  });
  console.log('✅ Business details updated successfully');
  console.log('Updated team size:', businessOwner.teamSize);
  console.log('Updated funding rounds:', businessOwner.fundingRounds);
  
} catch (error) {
  console.error('❌ BusinessOwner test failed:', error.message);
}

console.log('\n=== Testing FundingEntity Model ===');

const fundingEntityData = {
  uid: 'funding123',
  email: 'jane@vcfund.com',
  firstName: 'Jane',
  lastName: 'Smith',
  phone: '+1234567890',
  role: 'fundingEntity',
  status: 'approved',
  fundingEntityName: 'Venture Capital Fund',
  fundingEntityResponsibleName: 'Jane Smith',
  fundingEntityPhone: '+1234567890',
  fundingEntityEmail: 'contact@vcfund.com',
  fundingTaxRegister: 'FUND456789',
  fundingLocation: 'New York, NY',
  fundingPreferences: 'Early-stage tech startups, Series A and B',
  createdAt: new Date().toISOString()
};

try {
  const fundingEntity = new FundingEntity(fundingEntityData);
  console.log('✅ FundingEntity created successfully');
  console.log('Funding Entity Details:', fundingEntity.getFundingEntityDetails());
  
  // Test validation
  const isValid = fundingEntity.validateFundingEntityData();
  console.log('✅ Funding entity data validation passed');
  
  // Test update
  fundingEntity.updateFundingEntityDetails({
    fundingLocation: 'San Francisco, CA',
    fundingPreferences: 'AI and ML startups, Series A to C'
  });
  console.log('✅ Funding entity details updated successfully');
  console.log('Updated location:', fundingEntity.fundingLocation);
  console.log('Updated preferences:', fundingEntity.fundingPreferences);
  
} catch (error) {
  console.error('❌ FundingEntity test failed:', error.message);
}

console.log('\n=== Testing Validation Errors ===');

// Test BusinessOwner validation error
try {
  const invalidBusinessOwner = new BusinessOwner({
    uid: 'invalid123',
    email: 'invalid@example.com',
    firstName: 'Invalid',
    lastName: 'User',
    phone: '+1234567890',
    role: 'businessOwner',
    status: 'pending',
    // Missing required fields
    businessName: '',
    businessOwnerName: '',
    teamSize: 0, // Invalid team size
    businessEmail: 'invalid-email', // Invalid email
    businessPhone: 'invalid-phone' // Invalid phone
  });
  
  invalidBusinessOwner.validateBusinessData();
  console.log('❌ Validation should have failed');
} catch (error) {
  console.log('✅ BusinessOwner validation error caught:', error.message);
}

// Test FundingEntity validation error
try {
  const invalidFundingEntity = new FundingEntity({
    uid: 'invalid456',
    email: 'invalid@example.com',
    firstName: 'Invalid',
    lastName: 'Entity',
    phone: '+1234567890',
    role: 'fundingEntity',
    status: 'pending',
    // Missing required fields
    fundingEntityName: '',
    fundingEntityEmail: 'invalid-email', // Invalid email
    fundingEntityPhone: 'invalid-phone' // Invalid phone
  });
  
  invalidFundingEntity.validateFundingEntityData();
  console.log('❌ Validation should have failed');
} catch (error) {
  console.log('✅ FundingEntity validation error caught:', error.message);
}

console.log('\n=== All Tests Completed ==='); 