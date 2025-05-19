const Joi = require('joi');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  role: Joi.string().valid('user', 'businessOwner', 'fundingEntity', 'admin').required(),
  businessDetails: Joi.when('role', {
    is: 'businessOwner',
    then: Joi.object({
      businessName: Joi.string().required(),
      businessOwnerName: Joi.string().required(),
      idNumber: Joi.string().required(),
      teamSize: Joi.number().integer().min(1).required(),
      taxRegister: Joi.string().required(),
      businessEmail: Joi.string().email().required(),
      businessPhone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
      businessLocation: Joi.string().required(),
      businessIndustry: Joi.string().required()
    }).required(),
    otherwise: Joi.forbidden()
  }),
  fundingDetails: Joi.when('role', {
    is: 'fundingEntity',
    then: Joi.object({
      fundingEntityName: Joi.string().required(),
      fundingEntityResponsibleName: Joi.string().required(),
      fundingEntityPhone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
      fundingEntityEmail: Joi.string().email().required(),
      fundingTaxRegister: Joi.string().required(),
      fundingLocation: Joi.string().required()
    }).required(),
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

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updateStatusSchema
}; 