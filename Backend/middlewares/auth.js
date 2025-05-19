const { auth, db } = require('../config/firebase');
const { isBlacklisted } = require('../utils/tokenBlacklist');
const BaseUser = require('../models/BaseUser');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Please authenticate' });
    }
    const token = authHeader.split(' ')[1];

    // Check blacklist
    if (isBlacklisted(token)) {
      return res.status(401).json({ error: 'Token has been logged out' });
    }

    const decodedToken = await auth.verifyIdToken(token);
    // Get user data from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      return res.status(401).json({ error: 'Please authenticate' });
    }
    const userData = userDoc.data();
    req.user = {
      uid: decodedToken.uid,
      ...userData
    };
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Please authenticate' });
  }
};

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ 
        error: 'You do not have permission to perform this action' 
      });
    }

    if (req.user.role === 'admin' || roles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ 
        error: 'You do not have permission to perform this action' 
      });
    }
  };
};

module.exports = {
  authenticate,
  checkRole
}; 