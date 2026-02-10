const FixedWindowAlgorithm = require('../algorithms/FixedWindowAlgorithm');
const SlidingWindowAlgorithm = require('../algorithms/SlidingWindowAlgorithm');
const TokenBucketAlgorithm = require('../algorithms/TokenBucketAlgorithm');

class RateLimitAlgorithmFactory {
  static create(type, options) {
    switch (type.toLowerCase()) {
      case 'fixed-window':
        return new FixedWindowAlgorithm(options);
      
      case 'sliding-window':
        return new SlidingWindowAlgorithm(options);
      
      case 'token-bucket':
        return new TokenBucketAlgorithm(options);
      
      default:
        throw new Error(`Unknown algorithm type: ${type}`);
    }
  }
}

module.exports = RateLimitAlgorithmFactory;
