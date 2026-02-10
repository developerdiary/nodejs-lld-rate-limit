const RateLimitKeyStrategy = require('./RateLimitKeyStrategy');

class UserKeyStrategy extends RateLimitKeyStrategy {
  constructor(options = {}) {
    super();
    this.userIdField = options.userIdField || 'userId';
    this.header = options.header || 'x-user-id';
  }

  getKey(req) {
    // Try req.user (from auth middleware like passport)
    if (req.user && req.user[this.userIdField]) {
      return `user:${req.user[this.userIdField]}`;
    }

    // Try custom header
    if (req.headers[this.header]) {
      return `user:${req.headers[this.header]}`;
    }

    // Fallback to anonymous
    return 'user:anonymous';
  }
}

module.exports = UserKeyStrategy;

