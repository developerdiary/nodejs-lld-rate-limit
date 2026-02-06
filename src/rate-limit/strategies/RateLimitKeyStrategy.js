class RateLimitKeyStrategy {
  getKey(req) {
    throw new Error('getKey() must be implemented');
  }
}

module.exports = RateLimitKeyStrategy;
