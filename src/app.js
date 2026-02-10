const express = require('express');
const rateLimitMiddleware = require('./rate-limit/rateLimitMiddleware');
const RateLimitAlgorithmFactory = require('./rate-limit/factories/RateLimitAlgorithmFactory');
const RateLimitKeyStrategyFactory = require('./rate-limit/factories/RateLimitKeyStrategyFactory');

const app = express();

// Using Factory Pattern - Token Bucket example
// const rateLimiter = rateLimitMiddleware({
//   keyStrategy: RateLimitKeyStrategyFactory.create('ip'),
//   algorithm: RateLimitAlgorithmFactory.create('token-bucket', {
//     capacity: 10,
//     refillRate: 1 // 1 token per second
//   })
// });
// app.use(rateLimiter);

// Using Factory Pattern - Fixed Window example
// const fixedWindowLimiter = rateLimitMiddleware({
//   keyStrategy: RateLimitKeyStrategyFactory.create('ip'),
//   algorithm: RateLimitAlgorithmFactory.create('fixed-window', {
//     limit: 5,
//     windowSizeInSeconds: 10
//   })
// });
// app.use(fixedWindowLimiter);

// Using Factory Pattern - Sliding Window: 5 requests per 10 seconds
const slidingWindowLimiter = rateLimitMiddleware({
  keyStrategy: RateLimitKeyStrategyFactory.create('ip'),
  algorithm: RateLimitAlgorithmFactory.create('sliding-window', {
    limit: 5,
    windowSizeInSeconds: 10
  })
});

app.use(slidingWindowLimiter);

app.set('trust proxy', true);
app.use('/', require('./routes/test.routes'));

module.exports = app;
