const rateLimitMiddleware = require('../rateLimitMiddleware');
const RateLimitAlgorithmFactory = require('./RateLimitAlgorithmFactory');
const RateLimitKeyStrategyFactory = require('./RateLimitKeyStrategyFactory');

/**
 * High-level factory that creates complete rate limiter middleware
 * from configuration objects
 */
class RateLimiterFactory {
  /**
   * Create a rate limiter middleware from configuration
   * @param {Object} config - Configuration object
   * @param {Object} config.algorithm - Algorithm configuration
   * @param {string} config.algorithm.type - Algorithm type (token-bucket, fixed-window, sliding-window)
   * @param {Object} config.algorithm.options - Algorithm-specific options
   * @param {Object} config.keyStrategy - Key strategy configuration
   * @param {string} config.keyStrategy.type - Strategy type (ip, user)
   * @param {Object} config.keyStrategy.options - Strategy-specific options
   * @returns {Function} Express middleware function
   */
  static createFromConfig(config) {
    if (!config.algorithm || !config.algorithm.type) {
      throw new Error('Algorithm configuration is required');
    }

    if (!config.keyStrategy || !config.keyStrategy.type) {
      throw new Error('Key strategy configuration is required');
    }

    const algorithm = RateLimitAlgorithmFactory.create(
      config.algorithm.type,
      config.algorithm.options
    );

    const keyStrategy = RateLimitKeyStrategyFactory.create(
      config.keyStrategy.type,
      config.keyStrategy.options
    );

    return rateLimitMiddleware({
      algorithm,
      keyStrategy
    });
  }

  /**
   * Create multiple rate limiters from a configuration file
   * @param {Object} configFile - Configuration file with multiple rate limiter configs
   * @returns {Object} Object with named rate limiters
   */
  static createMultipleFromConfig(configFile) {
    const rateLimiters = {};

    if (!configFile.rateLimiters || typeof configFile.rateLimiters !== 'object') {
      throw new Error('Invalid configuration file format');
    }

    for (const [name, config] of Object.entries(configFile.rateLimiters)) {
      rateLimiters[name] = this.createFromConfig(config);
    }

    return rateLimiters;
  }
}

module.exports = RateLimiterFactory;
