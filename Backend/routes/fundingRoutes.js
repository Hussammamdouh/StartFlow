const express = require('express');
const router = express.Router();
const { authenticate, checkRole } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  fundingRequestSchema,
  fundingOfferSchema,
  offerResponseSchema
} = require('../validations/fundingValidation');
const fundingController = require('../controllers/fundingController');

// Business APIs
router.post('/business/request-funding', authenticate, checkRole('businessOwner'), validate(fundingRequestSchema), fundingController.createFundingRequest);
router.get('/business/dashboard', authenticate, checkRole('businessOwner'), fundingController.getBusinessDashboard);
router.get('/business/funding-offers', authenticate, checkRole('businessOwner'), fundingController.getBusinessFundingOffers);
router.get('/business/all', authenticate, fundingController.getAllBusinesses);
router.post('/business/funding-offers/:offerId/respond', authenticate, checkRole('businessOwner'), validate(offerResponseSchema), fundingController.respondToFundingOffer);

// Funding Entity APIs
router.get('/funding-entities/dashboard', authenticate, checkRole('fundingEntity'), fundingController.getFundingEntityDashboard);
router.get('/businesses/investment-requests', authenticate, checkRole('fundingEntity'), fundingController.getInvestmentRequests);
router.post('/funding-entities/offer', authenticate, checkRole('fundingEntity'), validate(fundingOfferSchema), fundingController.createFundingOffer);
router.get('/funding-entities/all', authenticate, fundingController.getAllFundingEntities);

module.exports = router; 