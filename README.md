# 🚦 Rate Limiter System Design (Node.js + Redis)

A **production-ready, distributed rate limiting system** implementing multiple algorithms using **Node.js, Express, Redis, Lua**, and **Design Patterns**.

## 🎯 Why This Project?

**Rate Limiter is one of the MOST asked problems in Low-Level Design (LLD) interviews** at:
- **FAANG** (Facebook, Amazon, Apple, Netflix, Google)
- **Tier-1 Product Companies** (Uber, Airbnb, LinkedIn, Twitter)
- **Fintech & Payment Gateways** (Stripe, Razorpay, PayPal)
- **API Gateway & Cloud Platforms** (AWS, Azure, CloudFlare)

### Interview Topics Covered:
✅ **Algorithm Design** - Token Bucket, Fixed Window, Sliding Window  
✅ **System Design** - Strategy Pattern, Factory Pattern, Clean Architecture  
✅ **Distributed Systems** - Redis, Atomic Operations, Race Conditions  
✅ **Scalability** - Horizontal scaling, Multi-server coordination  
✅ **Trade-offs** - Memory vs Accuracy, Latency vs Consistency  

This implementation demonstrates **production-grade** solutions with atomic operations, extensible design, and real-world best practices.

---

## ✨ Features

### Algorithms Implemented
- ✅ **Token Bucket** - Best for burst traffic, used by AWS, Stripe
- ✅ **Fixed Window** - Simple & fast, used by GitHub API
- ✅ **Sliding Window** - High accuracy, used by Redis Enterprise

### Architecture & Design
- ✅ **Strategy Pattern** - Pluggable algorithms & key strategies
- ✅ **Factory Pattern** - Easy creation of rate limiters by type
- ✅ **SOLID Principles** - Clean, maintainable, testable code
- ✅ **Redis + Lua Scripts** - Atomic operations, no race conditions
- ✅ **Distributed-Ready** - Works across multiple servers

### Production Features
- ✅ RFC-compliant rate limit headers (`X-RateLimit-*`)
- ✅ Multiple key strategies (IP, User ID, API Key)
- ✅ Configurable limits per endpoint
- ✅ Graceful degradation on Redis failure

---

## 🧠 System Design Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Request                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              Express Middleware (Rate Limiter)                │
│  • Intercepts all requests                                    │
│  • Delegates to Strategy Pattern                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┴─────────────────────┐
        ↓                                            ↓
┌──────────────────┐                    ┌──────────────────────┐
│  Key Strategy    │                    │  Algorithm Strategy  │
│  ────────────    │                    │  ──────────────────  │
│  • IP-based      │                    │  • Token Bucket      │
│  • User-based    │                    │  • Fixed Window      │
│  • API Key-based │                    │  • Sliding Window    │
└──────────────────┘                    └──────────────────────┘
        │                                            │
        └─────────────────────┬─────────────────────┘
                              ↓
                    ┌──────────────────┐
                    │   Redis + Lua    │
                    │  ──────────────  │
                    │  • Atomic Ops    │
                    │  • In-Memory     │
                    │  • Distributed   │
                    └──────────────────┘
```

### Why Redis + Lua?
| Requirement | Solution |
|------------|----------|
| **Atomicity** | Lua scripts execute atomically (no race conditions) |
| **Speed** | In-memory operations (~1ms latency) |
| **Distribution** | Single source of truth across multiple servers |
| **Scalability** | Redis Cluster for horizontal scaling |
| **Persistence** | Optional AOF/RDB for reliability |

### Common Interview Questions:
1. **Q: Why not use in-memory cache (Node.js Map)?**  
   A: Won't work in distributed systems (multiple servers)

2. **Q: How do you handle Redis downtime?**  
   A: Graceful degradation - allow requests or use backup Redis

3. **Q: What if two requests come at the exact same time?**  
   A: Lua scripts in Redis execute atomically, preventing race conditions

4. **Q: How do you scale this across data centers?**  
   A: Use Redis Cluster with replication or multi-region Redis Enterprise

---

## 📊 Algorithm Comparison

| Algorithm | Pros | Cons | Use Case |
|-----------|------|------|----------|
| **Token Bucket** | • Allows bursts<br>• Smooth rate limiting<br>• Industry standard | • More complex logic | API gateways, payment systems |
| **Fixed Window** | • Simple<br>• Low memory<br>• Fast | • Boundary spike issue | Internal APIs, simple rate limiting |
| **Sliding Window** | • Accurate<br>• No boundary issues | • Higher memory<br>• Slightly slower | High-precision systems |

### Token Bucket Deep Dive
```
Bucket State:
┌────────────────────┐
│  Capacity: 10      │ ← Max tokens
│  Tokens:   7       │ ← Current tokens
│  Refill:   2/sec   │ ← Refill rate
└────────────────────┘

Request arrives:
• If tokens ≥ 1: Allow request, tokens--
• If tokens = 0: Reject (429 Too Many Requests)
• Background: Refill tokens over time
```

**Real-world example:** AWS API Gateway uses Token Bucket with burst capacity.

---

## 📂 Project Structure

```
rate-limit/
├── src/
│   ├── app.js                          # Express app setup
│   ├── app.config-driven.js            # Config-driven example
│   ├── server.js                       # Entry point
│   │
│   ├── redis/
│   │   └── redisClient.js              # Redis connection & config
│   │
│   ├── rate-limit/
│   │   ├── rateLimitMiddleware.js      # Main middleware
│   │   │
│   │   ├── algorithms/                 # Algorithm implementations
│   │   │   ├── RateLimitAlgorithm.js   # Base class (abstraction)
│   │   │   ├── TokenBucketAlgorithm.js # Token bucket logic
│   │   │   ├── FixedWindowAlgorithm.js # Fixed window logic
│   │   │   └── SlidingWindowAlgorithm.js # Sliding window logic
│   │   │
│   │   ├── strategies/                 # Key generation strategies
│   │   │   ├── RateLimitKeyStrategy.js # Base strategy
│   │   │   ├── IpKeyStrategy.js        # IP-based limiting
│   │   │   └── UserKeyStrategy.js      # User-based limiting
│   │   │
│   │   └── factories/                  # Factory Pattern implementations
│   │       ├── RateLimitAlgorithmFactory.js  # Creates algorithms by type
│   │       ├── RateLimitKeyStrategyFactory.js # Creates strategies by type
│   │       └── RateLimiterFactory.js         # High-level factory for config-driven setup
│   │
│   └── routes/
│       └── test.routes.js              # Test endpoints
│
├── config.example.json                 # Example configuration file
├── package.json
└── README.md
```

### Design Patterns Used
- **Strategy Pattern**: Swap algorithms & key strategies at runtime (algorithms and key strategies are interchangeable)
- **Factory Pattern**: Create algorithm and strategy instances based on type strings
- **Template Method**: Base algorithm class with common logic
- **Dependency Injection**: Middleware accepts strategy objects

#### Strategy Pattern Implementation
The system uses two strategy hierarchies:
1. **Algorithm Strategy**: Different rate limiting algorithms (Token Bucket, Fixed Window, Sliding Window)
2. **Key Strategy**: Different ways to identify clients (IP, User ID, API Key)

Each concrete implementation extends a base interface and provides its own logic. The middleware works with the base interface, allowing runtime swapping.

#### Factory Pattern Implementation
Instead of manually instantiating concrete classes with `new`, factories encapsulate the creation logic:

```javascript
// Without Factory (tight coupling)
const algorithm = new TokenBucketAlgorithm({ capacity: 10, refillRate: 1 });

// With Factory (loose coupling)
const algorithm = RateLimitAlgorithmFactory.create('token-bucket', { 
  capacity: 10, 
  refillRate: 1 
});
```

**Benefits:**
- Configuration-driven creation (can load from config files)
- Easier to add new algorithms without changing client code
- Centralized validation and error handling
- Simplified testing and mocking

**Factory Pattern Structure:**
```
┌──────────────────────────────────────────────┐
│      RateLimiterFactory (High-Level)         │
│  • createFromConfig()                        │
│  • createMultipleFromConfig()                │
└──────────────┬───────────────────────────────┘
               │ uses
       ┌───────┴────────┐
       ↓                ↓
┌──────────────┐  ┌──────────────────────┐
│  Algorithm   │  │   KeyStrategy        │
│  Factory     │  │   Factory            │
│              │  │                      │
│ create()     │  │ create()             │
│  ↓           │  │  ↓                   │
│  • token-    │  │  • ip                │
│    bucket    │  │  • user              │
│  • fixed-    │  │                      │
│    window    │  │                      │
│  • sliding-  │  │                      │
│    window    │  │                      │
└──────────────┘  └──────────────────────┘
```

---

## ⚙️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework & middleware |
| **Redis 7** | In-memory data store for rate limiting state |
| **Lua** | Atomic script execution in Redis |
| **Docker** | Redis containerization for local dev |

**Key Dependencies:**
- `redis` - Official Redis client for Node.js
- `express` - Fast, minimalist web framework

---

## � Usage Examples

### Using Factory Pattern - Config Driven (Best for Production)

Create a configuration file:
```json
{
  "rateLimiters": {
    "default": {
      "algorithm": {
        "type": "token-bucket",
        "options": { "capacity": 10, "refillRate": 1 }
      },
      "keyStrategy": { "type": "ip" }
    },
    "premium": {
      "algorithm": {
        "type": "fixed-window",
        "options": { "limit": 1000, "windowSizeInSeconds": 3600 }
      },
      "keyStrategy": { 
        "type": "user", 
        "options": { "userIdField": "userId" }
      }
    }
  }
}
```

Load and use:
```javascript
const RateLimiterFactory = require('./rate-limit/factories/RateLimiterFactory');
const config = require('./config.json');

// Create all rate limiters from config
const rateLimiters = RateLimiterFactory.createMultipleFromConfig(config);

app.use('/api/public', rateLimiters.default);
app.use('/api/premium', rateLimiters.premium);
```

### Using Factory Pattern - Direct Creation

```javascript
const rateLimitMiddleware = require('./rate-limit/rateLimitMiddleware');
const RateLimitAlgorithmFactory = require('./rate-limit/factories/RateLimitAlgorithmFactory');
const RateLimitKeyStrategyFactory = require('./rate-limit/factories/RateLimitKeyStrategyFactory');

// Token Bucket with IP-based limiting
const tokenBucketLimiter = rateLimitMiddleware({
  keyStrategy: RateLimitKeyStrategyFactory.create('ip'),
  algorithm: RateLimitAlgorithmFactory.create('token-bucket', {
    capacity: 10,
    refillRate: 1 // 1 token per second
  })
});

// Fixed Window with User-based limiting
const fixedWindowLimiter = rateLimitMiddleware({
  keyStrategy: RateLimitKeyStrategyFactory.create('user', { userIdField: 'userId' }),
  algorithm: RateLimitAlgorithmFactory.create('fixed-window', {
    limit: 100,
    windowSizeInSeconds: 3600 // 1 hour
  })
});

// Sliding Window with IP-based limiting
const slidingWindowLimiter = rateLimitMiddleware({
  keyStrategy: RateLimitKeyStrategyFactory.create('ip'),
  algorithm: RateLimitAlgorithmFactory.create('sliding-window', {
    limit: 5,
    windowSizeInSeconds: 10
  })
});

// Apply to routes
app.use('/api', tokenBucketLimiter);
app.use('/api/premium', fixedWindowLimiter);
```

### Using Direct Instantiation (Alternative)

```javascript
const TokenBucketAlgorithm = require('./rate-limit/algorithms/TokenBucketAlgorithm');
const IpKeyStrategy = require('./rate-limit/strategies/IpKeyStrategy');

const rateLimiter = rateLimitMiddleware({
  keyStrategy: new IpKeyStrategy(),
  algorithm: new TokenBucketAlgorithm({
    capacity: 10,
    refillRate: 1
  })
});

app.use(rateLimiter);
```

---

## �🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- Docker installed (for Redis)

### Installation

**1. Clone & Install Dependencies**
```bash
git clone <your-repo>
cd rate-limit
npm install
```

**2. Start Redis Container**
```bash
# Start Redis on port 6379
docker run -d -p 6379:6379 --name redis-rate-limit redis:7

# Verify Redis is running
docker exec -it redis-rate-limit redis-cli ping
# Expected output: PONG
```

**3. Start the Server**
```bash
npm run dev
# Server runs on http://localhost:3000
```

---

## 🧪 Testing

### Basic Request Test
```bash
curl -i http://localhost:3000/test
```

**Expected Response (200 OK):**
```
HTTP/1.1 200 OK
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 9
X-RateLimit-Reset: 1706745600

{"message":"Success"}
```

### Burst Traffic Test
```bash
# Send 20 requests rapidly
for i in {1..20}; do curl -i http://localhost:3000/test; done
```

**Expected Behavior:**
- First 10 requests: `200 OK` ✅
- Remaining requests: `429 Too Many Requests` ❌

**Sample 429 Response:**
```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1706745660
Retry-After: 60

{"message":"Too many requests"}
```

### Monitoring Redis
```bash
# Watch Redis commands in real-time
docker exec -it redis-rate-limit redis-cli monitor

# Check stored keys
docker exec -it redis-rate-limit redis-cli KEYS "rate_limit:*"

# Inspect a specific key
docker exec -it redis-rate-limit redis-cli HGETALL "rate_limit:127.0.0.1"
```

## 🏗️ Production Considerations

### Scalability
- [ ] Redis Cluster for horizontal scaling
- [ ] Read replicas for GET-heavy workloads
- [ ] Consistent hashing for key distribution

### Reliability
- [ ] Redis Sentinel for automatic failover
- [ ] Circuit breaker for Redis downtime
- [ ] Fallback to local cache if Redis unavailable

### Monitoring
- [ ] Metrics: Rate limit hits, rejections, latency
- [ ] Alerts: High rejection rate, Redis latency
- [ ] Logging: Track rate-limited IPs/users

### Security
- [ ] IP allowlist for internal services
- [ ] Bot detection integration
- [ ] DDoS protection at CDN layer

---

## 🤝 Contributing

This project is for educational purposes. Feel free to:
- Add new algorithms (Leaky Bucket, Sliding Log)
- Improve Lua scripts
- Add unit tests
- Enhance documentation

---

## 📝 License

MIT License - Feel free to use this for learning and interviews!

---

## 💡 Tips for Interviews

1. **Start with requirements**: Clarify rate limit type, accuracy needs, scale
2. **Discuss trade-offs**: Simple vs accurate, fast vs distributed
3. **Draw diagrams**: Show data flow and component interactions
4. **Think about edge cases**: Redis down, clock skew, burst traffic
5. **Code incrementally**: Start with basic, then add features
6. **Test your solution**: Walk through examples with different scenarios

**Good luck with your LLD interviews! 🚀**
