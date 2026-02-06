const RateLimitKeyStrategy = require('./RateLimitKeyStrategy');

class IpKeyStrategy extends RateLimitKeyStrategy {
  getKey(req) {
    return req.ip;
  }
}

module.exports = IpKeyStrategy;
