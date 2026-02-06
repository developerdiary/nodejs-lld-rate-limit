const RateLimitAlgorithm = require('./RateLimitAlgorithm');
const redisClient = require('../../redis/redisClient');

class SlidingWindowAlgorithm extends RateLimitAlgorithm {
  constructor({ limit, windowSizeInSeconds }) {
    super();
    this.limit = limit;
    this.windowSize = windowSizeInSeconds;
  }

  async allow(key) {
    const now = Math.floor(Date.now() / 1000);
    const currentWindow = Math.floor(now / this.windowSize);
    const previousWindow = currentWindow - 1;

    const currentKey = `rate_limit_sw:${key}:${currentWindow}`;
    const prevKey = `rate_limit_sw:${key}:${previousWindow}`;

    const elapsedInWindow = now % this.windowSize;
    const overlap = (this.windowSize - elapsedInWindow) / this.windowSize;

    const luaScript = `
      local current = redis.call("INCR", KEYS[1])
      redis.call("EXPIRE", KEYS[1], ARGV[1])

      local prev = tonumber(redis.call("GET", KEYS[2])) or 0

      local effective = current + (prev * tonumber(ARGV[2]))

      if effective > tonumber(ARGV[3]) then
        return {0, effective}
      end

      return {1, effective}
    `;

    const result = await redisClient.eval(luaScript, {
      keys: [currentKey, prevKey],
      arguments: [
        String(this.windowSize * 2), // TTL
        String(overlap),             // overlap %
        String(this.limit)
      ]
    });

    return {
      allowed: result[0] === 1,
      used: Math.ceil(result[1])
    };
  }
}

module.exports = SlidingWindowAlgorithm;