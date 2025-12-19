# OPUS AI Trading Platform - Backend Setup Guide

## 🚀 Quick Start

This guide will help you set up and run the complete OPUS AI trading platform with Web3 wallet integration and backend API.

---

## 📋 Prerequisites

- **Node.js** 18+ installed
- **MongoDB** installed locally or MongoDB Atlas account
- **pnpm** package manager (`npm install -g pnpm`)
- **MetaMask, Phantom, or Petra wallet** browser extensions

---

## 🔧 Environment Setup

### 1. Create Backend Environment File

Create `backend/.env` in your project root:

```bash
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/opus-trading
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/opus-trading

# JWT Secret (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Blockchain RPC URLs (Optional - for enhanced features)
ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your-api-key
POLYGON_RPC_URL=https://polygon-mainnet.g.alchemy.com/v2/your-api-key
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
APTOS_RPC_URL=https://fullnode.mainnet.aptoslabs.com/v1
```

### 2. Create Frontend Environment File

Create `.env.local` in your project root:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## 📦 Installation

All dependencies are already installed. If you need to reinstall:

```powershell
# Install all dependencies
pnpm install
```

---

## 🗄️ Database Setup

### Option A: Local MongoDB

1. Install MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Start MongoDB service:
   ```powershell
   # Windows
   net start MongoDB
   ```

### Option B: MongoDB Atlas (Cloud)

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string and update `MONGODB_URI` in `backend/.env`

---

## 🏃 Running the Platform

### Method 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```powershell
cd backend
$env:NODE_ENV="development"; ts-node server.ts

# Or with auto-reload on changes:
nodemon --watch . --exec ts-node server.ts
```

**Terminal 2 - Frontend:**
```powershell
pnpm dev
```

### Method 2: Run Both Concurrently (Recommended)

First, install concurrently:
```powershell
pnpm add -D concurrently
```

Then add this script to `package.json`:
```json
"scripts": {
  "dev:all": "concurrently \"pnpm dev\" \"cd backend && nodemon --watch . --exec ts-node server.ts\"",
  "dev:backend": "cd backend && ts-node server.ts",
  "dev:frontend": "pnpm dev"
}
```

Run everything:
```powershell
pnpm dev:all
```

---

## 🌐 Access Points

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **Health Check:** http://localhost:3001/health

---

## 🔑 API Authentication Flow

### 1. Register a User

```bash
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "fullName": "John Doe"
}

# Response:
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "...",
      "email": "user@example.com",
      "fullName": "John Doe"
    }
  }
}
```

### 2. Login

```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}

# Response: (same as register)
```

### 3. Use Token for Protected Endpoints

```bash
GET http://localhost:3001/api/wallet/list
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

---

## 🦊 Wallet Integration

### Supported Wallets

1. **MetaMask** - Ethereum, Polygon, BSC, Arbitrum, Optimism, Base
2. **Phantom** - Solana, Ethereum, Polygon
3. **Petra** - Aptos
4. **Coinbase Wallet** - Multi-chain
5. **Solflare** - Solana
6. **WalletConnect** - Mobile wallets

### Real Chain IDs Configured

```javascript
Ethereum Mainnet: 1
Polygon: 137
Arbitrum One: 42161
Optimism: 10
BSC: 56
Base: 8453
Solana: mainnet-beta
Aptos: mainnet
```

### Connect Wallet Flow

1. Click "Connect Wallet" button
2. Select your preferred wallet (e.g., MetaMask)
3. Choose network (Ethereum, Polygon, etc.)
4. Approve connection in wallet extension
5. Sign message to verify ownership
6. Wallet connected to your account!

---

## 🤖 AI Trading Agents

### Create Your First Agent

**Via API:**
```bash
POST http://localhost:3001/api/ai-agents
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "BTC Trend Follower",
  "config": {
    "strategy": "trend_following",
    "chains": ["ethereum", "polygon"],
    "tokens": [
      {
        "symbol": "WBTC",
        "address": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
        "maxAllocation": 50,
        "minBalance": 0.01
      }
    ],
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

**Via Frontend:**
1. Navigate to Dashboard
2. Click "Create AI Agent"
3. Configure strategy, tokens, risk parameters
4. Click "Activate Agent"
5. Agent will generate trade proposals automatically!

---

## 📊 API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Wallet Management
- `POST /api/wallet/connect` - Connect wallet to account (protected)
- `GET /api/wallet/list` - List connected wallets (protected)
- `DELETE /api/wallet/disconnect/:address` - Disconnect wallet (protected)

### Trading
- `GET /api/trading/history` - Get trade history (protected)
- `POST /api/trading/order` - Place new trade order (protected)
- `GET /api/trading/proposals` - Get AI trade proposals (protected)
- `POST /api/trading/proposals/:id/execute` - Execute proposal (protected)

### Portfolio
- `GET /api/portfolio` - Get portfolio (protected, query: ?chain=ethereum)
- `POST /api/portfolio/update` - Update portfolio data (protected)

### AI Agents
- `GET /api/ai-agents` - List user's agents (protected)
- `POST /api/ai-agents` - Create new agent (protected)
- `PUT /api/ai-agents/:id` - Update agent (protected)
- `DELETE /api/ai-agents/:id` - Delete agent (protected)
- `POST /api/ai-agents/:id/toggle` - Start/stop agent (protected)

---

## 🎨 Theme & Animations

The platform features:
- **Beautiful gradient backgrounds** matching the hero section
- **Smooth animations** using Framer Motion
- **Mobile-responsive design** with custom scrollbars
- **Primary color:** `hsl(165 96% 71%)` (vibrant teal/cyan)
- **Dark theme** with subtle gradients

---

## 🔍 Testing the Integration

### 1. Test Backend Health

```bash
# PowerShell
Invoke-WebRequest -Uri "http://localhost:3001/health" | Select-Object -Expand Content
```

### 2. Test User Registration

```bash
# PowerShell
$body = @{
    email = "test@example.com"
    password = "Test123!@#"
    fullName = "Test User"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:3001/api/auth/register" `
  -Method POST `
  -Body $body `
  -ContentType "application/json" | Select-Object -Expand Content
```

### 3. Test Frontend Wallet Connection

1. Open http://localhost:3000
2. Click "Connect Wallet"
3. Choose MetaMask
4. Select Ethereum network
5. Check browser console for connection logs

---

## 🚨 Troubleshooting

### MongoDB Connection Failed
- **Error:** `MongoNetworkError: connect ECONNREFUSED`
- **Solution:** Ensure MongoDB is running (`net start MongoDB` on Windows)

### Port Already in Use
- **Error:** `EADDRINUSE: address already in use :::3001`
- **Solution:** Kill process using port:
  ```powershell
  # Find process
  netstat -ano | findstr :3001
  # Kill it (replace PID)
  taskkill /PID <PID> /F
  ```

### Wallet Not Connecting
- Ensure wallet extension is installed and unlocked
- Check browser console for errors
- Try refreshing the page
- Make sure you're on the correct network

### TypeScript Errors
```powershell
# Rebuild TypeScript definitions
pnpm add -D @types/node @types/express
```

---

## 📚 File Structure

```
opus-ai-crypto-trade/
├── app/                        # Next.js app directory
│   ├── page.tsx               # Landing page
│   └── dashboard/
│       └── page.tsx           # Trading dashboard
├── backend/                    # Express backend
│   ├── server.ts              # Main server file
│   ├── .env                   # Environment variables
│   ├── tsconfig.json          # TypeScript config
│   ├── middleware/
│   │   └── auth.middleware.ts # JWT authentication
│   ├── models/                # Mongoose schemas
│   │   ├── User.model.ts
│   │   ├── Trade.model.ts
│   │   ├── Portfolio.model.ts
│   │   ├── AIAgent.model.ts
│   │   └── AIProposal.model.ts
│   └── routes/                # API endpoints
│       ├── auth.routes.ts
│       ├── wallet.routes.ts
│       ├── trading.routes.ts
│       ├── portfolio.routes.ts
│       └── ai-agent.routes.ts
├── components/
│   ├── web3/
│   │   ├── wallet-connect-modal-enhanced.tsx
│   │   └── signature-modal.tsx
│   └── dashboard/
│       ├── ai-token-scanner.tsx
│       └── trade-proposal-modal.tsx
├── lib/
│   ├── api/
│   │   └── client.ts          # Frontend API client
│   └── web3/
│       ├── chain-config.ts    # Real chain IDs & RPCs
│       ├── context.tsx        # Web3 React context
│       ├── wallet-providers-enhanced.ts
│       └── types.ts
└── DOCUMENTATION.md            # Detailed technical docs
```

---

## 🎯 Next Steps

1. ✅ Backend API running
2. ✅ Frontend connected to backend
3. ✅ Real Web3 wallet integration
4. ✅ Beautiful UI with animations
5. 🔄 **Next:** Implement AI trading logic
6. 🔄 **Next:** Add real-time price feeds (CoinGecko/CoinMarketCap API)
7. 🔄 **Next:** Implement smart contract interactions
8. 🔄 **Next:** Deploy to production

---

## 🌟 Features Implemented

✅ JWT-based authentication
✅ MongoDB integration with Mongoose
✅ 5 complete API route modules
✅ 5 Mongoose models (User, Trade, Portfolio, AIAgent, AIProposal)
✅ Real blockchain network configurations (9 chains)
✅ Enhanced wallet providers with ethers.js
✅ Beautiful wallet connection modal with animations
✅ Theme colors matching hero section
✅ Mobile-responsive design
✅ Frontend API client with token management
✅ Protected routes with auth middleware

---

## 📞 Support

For issues or questions:
1. Check `DOCUMENTATION.md` for detailed architecture
2. Review backend logs in terminal
3. Check browser console for frontend errors
4. Verify environment variables are set correctly

---

**Happy Trading! 🚀📈**
