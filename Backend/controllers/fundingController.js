const { db } = require('../config/firebase');
const { fundingRequestSchema, fundingOfferSchema, offerResponseSchema } = require('../validations/fundingValidation');
const FundingRequest = require('../models/FundingRequest');
const FundingOffer = require('../models/FundingOffer');

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

// BUSINESS APIs
exports.createFundingRequest = async (req, res) => {
  try {
    // Always use authenticated user
    const businessOwnerId = req.user.uid;
    const data = { ...req.body, businessOwnerId };
    const { error } = fundingRequestSchema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });
    // Find business owned by this user
    const businessSnap = await db.collection('businesses').where('ownerId', '==', businessOwnerId).limit(1).get();
    if (businessSnap.empty) return res.status(400).json({ error: 'No business found for user' });
    const businessId = businessSnap.docs[0].id;
    const fundingRequest = new FundingRequest({ ...data, businessId, status: 'pending' });
    // Firestore batch for atomicity
    const batch = db.batch();
    const reqRef = db.collection('fundingRequests').doc();
    batch.set(reqRef, { ...fundingRequest, id: reqRef.id });
    batch.update(db.collection('businesses').doc(businessId), {
      fundingRequests: db.FieldValue ? db.FieldValue.arrayUnion(reqRef.id) : [],
    });
    await batch.commit();
    res.status(201).json({ message: 'Funding request created', id: reqRef.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBusinessDashboard = async (req, res) => {
  try {
    const businessOwnerId = req.user.uid;
    const businessSnap = await db.collection('businesses').where('ownerId', '==', businessOwnerId).limit(1).get();
    if (businessSnap.empty) return res.status(400).json({ error: 'No business found for user' });
    const businessId = businessSnap.docs[0].id;
    const requestsSnap = await db.collection('fundingRequests').where('businessId', '==', businessId).get();
    const offersSnap = await db.collection('fundingOffers').where('businessId', '==', businessId).get();
    const totalRequested = requestsSnap.docs.reduce((sum, doc) => sum + (doc.data().amountRequested || 0), 0);
    const totalOffers = offersSnap.size;
    const acceptedOffers = offersSnap.docs.filter(doc => doc.data().status === 'accepted').length;
    const totalFunded = offersSnap.docs.filter(doc => doc.data().status === 'accepted').reduce((sum, doc) => sum + (doc.data().amountOffered || 0), 0);
    res.json({
      totalRequested,
      totalOffers,
      acceptedOffers,
      totalFunded,
      requests: requestsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      offers: offersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBusinessFundingOffers = async (req, res) => {
  try {
    const businessOwnerId = req.user.uid;
    const businessSnap = await db.collection('businesses').where('ownerId', '==', businessOwnerId).limit(1).get();
    if (businessSnap.empty) return res.status(400).json({ error: 'No business found for user' });
    const businessId = businessSnap.docs[0].id;
    const { limit, offset } = getPagination(req.query);
    const offersSnap = await db.collection('fundingOffers').where('businessId', '==', businessId).offset(offset).limit(limit).get();
    res.json(offersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBusinesses = async (req, res) => {
  try {
    const { limit, offset } = getPagination(req.query);
    const snap = await db.collection('businesses').offset(offset).limit(limit).get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.respondToFundingOffer = async (req, res) => {
  try {
    const { error } = offerResponseSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const { offerId } = req.params;
    const { status } = req.body;
    await db.collection('fundingOffers').doc(offerId).update({ status, updatedAt: new Date().toISOString() });
    // Notification stub
    notify(req.user.uid, `You have ${status} a funding offer.`);
    res.json({ message: `Offer ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// FUNDING ENTITY APIs
exports.getFundingEntityDashboard = async (req, res) => {
  try {
    const fundingEntityId = req.user.uid;
    const offersSnap = await db.collection('fundingOffers').where('fundingEntityId', '==', fundingEntityId).get();
    const totalOffers = offersSnap.size;
    const acceptedOffers = offersSnap.docs.filter(doc => doc.data().status === 'accepted').length;
    const rejectedOffers = offersSnap.docs.filter(doc => doc.data().status === 'rejected').length;
    const totalInvested = offersSnap.docs.filter(doc => doc.data().status === 'accepted').reduce((sum, doc) => sum + (doc.data().amountOffered || 0), 0);
    res.json({
      totalOffers,
      acceptedOffers,
      rejectedOffers,
      totalInvested,
      offers: offersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInvestmentRequests = async (req, res) => {
  try {
    const { limit, offset } = getPagination(req.query);
    const snap = await db.collection('fundingRequests').where('status', '==', 'pending').offset(offset).limit(limit).get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createFundingOffer = async (req, res) => {
  try {
    const fundingEntityId = req.user.uid;
    const data = { ...req.body, fundingEntityId };
    const { error } = fundingOfferSchema.validate(data);
    if (error) return res.status(400).json({ error: error.details[0].message });
    const offer = new FundingOffer({ ...data, status: 'pending' });
    // Firestore batch for atomicity
    const batch = db.batch();
    const ref = db.collection('fundingOffers').doc();
    batch.set(ref, { ...offer, id: ref.id });
    batch.update(db.collection('fundingRequests').doc(data.fundingRequestId), {
      offers: db.FieldValue ? db.FieldValue.arrayUnion(ref.id) : [],
    });
    await batch.commit();
    // Notification stub
    notify(data.fundingEntityId, 'You submitted a funding offer.');
    res.status(201).json({ message: 'Funding offer submitted', id: ref.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllFundingEntities = async (req, res) => {
  try {
    const { limit, offset } = getPagination(req.query);
    const snap = await db.collection('users').where('role', '==', 'fundingEntity').offset(offset).limit(limit).get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 