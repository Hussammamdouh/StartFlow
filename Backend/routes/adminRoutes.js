const express = require('express');
const router = express.Router();
const { authenticate, checkRole } = require('../middlewares/auth');
const adminController = require('../controllers/adminController');

router.get('/admin/pending-approvals', authenticate, checkRole('admin'), adminController.getPendingApprovals);
router.post('/admin/approve-user/:id', authenticate, checkRole('admin'), adminController.approveOrRejectUser);
router.get('/admin/analytics', authenticate, checkRole('admin'), adminController.getPlatformAnalytics);

module.exports = router; 