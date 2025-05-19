const admin = require('firebase-admin');

// Mock data for testing
const mockUsers = {
  regular: {
    email: 'user@example.com',
    password: 'Password123!',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+201234567890',
    role: 'user',
    status: 'approved'
  },
  businessOwner: {
    email: 'business@example.com',
    password: 'Password123!',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+201234567891',
    role: 'business_owner',
    status: 'pending',
    businessDetails: {
      businessName: 'Test Business',
      businessOwnerName: 'Jane Smith',
      idNumber: '1234567890',
      teamSize: 10,
      taxRegister: 'TR123456',
      businessEmail: 'business@example.com',
      businessPhone: '+201234567891',
      businessLocation: 'Cairo, Egypt',
      businessIndustry: 'Software'
    }
  },
  admin: {
    email: 'admin@example.com',
    password: 'Password123!',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+201234567892',
    role: 'admin',
    status: 'approved'
  }
};

// Helper function to create a test user
const createTestUser = async (userType = 'regular') => {
  const userData = mockUsers[userType];
  const userRecord = await admin.auth().createUser({
    email: userData.email,
    password: userData.password,
    displayName: `${userData.firstName} ${userData.lastName}`,
    phoneNumber: userData.phone
  });

  await admin.firestore().collection('users').doc(userRecord.uid).set({
    uid: userRecord.uid,
    ...userData
  });

  return userRecord;
};

// Helper function to delete a test user
const deleteTestUser = async (uid) => {
  await admin.auth().deleteUser(uid);
  await admin.firestore().collection('users').doc(uid).delete();
};

// Helper function to get a test token
const getTestToken = async (userType = 'regular') => {
  const userData = mockUsers[userType];
  const userRecord = await admin.auth().getUserByEmail(userData.email);
  return admin.auth().createCustomToken(userRecord.uid);
};

// Helper function to clean up test data
const cleanupTestData = async () => {
  const usersSnapshot = await admin.firestore().collection('users').get();
  const deletePromises = usersSnapshot.docs.map(async (doc) => {
    await admin.auth().deleteUser(doc.id);
    await doc.ref.delete();
  });
  await Promise.all(deletePromises);
};

module.exports = {
  mockUsers,
  createTestUser,
  deleteTestUser,
  getTestToken,
  cleanupTestData
}; 