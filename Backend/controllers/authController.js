const { db, auth } = require('../config/firebase');
const { registerSchema, loginSchema, updateProfileSchema, updateStatusSchema, updateBusinessOwnerSchema, updateFundingEntitySchema } = require('../validations/authValidation');
const BaseUser = require('../models/BaseUser');
const BusinessOwner = require('../models/BusinessOwner');
const FundingEntity = require('../models/FundingEntity');
const { add: blacklistAdd } = require('../utils/tokenBlacklist');
const axios = require('axios');

// Register a new user
const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      role,
      // Business Owner fields
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
      // Funding Entity fields
      fundingEntityName,
      fundingEntityResponsibleName,
      fundingEntityPhone,
      fundingEntityEmail,
      fundingTaxRegister,
      fundingLocation,
      fundingPreferences
    } = req.body;

    // Create user in Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`,
      phoneNumber: phone
    });

    // Create custom token
    const token = await auth.createCustomToken(userRecord.uid);

    // Create user document in Firestore
    const userData = {
      uid: userRecord.uid,
      email,
      firstName,
      lastName,
      phone,
      role,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Add role-specific fields
    if (role === 'businessOwner') {
      userData.businessName = businessName;
      userData.businessOwnerName = businessOwnerName;
      userData.idNumber = idNumber;
      userData.idPhoto = idPhoto;
      userData.teamSize = teamSize;
      userData.taxRegister = taxRegister;
      userData.businessEmail = businessEmail;
      userData.businessPhone = businessPhone;
      userData.businessLocation = businessLocation;
      userData.businessIndustry = businessIndustry;
      userData.fundingRounds = fundingRounds || 0;
      userData.fundingTotal = fundingTotal || '0';
    }

    if (role === 'fundingEntity') {
      userData.fundingEntityName = fundingEntityName;
      userData.fundingEntityResponsibleName = fundingEntityResponsibleName;
      userData.fundingEntityPhone = fundingEntityPhone;
      userData.fundingEntityEmail = fundingEntityEmail;
      userData.fundingTaxRegister = fundingTaxRegister;
      userData.fundingLocation = fundingLocation;
      userData.fundingPreferences = fundingPreferences;
    }

    const userRef = db.collection('users').doc(userRecord.uid);
    await userRef.set(userData);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        uid: userRecord.uid,
        email,
        firstName,
        lastName,
        role,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Error registering user' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { email, password } = req.body;

    // Use Firebase REST API to sign in
    const apiKey = process.env.FIREBASE_API_KEY; // Set this in your .env
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        email,
        password,
        returnSecureToken: true
      }
    );

    const { idToken } = response.data;

    // Get user from Firestore
    const userSnapshot = await db.collection('users')
      .where('email', '==', email)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userSnapshot.docs[0].data();

    if (userData.status !== 'approved') {
      return res.status(403).json({ error: 'Account is pending approval' });
    }

    res.json({
      message: 'Login successful',
      token: idToken,
      user: {
        uid: userData.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        status: userData.status
      }
    });
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);
    res.status(401).json({ error: 'Invalid credentials' });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userRef = db.collection('users').doc(req.user.uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    
    // Build response based on user role
    const response = {
      user: {
        uid: userData.uid,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        role: userData.role,
        status: userData.status,
        createdAt: userData.createdAt
      }
    };

    // Add role-specific fields
    if (userData.role === 'businessOwner') {
      response.user.businessName = userData.businessName;
      response.user.businessOwnerName = userData.businessOwnerName;
      response.user.idNumber = userData.idNumber;
      response.user.idPhoto = userData.idPhoto;
      response.user.teamSize = userData.teamSize;
      response.user.taxRegister = userData.taxRegister;
      response.user.businessEmail = userData.businessEmail;
      response.user.businessPhone = userData.businessPhone;
      response.user.businessLocation = userData.businessLocation;
      response.user.businessIndustry = userData.businessIndustry;
      response.user.fundingRounds = userData.fundingRounds;
      response.user.fundingTotal = userData.fundingTotal;
    }

    if (userData.role === 'fundingEntity') {
      response.user.fundingEntityName = userData.fundingEntityName;
      response.user.fundingEntityResponsibleName = userData.fundingEntityResponsibleName;
      response.user.fundingEntityPhone = userData.fundingEntityPhone;
      response.user.fundingEntityEmail = userData.fundingEntityEmail;
      response.user.fundingTaxRegister = userData.fundingTaxRegister;
      response.user.fundingLocation = userData.fundingLocation;
      response.user.fundingPreferences = userData.fundingPreferences;
    }

    res.json(response);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Error fetching profile' });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { error } = updateProfileSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { firstName, lastName, phone } = req.body;
    const updateData = {};

    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;

    const userRef = db.collection('users').doc(req.user.uid);
    await userRef.update(updateData);

    res.json({
      message: 'Profile updated successfully',
      user: {
        uid: req.user.uid,
        ...updateData
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
};

// Update business owner details
const updateBusinessOwnerDetails = async (req, res) => {
  try {
    const { error } = updateBusinessOwnerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if user is a business owner
    if (req.user.role !== 'businessOwner') {
      return res.status(403).json({ error: 'Only business owners can update business details' });
    }

    const updateData = {};
    const allowedFields = [
      'businessName',
      'businessOwnerName',
      'idNumber',
      'idPhoto',
      'teamSize',
      'taxRegister',
      'businessEmail',
      'businessPhone',
      'businessLocation',
      'businessIndustry',
      'fundingRounds',
      'fundingTotal'
    ];

    // Only update provided fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const userRef = db.collection('users').doc(req.user.uid);
    await userRef.update(updateData);

    res.json({
      message: 'Business details updated successfully',
      user: {
        uid: req.user.uid,
        ...updateData
      }
    });
  } catch (error) {
    console.error('Update business owner details error:', error);
    res.status(500).json({ error: 'Error updating business details' });
  }
};

// Update funding entity details
const updateFundingEntityDetails = async (req, res) => {
  try {
    const { error } = updateFundingEntitySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if user is a funding entity
    if (req.user.role !== 'fundingEntity') {
      return res.status(403).json({ error: 'Only funding entities can update funding details' });
    }

    const updateData = {};
    const allowedFields = [
      'fundingEntityName',
      'fundingEntityResponsibleName',
      'fundingEntityPhone',
      'fundingEntityEmail',
      'fundingTaxRegister',
      'fundingLocation',
      'fundingPreferences'
    ];

    // Only update provided fields
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const userRef = db.collection('users').doc(req.user.uid);
    await userRef.update(updateData);

    res.json({
      message: 'Funding entity details updated successfully',
      user: {
        uid: req.user.uid,
        ...updateData
      }
    });
  } catch (error) {
    console.error('Update funding entity details error:', error);
    res.status(500).json({ error: 'Error updating funding entity details' });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      users.push({
        uid: doc.id,
        ...userData
      });
    });

    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Error fetching users' });
  }
};

// Update user status (admin only)
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    if (userData.role === 'admin') {
      return res.status(403).json({ error: 'Cannot update admin status' });
    }

    await userRef.update({ status });

    const updatedUser = (await userRef.get()).data();
    res.json({
      message: 'User status updated successfully',
      user: {
        uid: userId,
        ...updatedUser
      }
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: 'Error updating user status' });
  }
};

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = await auth.verifyIdToken(token);
    blacklistAdd(token, decoded.exp);
    res.json({ message: 'Logout successful.' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

const approveUser = async (req, res) => {
  req.body.status = 'approved';
  return updateUserStatus(req, res);
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  updateBusinessOwnerDetails,
  updateFundingEntityDetails,
  getAllUsers,
  updateUserStatus,
  logout,
  approveUser
}; 