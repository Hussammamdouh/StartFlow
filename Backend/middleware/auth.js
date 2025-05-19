module.exports.authenticate = (req, res, next) => {
  // Dummy authentication: allow all requests
  // Replace with your real authentication logic
  req.user = { uid: 'dummy-user-id' };
  next();
}; 