# CLAUDE IMPLEMENTATION PROMPT - LIQUIDAITY AI TRADING PLATFORM

## MISSION: BUILD PRODUCTION-READY AI TRADING PLATFORM IN 8 WEEKS

You are Claude 3.5 Sonnet implementing the LiquidAIty AI-driven automated trading platform MVP. All BMAD documentation is complete. Your job is to BUILD the actual platform following the specifications exactly.

## CRITICAL: READ ALL DOCUMENTATION FIRST

**MANDATORY FILES TO REVIEW BEFORE CODING:**
1. `docs/business-analysis.md` - Business requirements and market analysis
2. `docs/product-requirements.md` - Product specifications and user stories  
3. `docs/winston-technical-architecture.md` - System architecture and tech stack
4. `docs/bob-sprint-planning.md` - Sprint breakdown and timeline
5. `docs/james-implementation-specs.md` - Technical implementation details
6. `docs/sally-ux-design.md` - UX/UI design specifications

## SPRINT 1 IMPLEMENTATION (WEEKS 1-2) - START HERE

### PHASE 1A: PROJECT SETUP (DAYS 1-3)
**DO THIS FIRST:**
1. **Initialize Frontend:** React + TypeScript + Vite + Tailwind CSS
2. **Initialize Backend:** Node.js + Express + TypeScript
3. **Setup Databases:** PostgreSQL + TimescaleDB + Redis
4. **Docker Environment:** Development containers
5. **Authentication:** Google OAuth2 + JWT + MFA (TOTP)

### PHASE 1B: MARKET DATA & CHARTS (DAYS 4-7)
**CRITICAL FEATURES:**
1. **Alpaca MCP Integration:** Real-time market data streaming
2. **TimescaleDB:** High-performance time series storage
3. **Flux Charts:** Professional TradingView-quality charting
4. **WebSocket:** Real-time data updates
5. **Symbol Search:** Auto-complete with popular symbols

### PHASE 1C: TRADING INTERFACE (DAYS 8-14)
**ESSENTIAL TRADING:**
1. **Order Entry:** Market, limit, stop orders with validation
2. **Portfolio Dashboard:** Positions, P&L, performance metrics
3. **Order Management:** History, cancellation, real-time updates
4. **Risk Controls:** Buying power checks, position limits

## TECHNOLOGY STACK (FOLLOW EXACTLY)

### Frontend
- **React 18** + TypeScript + Vite
- **Tailwind CSS** for styling
- **Zustand** for state management
- **Socket.IO** for real-time updates
- **Flux Charts** (TradingView licensed)

### Backend
- **Node.js 20** + Express + TypeScript
- **PostgreSQL 15** + TimescaleDB extension
- **Redis 7** for caching and sessions
- **Socket.IO** for WebSocket connections
- **Alpaca MCP** for broker integration

### Security (MANDATORY)
- **AES-256-GCM** encryption for sensitive data
- **Zod** schemas for input validation
- **JWT** with refresh tokens
- **MFA** (TOTP) required
- **Rate limiting** on all endpoints

## DATABASE SCHEMAS (USE EXACTLY AS SPECIFIED)

### PostgreSQL Tables
```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    oauth_provider VARCHAR(50) NOT NULL,
    oauth_id VARCHAR(255) NOT NULL,
    encrypted_alpaca_key TEXT,
    encrypted_alpaca_secret TEXT,
    mfa_secret TEXT,
    mfa_enabled BOOLEAN DEFAULT FALSE,
    preferences JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    alpaca_order_id VARCHAR(255) UNIQUE,
    symbol VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL,
    order_type VARCHAR(20) NOT NULL,
    side VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    limit_price DECIMAL(12,4),
    stop_price DECIMAL(12,4),
    created_at TIMESTAMP DEFAULT NOW()
);
```

### TimescaleDB Hypertable
```sql
-- Market data hypertable
CREATE TABLE market_data (
    time TIMESTAMPTZ NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    timeframe VARCHAR(10) NOT NULL,
    open DECIMAL(12,4) NOT NULL,
    high DECIMAL(12,4) NOT NULL,
    low DECIMAL(12,4) NOT NULL,
    close DECIMAL(12,4) NOT NULL,
    volume BIGINT NOT NULL
);

SELECT create_hypertable('market_data', 'time');
```

## API ENDPOINTS (IMPLEMENT THESE EXACTLY)

### Authentication APIs
- `POST /api/v1/auth/oauth/google` - Google OAuth login
- `POST /api/v1/auth/mfa/setup` - MFA setup
- `POST /api/v1/auth/mfa/verify` - MFA verification
- `POST /api/v1/auth/refresh` - Token refresh

### Trading APIs
- `POST /api/v1/trading/orders` - Create order
- `GET /api/v1/trading/orders` - Get order history
- `DELETE /api/v1/trading/orders/:id` - Cancel order
- `GET /api/v1/trading/portfolio` - Get portfolio
- `GET /api/v1/trading/positions` - Get positions

### Chart Data APIs
- `GET /api/v1/charts/data/:symbol` - Get chart data
- `GET /api/v1/charts/symbols/search` - Symbol search
- `WebSocket /ws` - Real-time market updates

## UI/UX REQUIREMENTS (FOLLOW SALLY'S DESIGN)

### Design System
- **Colors:** Deep Navy (#1a1d29), Electric Blue (#00d4ff), Success Green (#00ff88)
- **Typography:** Inter (primary), JetBrains Mono (numbers)
- **Layout:** Professional trading interface (TradingView quality)

### Key Components
1. **Login Screen:** Google OAuth + MFA setup
2. **Main Dashboard:** 6-panel layout with charts, trading, portfolio
3. **Chart Container:** Flux Charts with timeframe selector
4. **Order Entry:** Quick buy/sell with validation
5. **Portfolio Dashboard:** P&L visualization and metrics

## PROJECT STRUCTURE (CREATE EXACTLY)

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/LoginForm.tsx
│   │   ├── charts/FluxChartWrapper.tsx
│   │   ├── trading/OrderEntry.tsx
│   │   └── portfolio/Dashboard.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useWebSocket.ts
│   │   └── useMarketData.ts
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── marketStore.ts
│   │   └── tradingStore.ts
│   └── services/
│       ├── api.ts
│       └── websocket.ts
```

### Backend Structure
```
backend/
├── src/
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── tradingController.ts
│   │   └── chartController.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── tradingService.ts
│   │   └── marketDataService.ts
│   ├── models/
│   │   ├── User.ts
│   │   └── Order.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── validation.ts
│   └── routes/
│       ├── auth.ts
│       ├── trading.ts
│       └── charts.ts
```

## ENVIRONMENT VARIABLES (REQUIRED)
```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/liquidaity
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-jwt-secret-256-bits
ENCRYPTION_KEY=your-encryption-key-256-bits
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret

# Trading
ALPACA_KEY=your-alpaca-api-key
ALPACA_SECRET=your-alpaca-secret-key
ALPACA_BASE_URL=https://paper-api.alpaca.markets

# Development
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

## SUCCESS CRITERIA (MUST ACHIEVE)

### Sprint 1 Deliverables
- [ ] User registers/logs in with Google OAuth + MFA
- [ ] Professional charts display real-time market data from Alpaca
- [ ] Symbol search and switching works smoothly
- [ ] User places market and limit orders successfully
- [ ] Portfolio shows current positions and P&L accurately
- [ ] All data persists in PostgreSQL/TimescaleDB
- [ ] WebSocket real-time updates function properly
- [ ] Mobile-responsive design works on all devices

## DEVELOPMENT RULES (FOLLOW STRICTLY)

1. **TypeScript Only:** No `any` types, strict mode enabled
2. **Test-Driven Development:** Write tests first, then code
3. **Error Handling:** Comprehensive try/catch and logging
4. **Security First:** Validate all inputs, encrypt sensitive data
5. **Performance:** Use caching, database indexes, connection pooling
6. **Code Quality:** ESLint + Prettier, meaningful names, JSDoc comments

## INTEGRATION PRIORITIES

### Phase 1 (Sprint 1)
1. **Alpaca MCP:** Market data and order execution
2. **Google OAuth:** User authentication
3. **Flux Charts:** Professional charting
4. **TimescaleDB:** Time series data storage

### Phase 2 (Sprint 2)
1. **OpenAI GPT-4:** Trade GPT AI advisor
2. **Claude API:** Custom indicator generation
3. **Pattern Detection:** YOLOv8 integration
4. **Advanced Analytics:** Risk analysis

## CRITICAL SUCCESS FACTORS

1. **User trades real stocks within 2 weeks**
2. **Financial data is 100% accurate and secure**
3. **Real-time updates are reliable and fast (<200ms)**
4. **UI rivals professional trading platforms**
5. **Enterprise-grade security protects user data**

## DEPLOYMENT TARGET
- **Development:** Docker containers locally
- **Production:** Oracle Cloud Free Tier
- **CI/CD:** GitHub Actions with automated testing

## START COMMAND FOR CLAUDE

**Copy and paste this exact command:**

```
I am Claude 3.5 Sonnet implementing the LiquidAIty AI trading platform. I have read all documentation in the docs/ folder. I will now start Sprint 1 implementation by:

1. Creating the project structure with React + TypeScript frontend and Node.js + Express backend
2. Setting up PostgreSQL + TimescaleDB + Redis databases
3. Implementing Google OAuth2 authentication with MFA
4. Integrating Alpaca MCP for real-time market data
5. Building professional Flux Charts integration
6. Creating order entry and portfolio management

I will follow the specifications exactly, use TypeScript strictly, implement comprehensive security, and ensure the user can trade real stocks within 2 weeks. Starting with project initialization now.
```

**FOUNDATION MODEL:** Claude 3.5 Sonnet (200K context, superior code generation)
**TIMELINE:** 8 weeks (4 sprints of 2 weeks each)
**GOAL:** Production-ready AI trading platform MVP

## NEXT STEPS AFTER SPRINT 1
- Sprint 2: AI integration (Trade GPT, custom indicators)
- Sprint 3: Advanced features (pattern detection, multi-agent)
- Sprint 4: Polish, testing, production deployment

**BUILD THE FUTURE OF AI TRADING - START NOW!** 🚀
