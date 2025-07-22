# LiquidAIty Technical Implementation Specifications

**Document:** Technical Implementation Specifications  
**Lead Developer:** James (BMAD Lead Developer)  
**Date:** July 2025  
**Version:** 1.0  
**Status:** Draft for Review  

## Implementation Overview

### Development Approach
**Agile Development with Test-Driven Development (TDD)**

This document provides detailed technical implementation specifications for the LiquidAIty MVP, focusing on code structure, API designs, database schemas, and development best practices.

### Technology Stack Implementation
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Node.js 20 + Express.js + TypeScript
- **Database:** PostgreSQL 15 + TimescaleDB + Redis 7
- **AI Integration:** OpenAI GPT-4 + Claude 3.5 + HuggingFace Models
- **Real-time:** Socket.IO + WebSocket
- **Testing:** Jest + Testing Library + Playwright + Supertest

## Project Structure & Code Organization

### Frontend Code Structure
```
src/
├── components/                 # Reusable UI components
│   ├── charts/
│   │   ├── FluxChartWrapper.tsx
│   │   ├── SymbolSearch.tsx
│   │   ├── TimeframeSelector.tsx
│   │   └── ChartControls.tsx
│   ├── trading/
│   │   ├── OrderEntry.tsx
│   │   ├── PositionManager.tsx
│   │   ├── PortfolioDashboard.tsx
│   │   └── OrderHistory.tsx
│   ├── ai/
│   │   ├── TradeGPTChat.tsx
│   │   ├── IndicatorBuilder.tsx
│   │   ├── AgentProfiles.tsx
│   │   └── PatternDetector.tsx
│   └── common/
│       ├── Layout.tsx
│       ├── Navigation.tsx
│       ├── ErrorBoundary.tsx
│       └── Modal.tsx
├── hooks/                      # Custom React hooks
│   ├── useWebSocket.ts
│   ├── useMarketData.ts
│   ├── useAIChat.ts
│   ├── useAuth.ts
│   └── useOrders.ts
├── stores/                     # Zustand state management
│   ├── marketStore.ts
│   ├── tradingStore.ts
│   ├── userStore.ts
│   └── aiStore.ts
├── services/                   # API service layer
│   ├── api.ts
│   ├── websocket.ts
│   ├── auth.ts
│   └── trading.ts
└── utils/                      # Utility functions
    ├── formatters.ts
    ├── validators.ts
    ├── constants.ts
    └── types.ts
```

### Backend Code Structure
```
src/
├── controllers/                # Request handlers
│   ├── authController.ts
│   ├── tradingController.ts
│   ├── chartController.ts
│   └── aiController.ts
├── services/                   # Business logic layer
│   ├── authService.ts
│   ├── tradingService.ts
│   ├── marketDataService.ts
│   └── aiService.ts
├── models/                     # Database models
│   ├── User.ts
│   ├── Order.ts
│   ├── Position.ts
│   └── MarketData.ts
├── middleware/                 # Express middleware
│   ├── auth.ts
│   ├── validation.ts
│   ├── rateLimiting.ts
│   └── errorHandler.ts
├── routes/                     # API route definitions
│   ├── auth.ts
│   ├── trading.ts
│   ├── charts.ts
│   └── ai.ts
├── config/                     # Configuration files
│   ├── database.ts
│   ├── redis.ts
│   ├── websocket.ts
│   └── environment.ts
└── websocket/                  # WebSocket handlers
    ├── marketDataHandler.ts
    ├── orderUpdateHandler.ts
    └── connectionManager.ts
```

## Database Implementation

### PostgreSQL Schema Design

#### Users Table
```sql
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
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_oauth ON users(oauth_provider, oauth_id);
```

#### Orders Table
```sql
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    alpaca_order_id VARCHAR(255) UNIQUE,
    symbol VARCHAR(10) NOT NULL,
    quantity INTEGER NOT NULL,
    order_type VARCHAR(20) NOT NULL,
    side VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    limit_price DECIMAL(12,4),
    stop_price DECIMAL(12,4),
    filled_qty INTEGER DEFAULT 0,
    filled_avg_price DECIMAL(12,4),
    commission DECIMAL(8,4) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    filled_at TIMESTAMP
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_symbol ON orders(symbol);
CREATE INDEX idx_orders_status ON orders(status);
```

### TimescaleDB Schema Design

#### Market Data Hypertable
```sql
CREATE TABLE market_data (
    time TIMESTAMPTZ NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    timeframe VARCHAR(10) NOT NULL,
    open DECIMAL(12,4) NOT NULL,
    high DECIMAL(12,4) NOT NULL,
    low DECIMAL(12,4) NOT NULL,
    close DECIMAL(12,4) NOT NULL,
    volume BIGINT NOT NULL,
    vwap DECIMAL(12,4),
    trade_count INTEGER
);

-- Create hypertable with 1-day chunks
SELECT create_hypertable('market_data', 'time', chunk_time_interval => INTERVAL '1 day');

-- Create indexes for efficient queries
CREATE INDEX idx_market_data_symbol_time ON market_data (symbol, time DESC);
CREATE INDEX idx_market_data_timeframe ON market_data (timeframe, symbol, time DESC);

-- Set up compression policy
ALTER TABLE market_data SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'symbol, timeframe'
);

SELECT add_compression_policy('market_data', INTERVAL '7 days');
SELECT add_retention_policy('market_data', INTERVAL '2 years');
```

## API Implementation Specifications

### Authentication API

#### POST /api/v1/auth/oauth/google
```typescript
interface GoogleOAuthRequest {
  code: string;
  state: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    mfaEnabled: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export const googleOAuth = async (req: Request, res: Response) => {
  try {
    const { code, state } = req.body as GoogleOAuthRequest;
    
    // Validate state parameter
    if (!validateOAuthState(state)) {
      return res.status(400).json({ error: 'Invalid state parameter' });
    }
    
    // Exchange code for tokens
    const googleTokens = await exchangeCodeForTokens(code);
    const userInfo = await fetchGoogleUserInfo(googleTokens.access_token);
    
    // Find or create user
    let user = await User.findOne({ 
      oauth_provider: 'google', 
      oauth_id: userInfo.id 
    });
    
    if (!user) {
      user = await User.create({
        email: userInfo.email,
        oauth_provider: 'google',
        oauth_id: userInfo.id
      });
    }
    
    // Generate JWT tokens
    const tokens = generateJWTTokens(user.id);
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        mfaEnabled: user.mfa_enabled
      },
      tokens
    });
  } catch (error) {
    logger.error('Google OAuth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};
```

### Trading API

#### POST /api/v1/trading/orders
```typescript
interface CreateOrderRequest {
  symbol: string;
  quantity: number;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop' | 'stop_limit';
  limitPrice?: number;
  stopPrice?: number;
}

export const createOrder = async (req: Request, res: Response) => {
  try {
    const orderData = req.body as CreateOrderRequest;
    const userId = req.user.id;
    
    // Validate order data
    const validation = validateOrderRequest(orderData);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }
    
    // Get user's Alpaca credentials
    const user = await User.findById(userId);
    const alpacaKey = decrypt(user.encrypted_alpaca_key);
    const alpacaSecret = decrypt(user.encrypted_alpaca_secret);
    
    // Initialize Alpaca client
    const alpaca = new AlpacaApi({
      key: alpacaKey,
      secret: alpacaSecret,
      paper: process.env.NODE_ENV !== 'production'
    });
    
    // Submit order to Alpaca
    const alpacaOrder = await alpaca.createOrder({
      symbol: orderData.symbol,
      qty: orderData.quantity,
      side: orderData.side,
      type: orderData.type,
      limit_price: orderData.limitPrice,
      stop_price: orderData.stopPrice
    });
    
    // Save order to database
    const order = await Order.create({
      user_id: userId,
      alpaca_order_id: alpacaOrder.id,
      symbol: orderData.symbol,
      quantity: orderData.quantity,
      side: orderData.side,
      order_type: orderData.type,
      limit_price: orderData.limitPrice,
      stop_price: orderData.stopPrice,
      status: alpacaOrder.status
    });
    
    // Emit real-time update
    io.to(`user:${userId}`).emit('orderUpdate', {
      orderId: order.id,
      status: order.status,
      timestamp: new Date()
    });
    
    res.status(201).json({
      id: order.id,
      alpacaOrderId: alpacaOrder.id,
      symbol: order.symbol,
      quantity: order.quantity,
      side: order.side,
      type: order.order_type,
      status: order.status,
      createdAt: order.created_at
    });
  } catch (error) {
    logger.error('Create order error:', error);
    res.status(500).json({ error: 'Order creation failed' });
  }
};
```

### Chart Data API

#### GET /api/v1/charts/data/:symbol
```typescript
interface ChartDataRequest {
  symbol: string;
  timeframe: '1min' | '5min' | '15min' | '1hour' | '1day';
  limit?: number;
}

export const getChartData = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;
    const { timeframe = '1min', limit = 1000 } = req.query as ChartDataRequest;
    
    // Check cache first
    const cacheKey = `chart:${symbol}:${timeframe}:${limit}`;
    const cachedData = await redis.get(cacheKey);
    
    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }
    
    // Query TimescaleDB
    const query = `
      SELECT 
        time, open, high, low, close, volume
      FROM market_data
      WHERE symbol = $1 AND timeframe = $2
      ORDER BY time DESC 
      LIMIT $3
    `;
    
    const result = await db.query(query, [symbol.toUpperCase(), timeframe, limit]);
    
    const chartData = {
      symbol: symbol.toUpperCase(),
      timeframe,
      data: result.rows.map(row => ({
        time: row.time.toISOString(),
        open: parseFloat(row.open),
        high: parseFloat(row.high),
        low: parseFloat(row.low),
        close: parseFloat(row.close),
        volume: parseInt(row.volume)
      })).reverse()
    };
    
    // Cache for 1 minute
    await redis.setex(cacheKey, 60, JSON.stringify(chartData));
    
    res.json(chartData);
  } catch (error) {
    logger.error('Get chart data error:', error);
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
};
```

### AI Integration API

#### POST /api/v1/ai/chat
```typescript
interface AIChatRequest {
  message: string;
  context?: {
    symbol?: string;
    timeframe?: string;
  };
}

export const aiChat = async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body as AIChatRequest;
    const userId = req.user.id;
    
    // Build context for AI
    const systemPrompt = `
      You are Trade GPT, an expert AI trading advisor.
      Current Context: Symbol: ${context?.symbol || 'N/A'}
      Provide actionable trading insights with risk assessment.
    `;
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.7,
      max_tokens: 500
    });
    
    const aiResponse = completion.choices[0].message.content;
    
    res.json({
      response: aiResponse,
      confidence: 0.85,
      timestamp: new Date()
    });
  } catch (error) {
    logger.error('AI chat error:', error);
    res.status(500).json({ error: 'AI chat failed' });
  }
};
```

## WebSocket Implementation

### Connection Management
```typescript
class WebSocketManager {
  private connections: Map<string, any> = new Map();
  
  handleConnection(socket: Socket) {
    // Authenticate connection
    socket.on('authenticate', async (token: string) => {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const userId = decoded.userId;
        
        this.connections.set(socket.id, { userId, socketId: socket.id });
        socket.join(`user:${userId}`);
        socket.emit('authenticated', { userId });
      } catch (error) {
        socket.emit('authError', { error: 'Invalid token' });
        socket.disconnect();
      }
    });
    
    // Handle market data subscriptions
    socket.on('subscribe', (data: { type: string; symbol?: string }) => {
      const subscription = `${data.type}:${data.symbol || 'all'}`;
      socket.join(subscription);
    });
    
    socket.on('disconnect', () => {
      this.connections.delete(socket.id);
    });
  }
  
  broadcastMarketUpdate(symbol: string, data: any) {
    io.to(`market:${symbol}`).emit('marketUpdate', { symbol, ...data });
  }
  
  broadcastOrderUpdate(userId: string, orderUpdate: any) {
    io.to(`user:${userId}`).emit('orderUpdate', orderUpdate);
  }
}
```

## Testing Strategy

### Unit Testing
```typescript
// Example: Order validation test
describe('Order Validation', () => {
  test('should validate market order', () => {
    const order = {
      symbol: 'AAPL',
      quantity: 100,
      side: 'buy',
      type: 'market'
    };
    
    const result = validateOrderRequest(order);
    expect(result.isValid).toBe(true);
  });
  
  test('should reject invalid symbol', () => {
    const order = {
      symbol: 'INVALID',
      quantity: 100,
      side: 'buy',
      type: 'market'
    };
    
    const result = validateOrderRequest(order);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('Invalid symbol');
  });
});
```

### Integration Testing
```typescript
// Example: API integration test
describe('Trading API', () => {
  test('POST /api/v1/trading/orders', async () => {
    const orderData = {
      symbol: 'AAPL',
      quantity: 1,
      side: 'buy',
      type: 'market'
    };
    
    const response = await request(app)
      .post('/api/v1/trading/orders')
      .set('Authorization', `Bearer ${authToken}`)
      .send(orderData)
      .expect(201);
    
    expect(response.body).toHaveProperty('id');
    expect(response.body.symbol).toBe('AAPL');
  });
});
```

## Security Implementation

### Input Validation
```typescript
import { z } from 'zod';

const CreateOrderSchema = z.object({
  symbol: z.string().min(1).max(10).regex(/^[A-Z]+$/),
  quantity: z.number().int().positive().max(10000),
  side: z.enum(['buy', 'sell']),
  type: z.enum(['market', 'limit', 'stop', 'stop_limit']),
  limitPrice: z.number().positive().optional(),
  stopPrice: z.number().positive().optional()
});

export const validateOrderRequest = (data: any) => {
  try {
    CreateOrderSchema.parse(data);
    return { isValid: true };
  } catch (error) {
    return { 
      isValid: false, 
      error: error.errors.map(e => e.message).join(', ')
    };
  }
};
```

### Encryption Utilities
```typescript
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const ALGORITHM = 'aes-256-gcm';

export const encrypt = (text: string): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher(ALGORITHM, ENCRYPTION_KEY);
  cipher.setAAD(Buffer.from('liquidaity'));
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

export const decrypt = (encryptedData: string): string => {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipher(ALGORITHM, ENCRYPTION_KEY);
  decipher.setAAD(Buffer.from('liquidaity'));
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};
```

## Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint + Prettier configuration
- Use meaningful variable and function names
- Write comprehensive JSDoc comments
- Implement proper error handling

### Git Workflow
- Feature branches from main
- Pull request reviews required
- Automated testing in CI/CD
- Semantic commit messages

### Performance Optimization
- Implement caching strategies
- Use database indexes effectively
- Optimize API response times
- Monitor and profile performance

**James's Implementation Specifications: COMPLETE** ✅
