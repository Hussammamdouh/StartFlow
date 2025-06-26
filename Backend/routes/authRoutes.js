const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { 
  registerSchema, 
  loginSchema, 
  updateProfileSchema, 
  updateStatusSchema,
  updateBusinessOwnerSchema,
  updateFundingEntitySchema
} = require('../validations/authValidation');
const { 
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
} = require('../controllers/authController');
const { checkRole } = require('../middlewares/roleMiddleware');

// Authentication routes
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authenticate, logout);

// Profile routes
router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, validate(updateProfileSchema), updateProfile);
router.put('/update-profile', authenticate, validate(updateProfileSchema), updateProfile);

// Role-specific update routes
router.patch('/business-details', authenticate, validate(updateBusinessOwnerSchema), updateBusinessOwnerDetails);
router.patch('/funding-details', authenticate, validate(updateFundingEntitySchema), updateFundingEntityDetails);

// Admin routes
router.get('/users', authenticate, checkRole(['admin']), getAllUsers);
router.patch('/users/:userId/status', authenticate, checkRole(['admin']), validate(updateStatusSchema), updateUserStatus);
router.post('/admin/approve-user/:userId', authenticate, checkRole(['admin']), approveUser);

module.exports = router; 