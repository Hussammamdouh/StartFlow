const { db } = require('../config/firebase');

function getPagination(query) {
  let limit = parseInt(query.limit, 10) || 10;
  if (limit > 50) limit = 50;
  let page = parseInt(query.page, 10) || 1;
  let offset = (page - 1) * limit;
  return { limit, page, offset };
}

exports.getPendingApprovals = async (req, res) => {
  try {
    const { limit, offset } = getPagination(req.query);
    const snap = await db.collection('users').where('status', '==', 'pending').offset(offset).limit(limit).get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.approveOrRejectUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    await db.collection('users').doc(id).update({ status });
    console.log(`[ADMIN] User ${id} status set to ${status} by admin ${req.user.uid}`);
    res.json({ message: `User ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPlatformAnalytics = async (req, res) => {
  try {
    const usersSnap = await db.collection('users').get();
    const businessesSnap = await db.collection('businesses').get();
    const fundingRequestsSnap = await db.collection('fundingRequests').get();
    const fundingOffersSnap = await db.collection('fundingOffers').get();
    const postsSnap = await db.collection('communityPosts').get();
    const commentsSnap = await db.collection('communityComments').get();
    const jobsSnap = await db.collection('jobPostings').get();
    res.json({
      totalUsers: usersSnap.size,
      totalBusinesses: businessesSnap.size,
      totalFundingRequests: fundingRequestsSnap.size,
      totalFundingOffers: fundingOffersSnap.size,
      totalCommunityPosts: postsSnap.size,
      totalCommunityComments: commentsSnap.size,
      totalJobPostings: jobsSnap.size
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 