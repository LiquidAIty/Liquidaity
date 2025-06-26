# LiquidAIty

**Intelligent, Modular, Agentic AI-Powered Trading Platform**

---

## 🚀 Project Overview

LiquidAIty is a next-generation, AI-driven trading platform that empowers retail and professional traders with tools traditionally reserved for elite hedge funds. The platform integrates real-time market data, pattern recognition, probabilistic forecasting, and AI agents to execute highly optimized trading decisions.

---

## 🌐 Key Features

- **Multi-Agent Orchestration** – Master + sub-agents for strategy, math modeling, and portfolio management
- **LLM Integration** – TLOB, Gemini, Claude for multi-perspective verification and dynamic prompt workflows
- **Chart Pattern Detection** – YOLOv8 trained on financial candlestick patterns
- **Probabilistic AI Forecasting** – Time Series Transformers, Reservoir Computing, and NeuralProphet
- **MCP Server Integration** – NLP-driven strategy creation with Alpaca Paper Trading and execution
- **Alt Data Pipelines** – NOAA weather, SEC filings, Google Trends, satellite analysis
- **Live & Auto-Trading Support** – Pipelines sync forecasts and trade triggers to execution layer

---

## 📦 Project Structure (Nx + Custom)

```
/apps/
  ├─ models/             # AI agents & prediction models
  ├─ agents/             # Agentic orchestration (TLOB, portfolio)
  └─ mcp-server/         # UI & NLP trade interface layer

/code_sources/          # External projects
  ├─ ai-hedge-fund/
  ├─ reservoir-computing/
  ├─ nautilus_trader/
  ├─ options-wheel/
  └─ quantconnect_lean/

/libs/
  └─ common/             # Shared utils
```

---

## 📊 AI Models Used

| Model                | Purpose                                  |
| -------------------- | ---------------------------------------- |
| TLOB                 | Hybrid LLM + mathematical optimizer      |
| YOLOv8               | Candlestick pattern recognition          |
| NeuralProphet        | Seasonal + trend + regressor prediction  |
| PatchTST, Autoformer | Long-term time series forecasting        |
| Reservoir + XGBoost  | Chaos-aware ensemble learning            |
| EvoTorch             | Evolutionary hyperparameter optimization |

---

## 🧠 AI Agent Architecture

- **Master Agent** → Strategy + Meta decisions
- **Market Agent** → YOLOv8-based pattern detection
- **Forecast Agents** → TST, ESN, NeuralProphet, XGBoost
- **Portfolio Agent** → TLOB optimizer, signal aggregation

---

## 🔁 Daily Pipeline Flow

1. MCP triggers data ingest
2. YOLOv8 scans chart patterns
3. Forecast agents generate signals
4. TLOB and EvoTorch optimize strategy
5. Prisma DB is updated
6. Dashboard renders trade sheet

---

## 📈 Supported Strategies

- **Options Wheel** – Covered call selling + put buying
- **Forex Grid Trading** – 20 Pip Challenge + Elliott Wave + Liquidity traps
- **Penny Stock Long-Terms** – SEC+Sentiment+Momentum
- **Ag Futures** – Weather + seasonal yield forecasting

---

## 🔗 Key Repositories (cloned into `/code_sources/`)

- [https://github.com/alpacahq/alpaca-mcp-server](https://github.com/alpacahq/alpaca-mcp-server)
- [https://github.com/foduucom/stockmarket-pattern-detection-yolov8](https://github.com/foduucom/stockmarket-pattern-detection-yolov8)
- [https://github.com/nautechsystems/nautilus_trader](https://github.com/nautechsystems/nautilus_trader)
- [https://github.com/alpacahq/options-wheel](https://github.com/alpacahq/options-wheel)
- [https://github.com/hogarthww-labs/time-series-classification-and-clustering-with-Reservoir-Computing](https://github.com/hogarthww-labs/time-series-classification-and-clustering-with-Reservoir-Computing)
- [https://github.com/foduucom/stockmarket-future-prediction](https://github.com/foduucom/stockmarket-future-prediction)

---

## 🧪 Dev & Run Instructions

1. `pnpm install`
2. `npx prisma db seed`
3. `nx serve api` & `nx run client:serve`
4. Configure `.env` with Alpaca/Alpha Vantage keys
5. Trigger daily run via MCP or schedule via cron

---

## 👤 Author

Created by [LiquidAIty LLC](https://github.com/LiquidAIty)

Lead Dev: \[Gizmo / Jeremiah] — AI x Markets x Systems Engineering

---

## 💰 Investor Readiness

- ✅ MVP flow built
- ✅ Real models running (YOLO, TLOB, Reservoir, etc.)
- ✅ Git repo structured for collaboration
- ✅ Agent system supports future growth
- ✅ ReadMe + Roadmap (Canvas link shared)
