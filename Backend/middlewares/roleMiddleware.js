const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Please authenticate' });
      }

      if (!req.user.role) {
        return res.status(403).json({ error: 'User role not defined' });
      }

      // Admin has access to everything
      if (req.user.role === 'admin') {
        return next();
      }

      // Check if user's role is in allowed roles
      if (allowedRoles.includes(req.user.role)) {
        return next();
      }

      return res.status(403).json({ error: 'Access denied' });
    } catch (error) {
      console.error('Role check error:', error);
      res.status(500).json({ error: 'Error checking role' });
    }
  };
};

module.exports = {
  checkRole
}; 