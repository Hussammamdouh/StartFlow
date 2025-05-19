const Joi = require('joi');

const fundingRequestSchema = Joi.object({
  businessId: Joi.string().required(),
  businessOwnerId: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  amountRequested: Joi.number().positive().required(),
});

const fundingOfferSchema = Joi.object({
  fundingEntityId: Joi.string().required(),
  fundingRequestId: Joi.string().required(),
  businessId: Joi.string().required(),
  amountOffered: Joi.number().positive().required(),
  terms: Joi.string().required(),
});

const offerResponseSchema = Joi.object({
  status: Joi.string().valid('accepted', 'rejected').required()
});

module.exports = {
  fundingRequestSchema,
  fundingOfferSchema,
  offerResponseSchema
}; 