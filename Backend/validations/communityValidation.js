const Joi = require('joi');

const communityPostSchema = Joi.object({
  userId: Joi.string().required(),
  content: Joi.string().required(),
  media: Joi.array().items(Joi.string().uri()).optional()
});

const communityCommentSchema = Joi.object({
  postId: Joi.string().required(),
  userId: Joi.string().required(),
  content: Joi.string().required()
});

const communityReactionSchema = Joi.object({
  postId: Joi.string().required(),
  userId: Joi.string().required(),
  type: Joi.string().valid('like', 'love', 'insightful', 'support', 'celebrate').required()
});

const jobPostingSchema = Joi.object({
  userId: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  requirements: Joi.array().items(Joi.string()).optional()
});

module.exports = {
  communityPostSchema,
  communityCommentSchema,
  communityReactionSchema,
  jobPostingSchema
}; 