const RateLimitKeyStrategy = require('./RateLimitKeyStrategy');

class UserKeyStrategy extends RateLimitKeyStrategy {
  getKey(req) {
    return req.headers['x-user-id'] || 'anonymous';
  }
}

module.exports = UserKeyStrategy;
