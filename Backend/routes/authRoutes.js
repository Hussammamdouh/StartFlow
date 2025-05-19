const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { registerSchema, loginSchema, updateProfileSchema, updateStatusSchema } = require('../validations/authValidation');
const { register, login, getProfile, updateProfile, getAllUsers, updateUserStatus, logout, approveUser } = require('../controllers/authController');
const { checkRole } = require('../middlewares/roleMiddleware');

router.post('/register', validate(registerSchema), register);

router.post('/login', validate(loginSchema), login);

router.get('/profile', authenticate, getProfile);

router.patch('/profile', authenticate, validate(updateProfileSchema), updateProfile);

router.get('/users', authenticate, checkRole(['admin']), getAllUsers);

router.patch('/users/:userId/status', authenticate, checkRole(['admin']), validate(updateStatusSchema), updateUserStatus);

router.post('/logout', authenticate, logout);
router.put('/update-profile', authenticate, validate(updateProfileSchema), updateProfile);
router.post('/admin/approve-user/:userId', authenticate, checkRole(['admin']), approveUser);

module.exports = router; 