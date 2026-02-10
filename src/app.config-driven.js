const express = require('express');
const RateLimiterFactory = require('./rate-limit/factories/RateLimiterFactory');
const config = require('../config.example.json');

const app = express();
app.set('trust proxy', true);

// Create all rate limiters from configuration file
const rateLimiters = RateLimiterFactory.createMultipleFromConfig(config);

// Apply different rate limiters to different routes
app.use('/api/public', rateLimiters.strict);
app.use('/api/premium', rateLimiters.premium);
app.use('/api', rateLimiters.default);

// Or create a single rate limiter from inline config
const customLimiter = RateLimiterFactory.createFromConfig({
  algorithm: {
    type: 'sliding-window',
    options: {
      limit: 20,
      windowSizeInSeconds: 60
    }
  },
  keyStrategy: {
    type: 'ip'
  }
});

app.use('/api/custom', customLimiter);

app.use('/', require('./routes/test.routes'));

module.exports = app;
