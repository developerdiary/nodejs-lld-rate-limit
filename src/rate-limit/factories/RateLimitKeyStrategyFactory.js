const IpKeyStrategy = require('../strategies/IpKeyStrategy');
const UserKeyStrategy = require('../strategies/UserKeyStrategy');

class RateLimitKeyStrategyFactory {
  static create(type, options = {}) {
    switch (type.toLowerCase()) {
      case 'ip':
        return new IpKeyStrategy();
      
      case 'user':
        return new UserKeyStrategy(options);
      
      default:
        throw new Error(`Unknown key strategy type: ${type}`);
    }
  }
}

module.exports = RateLimitKeyStrategyFactory;
