const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const {
  communityPostSchema,
  communityCommentSchema,
  communityReactionSchema,
  jobPostingSchema
} = require('../validations/communityValidation');
const communityController = require('../controllers/communityController');

router.post('/community/post', authenticate, validate(communityPostSchema), communityController.createPost);
router.get('/community/posts', authenticate, communityController.getPosts);
router.post('/community/react', authenticate, validate(communityReactionSchema), communityController.reactToPost);
router.post('/community/comment', authenticate, validate(communityCommentSchema), communityController.addComment);
router.post('/community/job', authenticate, validate(jobPostingSchema), communityController.createJob);

module.exports = router; 