// Simple in-memory blacklist (use Redis for production)
const blacklist = new Map();

function add(token, exp) {
  blacklist.set(token, exp * 1000); // exp is in seconds, convert to ms
}

function isBlacklisted(token) {
  const exp = blacklist.get(token);
  if (!exp) return false;
  if (Date.now() > exp) {
    blacklist.delete(token);
    return false;
  }
  return true;
}

module.exports = { add, isBlacklisted }; 