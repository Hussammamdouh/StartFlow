const { db } = require('../config/firebase');
const { communityPostSchema, communityCommentSchema, communityReactionSchema, jobPostingSchema } = require('../validations/communityValidation');
const CommunityPost = require('../models/CommunityPost');
const CommunityComment = require('../models/CommunityComment');
const CommunityReaction = require('../models/CommunityReaction');
const JobPosting = require('../models/JobPosting');

// Notification stub
function notify(userId, message) {
  // TODO: Implement real notification logic
  console.log(`[NOTIFY] To user ${userId}: ${message}`);
}

// Pagination helper
function getPagination(query) {
  let limit = parseInt(query.limit, 10) || 10;
  if (limit > 50) limit = 50;
  let page = parseInt(query.page, 10) || 1;
  let offset = (page - 1) * limit;
  return { limit, page, offset };
}

exports.createPost = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user.uid };
    const { error } = communityPostSchema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const post = new CommunityPost(data);
    const ref = await db.collection('communityPosts').add({ ...post });
    notify(req.user.uid, 'You created a new post.');
    res.status(201).json({ message: 'Post created', id: ref.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { limit, offset } = getPagination(req.query);
    const snap = await db.collection('communityPosts').orderBy('createdAt', 'desc').offset(offset).limit(limit).get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reactToPost = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user.uid };
    const { error } = communityReactionSchema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const reaction = new CommunityReaction(data);
    const ref = await db.collection('communityReactions').add({ ...reaction });
    notify(req.user.uid, 'You reacted to a post.');
    res.status(201).json({ message: 'Reaction added', id: ref.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user.uid };
    const { error } = communityCommentSchema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const comment = new CommunityComment(data);
    const ref = await db.collection('communityComments').add({ ...comment });
    notify(req.user.uid, 'You commented on a post.');
    res.status(201).json({ message: 'Comment added', id: ref.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const data = { ...req.body, userId: req.user.uid };
    const { error } = jobPostingSchema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const job = new JobPosting(data);
    const ref = await db.collection('jobPostings').add({ ...job });
    notify(req.user.uid, 'You posted a new job.');
    res.status(201).json({ message: 'Job posted', id: ref.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 