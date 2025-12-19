# 🚀 OPUS AI Crypto Trading Platform

<div align="center">

![OPUS Platform](https://img.shields.io/badge/OPUS-AI%20Trading-00F5D4?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.5.7-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-9.0-green?style=for-the-badge&logo=mongodb)

**Your Personal AI-Powered Multi-Chain Trading Assistant**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [API](#-api-reference)

</div>

---

## 📖 Overview

OPUS is a next-generation AI-powered cryptocurrency trading platform that enables users to:
- **Connect Multiple Web3 Wallets** (MetaMask, Phantom, Petra, Coinbase, Solflare)
- **Trade Across 9 Blockchains** (Ethereum, Polygon, Arbitrum, Optimism, BSC, Base, Solana, Aptos, Flow)
- **Create Custom AI Trading Agents** with automated strategies
- **Track Multi-Chain Portfolios** with real-time analytics
- **Execute AI-Generated Trade Proposals** with confidence scores

---

## ✨ Features

### 🦊 Multi-Wallet Support
- **MetaMask** - Ethereum & EVM chains
- **Phantom** - Solana, Ethereum, Polygon
- **Petra** - Aptos blockchain
- **Coinbase Wallet** - Multi-chain support
- **Solflare** - Solana ecosystem
- **WalletConnect** - Mobile wallet integration

### 🌐 9 Blockchain Networks
| Blockchain | Chain ID | Status |
|------------|----------|--------|
| Ethereum | 1 | ✅ Active |
| Polygon | 137 | ✅ Active |
| Arbitrum | 42161 | ✅ Active |
| Optimism | 10 | ✅ Active |
| BSC | 56 | ✅ Active |
| Base | 8453 | ✅ Active |
| Solana | mainnet-beta | ✅ Active |
| Aptos | mainnet | ✅ Active |
| Flow | mainnet | ✅ Active |

### 🤖 AI Trading Agents
- **4 Built-in Strategies:**
  - Trend Following
  - Mean Reversion
  - Arbitrage
  - Copy Trading
- **Customizable Parameters:**
  - Risk tolerance (stop-loss, take-profit)
  - Max trades per day
  - Gas price limits
  - Slippage tolerance
- **Performance Metrics:**
  - Win rate tracking
  - ROI calculation
  - Sharpe ratio
  - Max drawdown analysis

### 📊 Portfolio Management
- Real-time multi-chain tracking
- Asset allocation visualization
- PnL (Profit & Loss) calculations
- Historical performance data
- Risk score assessment

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ ([Download](https://nodejs.org))
- **MongoDB** ([Download](https://www.mongodb.com/try/download/community)) or MongoDB Atlas account
- **pnpm** (`npm install -g pnpm`)
- **Web3 Wallet** (MetaMask, Phantom, or Petra browser extension)

### Installation

```powershell
# 1. Clone the repository
git clone <your-repo-url>
cd OPUS-ai-crypto-Trade-

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
# Copy backend/.env.example to backend/.env
# Update JWT_SECRET and MONGODB_URI

# 4. Start MongoDB (Windows)
net start MongoDB

# 5. Run the platform
.\start.ps1
```

### Manual Start

```powershell
# Terminal 1: Backend
cd backend
$env:NODE_ENV="development"; ts-node server.ts

# Terminal 2: Frontend
pnpm dev
```

### Access Points
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **API Health:** http://localhost:3001/health

---

## 📚 Documentation

### Complete Guides
- **[BACKEND_SETUP.md](./BACKEND_SETUP.md)** - Detailed setup instructions with examples
- **[DOCUMENTATION.md](./DOCUMENTATION.md)** - Full technical documentation (500+ lines)
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Feature overview and statistics

### Quick Links
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Wallet Integration](#-wallet-integration)
- [AI Agent Configuration](#-ai-agent-configuration)

---

## 🔧 Configuration

### Backend Environment (`backend/.env`)

```bash
# Server
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/opus-trading

# Security
JWT_SECRET=your-super-secret-random-string-here

# CORS
CORS_ORIGIN=http://localhost:3000

# Optional: Blockchain RPCs
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
```

### Frontend Environment (`.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 🌐 API Reference

### Authentication

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

#### Login
```bash
POST /api/auth/login

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Get Profile
```bash
GET /api/auth/me
Authorization: Bearer YOUR_JWT_TOKEN
```

### Wallet Management

#### Connect Wallet
```bash
POST /api/wallet/connect
Authorization: Bearer TOKEN

{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "chain": "ethereum",
  "signature": "0x..."
}
```

#### List Wallets
```bash
GET /api/wallet/list
Authorization: Bearer TOKEN
```

#### Disconnect Wallet
```bash
DELETE /api/wallet/disconnect/:address
Authorization: Bearer TOKEN
```

### Trading

#### Get Trade History
```bash
GET /api/trading/history?limit=50&skip=0
Authorization: Bearer TOKEN
```

#### Place Order
```bash
POST /api/trading/order
Authorization: Bearer TOKEN

{
  "type": "swap",
  "fromToken": {
    "symbol": "USDC",
    "address": "0xA0b86...",
    "chain": "ethereum",
    "amount": 1000,
    "decimals": 6
  },
  "toToken": {
    "symbol": "WETH",
    "address": "0xC02a...",
    "chain": "ethereum",
    "amount": 0.5,
    "decimals": 18
  },
  "estimatedPrice": 2000
}
```

### AI Agents

#### Create Agent
```bash
POST /api/ai-agents
Authorization: Bearer TOKEN

{
  "name": "BTC Trend Follower",
  "config": {
    "strategy": "trend_following",
    "chains": ["ethereum", "polygon"],
    "tokens": [{
      "symbol": "WBTC",
      "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      "maxAllocation": 50,
      "minBalance": 0.01
    }],
    "tradingRules": {
      "maxTradesPerDay": 10,
      "minROI": 2.5,
      "maxRiskPerTrade": 5,
      "riskStopLoss": 3,
      "profitTakeProfit": 10
    },
    "execution": {
      "autoExecute": false,
      "maxGasPrice": 50,
      "slippageTolerance": 1
    }
  }
}
```

#### List Agents
```bash
GET /api/ai-agents
Authorization: Bearer TOKEN
```

#### Toggle Agent
```bash
POST /api/ai-agents/:id/toggle
Authorization: Bearer TOKEN
```

---

## 🗄️ Database Schema

### User Collection
```javascript
{
  email: String,
  passwordHash: String,
  fullName: String,
  walletAddresses: [{
    address: String,
    chain: String,
    isPrimary: Boolean,
    verified: Boolean
  }],
  preferences: {
    riskTolerance: "low" | "medium" | "high",
    tradingStyle: "conservative" | "balanced" | "aggressive"
  },
  subscription: {
    tier: "free" | "premium" | "pro",
    status: "active" | "inactive"
  }
}
```

### Trade Collection
```javascript
{
  userId: ObjectId,
  txHash: String,
  type: "buy" | "sell" | "swap",
  fromToken: { symbol, address, chain, amount },
  toToken: { symbol, address, chain, amount },
  status: "pending" | "confirmed" | "failed",
  pnl: Number,
  isAiGenerated: Boolean,
  timestamp: Date
}
```

### AIAgent Collection
```javascript
{
  userId: ObjectId,
  name: String,
  status: "active" | "inactive" | "paused",
  config: {
    strategy: String,
    chains: [String],
    tokens: [Object],
    tradingRules: Object
  },
  performance: {
    totalTrades: Number,
    winningTrades: Number,
    totalPnl: Number,
    roi: Number
  }
}
```

---

## 🎨 Tech Stack

### Frontend
- **Framework:** Next.js 15.5.7 (App Router)
- **Language:** TypeScript 5.9.3
- **Styling:** Tailwind CSS v4, Framer Motion
- **Web3:** ethers.js 6.16.0, @solana/web3.js, @aptos-labs/wallet-adapter
- **UI Components:** Radix UI, Recharts

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express 5.2.1
- **Database:** MongoDB (Mongoose 9.0.2)
- **Authentication:** JWT (jsonwebtoken 9.0.3)
- **Security:** bcryptjs, CORS

### DevOps
- **Package Manager:** pnpm
- **Dev Server:** nodemon, ts-node
- **Version Control:** Git, GitHub CLI
- **Deployment:** Vercel (frontend), Railway/Render (backend)

---

## 📁 Project Structure

```
opus-ai-crypto-trade/
├── app/                          # Next.js app router
│   ├── page.tsx                 # Landing page
│   ├── dashboard/               # Trading dashboard
│   └── globals.css              # Global styles
├── backend/                      # Express API server
│   ├── server.ts                # Entry point
│   ├── middleware/              # Auth middleware
│   ├── models/                  # Mongoose schemas
│   │   ├── User.model.ts
│   │   ├── Trade.model.ts
│   │   ├── Portfolio.model.ts
│   │   ├── AIAgent.model.ts
│   │   └── AIProposal.model.ts
│   └── routes/                  # API endpoints
│       ├── auth.routes.ts
│       ├── wallet.routes.ts
│       ├── trading.routes.ts
│       ├── portfolio.routes.ts
│       └── ai-agent.routes.ts
├── components/
│   ├── web3/                    # Wallet components
│   │   ├── wallet-connect-modal-enhanced.tsx
│   │   └── signature-modal.tsx
│   ├── dashboard/               # Dashboard components
│   └── ui/                      # Reusable UI components
├── lib/
│   ├── api/
│   │   └── client.ts            # API client wrapper
│   ├── web3/
│   │   ├── chain-config.ts      # Blockchain configurations
│   │   ├── wallet-providers-enhanced.ts
│   │   ├── context.tsx          # React context
│   │   └── types.ts
│   └── utils.ts
├── public/                       # Static assets
├── DOCUMENTATION.md              # Technical docs
├── BACKEND_SETUP.md              # Setup guide
├── IMPLEMENTATION_SUMMARY.md     # Feature summary
├── start.ps1                     # Quick start script
└── package.json
```

---

## 🔐 Security

- **JWT Authentication** with 2-hour token expiration
- **Bcrypt Password Hashing** (10 rounds)
- **CORS Protection** with configurable origins
- **Input Validation** on all endpoints
- **MongoDB Injection Prevention** via Mongoose
- **Wallet Signature Verification** for ownership proof

---

## 🚧 Roadmap

### Phase 1: Core Platform ✅ (Current)
- [x] Multi-wallet Web3 integration
- [x] Backend API with MongoDB
- [x] AI agent framework
- [x] Portfolio tracking
- [x] Authentication system

### Phase 2: Enhanced Trading 🔄
- [ ] Real-time price feeds (CoinGecko/CMC)
- [ ] DEX aggregator integration (1inch, Jupiter)
- [ ] Smart contract deployment
- [ ] Gas optimization
- [ ] Cross-chain bridging

### Phase 3: AI Intelligence 🔄
- [ ] ML-based market analysis
- [ ] Sentiment analysis
- [ ] Backtesting framework
- [ ] Advanced trading strategies
- [ ] Risk prediction models

### Phase 4: Production 📋
- [ ] Vercel deployment (frontend)
- [ ] Railway/Render deployment (backend)
- [ ] MongoDB Atlas setup
- [ ] CI/CD pipeline
- [ ] Monitoring & logging

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **ethers.js** - Ethereum library
- **Solana Web3.js** - Solana blockchain integration
- **Aptos Labs** - Aptos wallet adapters
- **Next.js** - React framework
- **MongoDB** - Database
- **Vercel** - Hosting platform

---

## 📞 Support

- **Documentation:** See [DOCUMENTATION.md](./DOCUMENTATION.md)
- **Setup Help:** See [BACKEND_SETUP.md](./BACKEND_SETUP.md)
- **Issues:** Open an issue on GitHub
- **Email:** support@opus-trading.com (example)

---

<div align="center">

**Built with ❤️ by the OPUS Team**

[⭐ Star this repo](https://github.com/your-username/opus-ai-crypto-trade) • [🐛 Report Bug](https://github.com/your-username/opus-ai-crypto-trade/issues) • [💡 Request Feature](https://github.com/your-username/opus-ai-crypto-trade/issues)

</div>
