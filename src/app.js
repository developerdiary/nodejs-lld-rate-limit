const express = require('express');
const rateLimitMiddleware = require('./rate-limit/rateLimitMiddleware');
const TokenBucketAlgorithm = require('./rate-limit/algorithms/TokenBucketAlgorithm');
const IpKeyStrategy = require('./rate-limit/strategies/IpKeyStrategy');
const FixedWindowAlgorithm = require('./rate-limit/algorithms/FixedWindowAlgorithm');
const SlidingWindowAlgorithm = require('./rate-limit/algorithms/SlidingWindowAlgorithm');

const app = express();

// const rateLimiter = rateLimitMiddleware({
//   keyStrategy: new IpKeyStrategy(),
//   algorithm: new TokenBucketAlgorithm({
//     capacity: 10,
//     refillRate: 1 // 1 token per second
//   })
// });
// app.use(rateLimiter);

// const fixedWindowLimiter = rateLimitMiddleware({
//   keyStrategy: new IpKeyStrategy(),
//   algorithm: new FixedWindowAlgorithm({
//     limit: 5,
//     windowSizeInSeconds: 10
//   })
// });

// app.use(fixedWindowLimiter);

// Sliding Window: 5 requests per 10 seconds
const slidingWindowLimiter = rateLimitMiddleware({
  keyStrategy: new IpKeyStrategy(),
  algorithm: new SlidingWindowAlgorithm({
    limit: 5,
    windowSizeInSeconds: 10
  })
});

app.use(slidingWindowLimiter);

app.set('trust proxy', true);
app.use('/', require('./routes/test.routes'));

module.exports = app;
