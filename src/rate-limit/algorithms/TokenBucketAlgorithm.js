const RateLimitAlgorithm = require('./RateLimitAlgorithm');
const redisClient = require('../../redis/redisClient');

class TokenBucketAlgorithm extends RateLimitAlgorithm {
    constructor({ capacity, refillRate }) {
        super();
        this.capacity = capacity;
        this.refillRate = refillRate; // tokens per second
    }

    async allow(key) {
        const now = Math.floor(Date.now() / 1000);
        const redisKey = `rate_limit:${key}`;

        const luaScript = `
        local bucket = redis.call("HMGET", KEYS[1], "tokens", "last_refill")
        local tokens = tonumber(bucket[1])
        local last_refill = tonumber(bucket[2])

        local capacity = tonumber(ARGV[1])
        local now = tonumber(ARGV[2])
        local refill_rate = tonumber(ARGV[3])

        if tokens == nil then
            tokens = capacity
            last_refill = now
        end

        local elapsed = now - last_refill
        if elapsed > 0 then
            local refill = math.floor(elapsed * refill_rate)
            tokens = math.min(capacity, tokens + refill)
            last_refill = now
        end

        local allowed = 0
        if tokens > 0 then
            tokens = tokens - 1
            allowed = 1
        end

        redis.call("HMSET", KEYS[1],
            "tokens", tokens,
            "last_refill", last_refill
        )
        redis.call("EXPIRE", KEYS[1], 3600)

        return allowed`;

        const allowed = await redisClient.eval(luaScript, {
            keys: [redisKey],
            arguments: [
                this.capacity.toString(),
                now.toString(),
                this.refillRate.toString()
            ]
        });

        return allowed === 1;
    }
}

module.exports = TokenBucketAlgorithm;