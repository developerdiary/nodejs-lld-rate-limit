const rateLimitMiddleware = ({ keyStrategy, algorithm }) => {
  return async (req, res, next) => {
    try {
      const key = keyStrategy.getKey(req);
      const result = await algorithm.allow(key);

      // Support both boolean and object return types
      const allowed = typeof result === 'boolean' ? result : result.allowed;
      const used = result.used ?? null;

      if (algorithm.limit) {
        res.setHeader('X-RateLimit-Limit', algorithm.limit);

        if (used !== null) {
          res.setHeader(
            'X-RateLimit-Remaining',
            Math.max(0, algorithm.limit - used)
          );
        }

        res.setHeader(
          'X-RateLimit-Reset',
          Math.floor(Date.now() / 1000) + algorithm.windowSize
        );
      }

      if (!allowed) {
        return res.status(429).json({
          message: 'Too many requests'
        });
      }

      next();
    } catch (err) {
      console.error('Rate limiter error:', err);
      next();
    }
  };
};

module.exports = rateLimitMiddleware;