// This is Strategy interface for algorithms.
class RateLimitAlgorithm {
  async allow(key) {
    throw new Error('allow() must be implemented');
  }
}

module.exports = RateLimitAlgorithm;