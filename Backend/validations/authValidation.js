const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  role: Joi.string().valid('user', 'businessOwner', 'fundingEntity', 'admin').required(),
  
  // Business Owner specific fields
  businessName: Joi.when('role', {
    is: 'businessOwner',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  businessOwnerName: Joi.when('role', {
    is: 'businessOwner',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  idNumber: Joi.when('role', {
    is: 'businessOwner',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  idPhoto: Joi.when('role', {
    is: 'businessOwner',
    then: Joi.string().optional(),
    otherwise: Joi.forbidden()
  }),
  teamSize: Joi.when('role', {
    is: 'businessOwner',
    then: Joi.number().integer().min(1).required(),
    otherwise: Joi.forbidden()
  }),
  taxRegister: Joi.when('role', {
    is: 'businessOwner',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  businessEmail: Joi.when('role', {
    is: 'businessOwner',
    then: Joi.string().email().required(),
    otherwise: Joi.forbidden()
  }),
  businessPhone: Joi.when('role', {
    is: 'businessOwner',
    then: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    otherwise: Joi.forbidden()
  }),
  businessLocation: Joi.when('role', {
    is: 'businessOwner',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  businessIndustry: Joi.when('role', {
    is: 'businessOwner',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  fundingRounds: Joi.when('role', {
    is: 'businessOwner',
    then: Joi.number().integer().min(0).default(0),
    otherwise: Joi.forbidden()
  }),
  fundingTotal: Joi.when('role', {
    is: 'businessOwner',
    then: Joi.string().default('0'),
    otherwise: Joi.forbidden()
  }),
  
  // Funding Entity specific fields
  fundingEntityName: Joi.when('role', {
    is: 'fundingEntity',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  fundingEntityResponsibleName: Joi.when('role', {
    is: 'fundingEntity',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  fundingEntityPhone: Joi.when('role', {
    is: 'fundingEntity',
    then: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
    otherwise: Joi.forbidden()
  }),
  fundingEntityEmail: Joi.when('role', {
    is: 'fundingEntity',
    then: Joi.string().email().required(),
    otherwise: Joi.forbidden()
  }),
  fundingTaxRegister: Joi.when('role', {
    is: 'fundingEntity',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  fundingLocation: Joi.when('role', {
    is: 'fundingEntity',
    then: Joi.string().required(),
    otherwise: Joi.forbidden()
  }),
  fundingPreferences: Joi.when('role', {
    is: 'fundingEntity',
    then: Joi.string().optional(),
    otherwise: Joi.forbidden()
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const updateProfileSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/)
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'approved', 'rejected').required()
});

// Business Owner update schema
const updateBusinessOwnerSchema = Joi.object({
  businessName: Joi.string(),
  businessOwnerName: Joi.string(),
  idNumber: Joi.string(),
  idPhoto: Joi.string(),
  teamSize: Joi.number().integer().min(1),
  taxRegister: Joi.string(),
  businessEmail: Joi.string().email(),
  businessPhone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
  businessLocation: Joi.string(),
  businessIndustry: Joi.string(),
  fundingRounds: Joi.number().integer().min(0),
  fundingTotal: Joi.string()
});

// Funding Entity update schema
const updateFundingEntitySchema = Joi.object({
  fundingEntityName: Joi.string(),
  fundingEntityResponsibleName: Joi.string(),
  fundingEntityPhone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/),
  fundingEntityEmail: Joi.string().email(),
  fundingTaxRegister: Joi.string(),
  fundingLocation: Joi.string(),
  fundingPreferences: Joi.string()
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updateStatusSchema,
  updateBusinessOwnerSchema,
  updateFundingEntitySchema
}; 