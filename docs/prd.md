# LiquidAIty: Product Requirements Document (PRD)

**Version:** 1.0  
**Date:** 2025-07-20  
**Product Manager:** John  
**Status:** Draft  

---

## 1. Executive Summary

LiquidAIty is an AI-driven trading platform serving sophisticated traders ("Technicians") with a professional-grade interface to orchestrate diverse signal sources, AI swarms, and mathematical algorithms. This PRD defines Phase 1: Minimum Buildable Foundation (MBF) - a production-grade platform that validates core functionality and establishes technical foundation for future phases.

**Phase 1 Goal:** Create a unified hub for AI and quantitative signals with professional UI, secure authentication, and real-time data integration.

---

## 2. Product Vision & Strategy

### 2.1 Problem Statement
- **Fragmented Tools:** Traders use disjointed tools for charting, execution, and analysis
- **Signal Isolation:** No unified hub for diverse AI and quantitative signals  
- **Manual Analysis:** Inability to blend qualitative LLM analysis with quantitative data
- **No Evolution:** Absence of systematic strategy optimization with feedback loops

### 2.2 Solution Overview
**The Pro-Trader's Workbench:** A unified platform providing:
- Signal ingestion and analysis hub
- Real-time market data visualization  
- AI-powered analysis interface
- Professional trading dashboard experience

### 2.3 Success Metrics
- **User Activation:** 80% of registered users complete account connection
- **Engagement:** 60% DAU/MAU ratio among active users
- **Platform Health:** 99.5% API uptime, <200ms response times
- **Feedback Loop:** 40% of users submit feature feedback within 30 days

---

## 3. Target Users & Personas

### 3.1 Primary: "The Technician" (Pro-Trader)
- **Profile:** Tech-savvy, data-driven, experienced trader
- **Needs:** Control, transparency, powerful integrated toolset
- **Pain Points:** Managing multiple disconnected tools
- **Success Criteria:** Can replace 2-3 existing tools with LiquidAIty

### 3.2 User Journey (Phase 1)
1. **Discovery:** Finds LiquidAIty through trading communities
2. **Registration:** Creates account with OAuth authentication
3. **Onboarding:** Connects broker account (Alpaca)
4. **Exploration:** Views dashboard, portfolio, and chart panels
5. **Signal Integration:** Tests signal ingestion endpoint
6. **Analysis:** Uses LLM analysis interface for market insights
7. **Feedback:** Provides feature requests and usage feedback

---

## 4. Phase 1 Feature Requirements

## Epic 1: Authentication & User Management

### 4.1 User Story
**As a** professional trader  
**I want to** securely authenticate and manage my account  
**So that** I can safely access my trading data and personalized features

### 4.2 Features
- **OAuth Authentication:** Support Google, GitHub, Discord
- **User Profile Management:** Basic profile settings and preferences
- **Session Management:** Secure JWT tokens with refresh capability
- **Account Security:** Password requirements, 2FA preparation

### 4.3 Acceptance Criteria
- [ ] User can register with OAuth providers
- [ ] User can log in/out securely
- [ ] Session persists across browser sessions
- [ ] User can update basic profile information
- [ ] All authentication endpoints return proper error messages

### 4.4 Technical Requirements
- Implement Passport.js with OAuth strategies
- JWT token management with secure storage
- User model in Prisma schema
- Rate limiting on auth endpoints

---

## Epic 2: Broker Integration & Data Pipeline

### 4.5 User Story
**As a** trader using Alpaca  
**I want to** connect my broker account safely  
**So that** I can view my portfolio and market data in real-time

### 4.6 Features
- **Alpaca Integration:** Connect using Alpaca MCP SDK
- **Portfolio Data:** Real-time portfolio positions and values
- **Market Data:** Live price feeds for connected assets
- **Data Security:** Client-side credential management

### 4.7 Acceptance Criteria
- [ ] User can connect Alpaca account with API keys
- [ ] Portfolio data displays accurately in real-time
- [ ] Market data updates without manual refresh
- [ ] Connection status clearly indicated in UI
- [ ] Error handling for API failures and rate limits

### 4.8 Technical Requirements
- Alpaca MCP SDK integration
- Real-time data pipeline with Socket.IO
- TimescaleDB for time-series market data storage
- Secure credential handling (client-side only)

---

## Epic 3: Trading Dashboard Interface

### 4.9 User Story
**As a** professional trader  
**I want** a unified dashboard with chart and portfolio panels  
**So that** I can monitor my positions and market conditions efficiently

### 4.10 Features
- **Fixed Layout Dashboard:** Chart panel and Portfolio panel
- **Chart Visualization:** Price charts with technical indicators
- **Portfolio Overview:** Positions, P&L, account balance
- **Responsive Design:** Optimized for desktop trading setups

### 4.11 Acceptance Criteria
- [ ] Dashboard loads within 2 seconds
- [ ] Chart displays price data with zoom/pan functionality
- [ ] Portfolio shows real-time position updates
- [ ] Layout remains stable during data updates
- [ ] Professional appearance matching trading app standards

### 4.12 Technical Requirements
- React components with Tailwind CSS styling
- ChartWrapper abstraction for charting library integration
- Real-time data binding with Socket.IO
- Responsive grid layout system

---

## Epic 4: Signal Ingestion System

### 4.13 User Story
**As a** trader using multiple signal sources  
**I want** a unified endpoint to receive trading signals  
**So that** I can aggregate and analyze signals from various AI and algorithmic sources

### 4.14 Features
- **Unified Signal Endpoint:** `/api/signals/ingest` for all signal types
- **Signal Validation:** Schema validation and data quality checks
- **Signal Storage:** Persistent storage with metadata
- **Signal Display:** Basic signal list and filtering

### 4.15 Acceptance Criteria
- [ ] API endpoint accepts signals in defined JSON schema
- [ ] Invalid signals return clear error messages
- [ ] Signals stored with timestamp and source metadata
- [ ] User can view recent signals in dashboard
- [ ] Signal ingestion rate supports 100+ signals/minute

### 4.16 Technical Requirements
- Express.js API endpoint with validation middleware
- Prisma schema for signal storage
- Rate limiting and authentication for signal sources
- Signal schema documentation

---

## Epic 5: AI Analysis Interface

### 4.17 User Story
**As a** trader seeking market insights  
**I want** to interact with AI for market analysis  
**So that** I can get qualitative analysis to complement my quantitative data

### 4.18 Features
- **LLM Chat Interface:** Basic chat interface for market questions
- **Context Awareness:** AI has access to user's portfolio and recent signals
- **Analysis History:** Save and review previous AI interactions
- **Response Quality:** Professional, actionable trading insights

### 4.19 Acceptance Criteria
- [ ] User can ask questions about market conditions
- [ ] AI responses include relevant portfolio context
- [ ] Chat history persists across sessions
- [ ] Response time under 5 seconds for typical queries
- [ ] AI provides disclaimers about trading advice

### 4.20 Technical Requirements
- Integration with LLM API (OpenAI/Anthropic)
- Context injection with portfolio and signal data
- Chat history storage in database
- Streaming response implementation

---

## Epic 6: User Feedback System

### 4.21 User Story
**As a** platform user  
**I want** to provide feedback and feature requests  
**So that** I can influence the platform's development direction

### 4.22 Features
- **Feedback Form:** In-app feedback submission
- **Feature Voting:** Vote on proposed features
- **Bug Reporting:** Structured bug report collection
- **Feedback Dashboard:** Admin view of all feedback

### 4.23 Acceptance Criteria
- [ ] User can submit feedback from any page
- [ ] Feedback includes user context and page information
- [ ] Users can vote on existing feature requests
- [ ] Admin can view and categorize all feedback
- [ ] Email notifications for critical bug reports

### 4.24 Technical Requirements
- Feedback API endpoints and database schema
- Admin dashboard for feedback management
- Email integration for notifications
- User voting system implementation

---

## 5. Technical Architecture

### 5.1 Technology Stack
- **Frontend:** React (Vite), Tailwind CSS, TypeScript
- **Backend:** Node.js, Express.js, TypeScript
- **Database:** PostgreSQL with TimescaleDB extension
- **ORM:** Prisma
- **Real-time:** Socket.IO
- **Authentication:** Passport.js with OAuth
- **Deployment:** Oracle Free Tier with NX Cloud CI/CD

### 5.2 System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │◄──►│  Express API    │◄──►│   PostgreSQL    │
│   (Port 4200)   │    │   (Port 3000)   │    │  + TimescaleDB  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│   Socket.IO     │◄─────────────┘
                        │  (Real-time)    │
                        └─────────────────┘
                                 │
                        ┌─────────────────┐
                        │  Alpaca API     │
                        │  (Market Data)  │
                        └─────────────────┘
```

### 5.3 Database Schema (Key Models)
```prisma
model User {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String?
  provider    String   // oauth provider
  providerId  String   // oauth provider id
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  signals     Signal[]
  feedback    Feedback[]
  brokerAccounts BrokerAccount[]
}

model Signal {
  id          String   @id @default(cuid())
  source      String   // signal source identifier
  symbol      String   // trading symbol
  action      String   // buy/sell/hold
  confidence  Float    // 0-1 confidence score
  metadata    Json?    // additional signal data
  timestamp   DateTime @default(now())
  userId      String
  
  // Relations
  user        User     @relation(fields: [userId], references: [id])
}

model BrokerAccount {
  id          String   @id @default(cuid())
  provider    String   // alpaca, etc
  apiKey      String   // encrypted
  isActive    Boolean  @default(true)
  userId      String
  
  // Relations
  user        User     @relation(fields: [userId], references: [id])
}
```

---

## 6. Success Criteria & Validation

### 6.1 Phase 1 Success Metrics
- **Technical:** All 6 epics completed with acceptance criteria met
- **User Experience:** Average task completion time <30 seconds
- **Performance:** Page load times <2 seconds, API responses <200ms
- **Reliability:** 99.5% uptime during beta testing period

### 6.2 User Validation Plan
1. **Alpha Testing:** Internal testing with 5 power users
2. **Beta Release:** Limited release to 25 professional traders
3. **Feedback Collection:** Weekly feedback sessions and usage analytics
4. **Iteration:** 2-week sprint cycles with user feedback integration

### 6.3 Go-Live Criteria
- [ ] All 6 epics completed and tested
- [ ] Security audit passed
- [ ] Performance benchmarks met
- [ ] User acceptance testing completed
- [ ] Production deployment successful

---

## 7. Constraints & Assumptions

### 7.1 Technical Constraints
- **Oracle Free Tier:** 2 OCPUs, 12GB RAM, 200GB storage limits
- **Development Team:** AI agents with human oversight
- **Timeline:** Phase 1 completion within 8-12 weeks

### 7.2 Business Assumptions
- **Market Demand:** Sufficient "Technician" early adopters exist
- **API Reliability:** Third-party APIs (Alpaca, LLM) maintain uptime
- **Regulatory:** Client-side credential model remains compliant
- **User Behavior:** Users willing to provide feedback for platform improvement

### 7.3 Risk Mitigation
- **Technical Risk:** Comprehensive testing and gradual rollout
- **User Adoption Risk:** Early user feedback and rapid iteration
- **Regulatory Risk:** Legal review of credential handling approach
- **Performance Risk:** Load testing and optimization before launch

---

## 8. Next Steps

### 8.1 Immediate Actions
1. **Epic Prioritization:** Confirm epic order with stakeholders
2. **Technical Setup:** Finalize database schema and API contracts
3. **Design System:** Create UI component library and style guide
4. **Development Planning:** Break epics into 2-week sprint stories

### 8.2 Phase 2 Preparation
- **User Research:** Gather feedback on automated trading interest
- **Technical Architecture:** Design for Capital Preservation Engine
- **Partnership Exploration:** Identify potential signal source integrations
- **Scaling Planning:** Prepare for increased user load and data volume

---

**Document Status:** Ready for stakeholder review and epic prioritization  
**Next Review:** Weekly PRD review meetings during development  
**Contact:** Product Manager John for questions and clarifications
