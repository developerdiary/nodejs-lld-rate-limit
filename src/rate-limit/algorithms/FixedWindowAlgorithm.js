const RateLimitAlgorithm = require('./RateLimitAlgorithm');
const redisClient = require('../../redis/redisClient');

class FixedWindowAlgorithm extends RateLimitAlgorithm {
  constructor({ limit, windowSizeInSeconds }) {
    super();
    this.limit = limit;
    this.windowSize = windowSizeInSeconds;
  }

  async allow(key) {
    const now = Math.floor(Date.now() / 1000);
    const windowStart = Math.floor(now / this.windowSize) * this.windowSize;
    const redisKey = `rate_limit_fw:${key}:${windowStart}`;

    const luaScript = `
      local current = redis.call("INCR", KEYS[1])

      if current == 1 then
        redis.call("EXPIRE", KEYS[1], ARGV[1])
      end

      if current > tonumber(ARGV[2]) then
        return 0
      end

      return 1
    `;

    const allowed = await redisClient.eval(luaScript, {
      keys: [redisKey],
      arguments: [
        String(this.windowSize), // TTL
        String(this.limit)       // max requests
      ]
    });

    return allowed === 1;
  }
}

module.exports = FixedWindowAlgorithm;
