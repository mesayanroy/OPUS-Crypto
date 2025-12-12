# OPUS – Make your own trading agents deploy it on your system and start ur AI - crypto trading journey.
## Architecture & Documentation

**Version:** 1.0.0  
**Last Updated:** December 12, 2025  
**Platform:** Multi-Chain Decentralized Trading  
**License:** ISC

---

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture & Framework](#architecture--framework)
4. [Frontend API Documentation](#frontend-api-documentation)
5. [Web3 Integration](#web3-integration)
6. [AI Trading System](#ai-trading-system)
7. [Database Schema & Structure](#database-schema--structure)
8. [AI Agents Implementation](#ai-agents-implementation)
9. [CLI Execution & Local Agent Running](#cli-execution--local-agent-running)
10. [Future Development Roadmap](#future-development-roadmap)
11. [Environment Configuration](#environment-configuration)
12. [Deployment Guide](#deployment-guide)

---

## Overview

**OPUS** is a next-generation, non-custodial crypto trading platform powered by artificial intelligence. The platform enables users to:

- **Connect multiple Web3 wallets** across different blockchain networks
- **View real-time portfolio** with AI-powered insights and risk analysis
- **Generate AI trade proposals** using machine learning models
- **Execute trades safely** via EIP-712 signatures (non-custodial)
- **Copy successful traders** with customizable risk parameters
- **Monitor market activity** with AI-driven token scanning
- **Run autonomous AI agents** for 24/7 trading capabilities

**Key Features:**
- ✅ Multi-chain support (Ethereum, Solana, Polygon, Arbitrum, Optimism, BSC, Flow, Aptos)
- ✅ Non-custodial trading (user retains wallet control)
- ✅ Real-time portfolio tracking and analytics
- ✅ AI-powered token discovery and risk assessment
- ✅ Copy trading with top performers
- ✅ Autonomous AI agents for automated trading
- ✅ EIP-712 transaction signing for enhanced security
- ✅ Modern, responsive dashboard UI

---

## Technology Stack

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.6 | React framework with App Router |
| **React** | 19.2.0 | UI component library |
| **TypeScript** | Latest | Type-safe development |
| **Tailwind CSS** | v4 | Utility-first styling |
| **Radix UI** | Latest | Unstyled, accessible components |
| **Framer Motion** | Latest | Smooth animations & transitions |
| **React Hook Form** | 3.10.0 | Efficient form state management |
| **Recharts** | Latest | Data visualization & charts |

### Runtime & Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express.js** | 5.1.0 | REST API framework (future) |
| **TypeScript** | Latest | Type-safe backend code |

### Blockchain Integration
| Technology | Purpose |
|------------|---------|
| **Web3.js / Ethers.js** | Blockchain interaction |
| **Wallet Connect** | Multi-wallet connectivity |
| **MetaMask SDK** | Ethereum wallet integration |
| **EIP-712** | Typed transaction signing |

### Database & Storage
| Technology | Purpose |
|------------|---------|
| **MongoDB** | User data, portfolio history, trade logs |
| **Mongoose ODM** | Schema-based MongoDB interaction |
| **Redis** (future) | Caching & real-time data |

### Development & Deployment
| Tool | Purpose |
|-----|---------|
| **pnpm** | Fast package manager |
| **ESLint** | Code quality & linting |
| **Git** | Version control |
| **Vercel** | Frontend hosting |

---

## Architecture & Framework

### System Architecture ->

```
┌─────────────────────────────────────────────────────┐
│           OPUS Frontend (Next.js 15)                │
│    ┌─────────────────────────────────────────┐    │
│    │      React 19 Components & Hooks        │    │
│    │  - Dashboard, Portfolio, Trading Views  │    │
│    └─────────────────────────────────────────┘    │
└─────────────────────┬───────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
┌───────▼────────────┐    ┌────────▼─────────┐
│   Web3 Context     │    │  AI Agent SDK    │
│  (Wallet Mgmt)     │    │  (Trade Logic)   │
└───────┬────────────┘    └────────┬─────────┘
        │                          │
        └──────────────┬───────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
┌───────▼────────────────┐  ┌────────▼──────────┐
│  Blockchain Networks   │  │  Backend API      │
│  (Multichn)           │  │  (Node.js/Express)│
│  - Ethereum           │  │  - User Auth      │
│  - Solana             │  │  - Trade History  │
│  - Polygon, etc.      │  │  - Portfolio Mgmt │
└───────┬────────────────┘  └────────┬──────────┘
        │                            │
        └────────────┬───────────────┘
                     │
        ┌────────────▼──────────────┐
        │    MongoDB Database       │
        │  - User Profiles          │
        │  - Trade Records          │
        │  - Portfolio Snapshots    │
        │  - AI Agent Configurations│
        └───────────────────────────┘
```

### Project Directory Structure

```
OPUS-ai-crypto-Trade/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with theme
│   ├── page.tsx                 # Landing page
│   ├── app/page.tsx             # Trading dashboard
│   └── dashboard/page.tsx       # Portfolio & analytics
│
├── components/                   # React Components
│   ├── app/                     # Main app views
│   │   ├── dashboard.tsx        # Dashboard shell
│   │   ├── sidebar.tsx          # Navigation & wallet
│   │   ├── portfolio.tsx        # Portfolio tracker
│   │   ├── trading.tsx          # Trading interface
│   │   └── activity.tsx         # Activity feed
│   │
│   ├── dashboard/               # Dashboard widgets
│   │   ├── dashboard-header.tsx
│   │   ├── portfolio-tracker.tsx
│   │   ├── ai-token-scanner.tsx
│   │   ├── trade-proposal-modal.tsx
│   │   ├── eip712-signature-modal.tsx
│   │   ├── copy-trading-section.tsx
│   │   └── activity-panel.tsx
│   │
│   ├── web3/                    # Web3 integration
│   │   ├── wallet-connect-modal.tsx
│   │   └── signature-modal.tsx
│   │
│   ├── bento/                   # Marketing components
│   │   ├── ai-code-reviews.tsx
│   │   ├── parallel-agents.tsx
│   │   └── [other sections]
│   │
│   └── ui/                      # Base UI components
│       ├── button.tsx
│       ├── sheet.tsx
│       └── [other primitives]
│
├── lib/                          # Utility libraries
│   ├── utils.ts                 # Helper functions
│   └── web3/                    # Web3 utilities
│       ├── context.tsx          # Web3 provider context
│       ├── types.ts             # Type definitions
│       └── contracts.ts         # Contract interactions
│
├── public/                       # Static assets
│   └── images/
│       ├── avatars/
│       └── mcp-integrations/
│
├── styles/                       # Global styles
│   └── globals.css
│
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.mjs              # Next.js config
├── tailwind.config.js           # Tailwind config
└── DOCUMENTATION.md             # This file
```

---

## Frontend API Documentation

### Web3 Context API

The Web3 Context provides centralized state management for blockchain interactions.

#### **Web3Provider Component**

```typescript
import { Web3Provider } from "@/lib/web3/context"

// Wrap your app with Web3Provider
export default function App() {
  return (
    <Web3Provider>
      <YourApp />
    </Web3Provider>
  )
}
```

#### **useWeb3 Hook**

Access Web3 context within any component:

```typescript
import { useWeb3 } from "@/lib/web3/context"

export function MyComponent() {
  const {
    wallet,           // ConnectedWallet | null
    isConnecting,     // boolean
    isConnected,      // boolean
    connectWallet,    // (type: WalletType) => Promise<boolean>
    disconnectWallet, // () => void
    switchChain,      // (chain: ChainType) => Promise<boolean>
    tokens,           // Token[]
    totalValue,       // number
    totalPnl,         // number
    refreshPortfolio, // () => Promise<void>
    orders,           // TradeOrder[]
    placeOrder,       // (order) => Promise<string>
    activityLog,      // ActivityLog[]
    showWalletModal,  // boolean
    setShowWalletModal // (show: boolean) => void
  } = useWeb3()

  return (
    <div>
      {isConnected ? (
        <p>Connected: {wallet?.address}</p>
      ) : (
        <button onClick={() => connectWallet("metamask")}>
          Connect Wallet
        </button>
      )}
    </div>
  )
}
```

### Wallet Management API

#### **Connect Wallet**

```typescript
// Supported wallet types
type WalletType = 
  | "metamask" 
  | "walletconnect" 
  | "phantom" 
  | "coinbase" 
  | "flow" 
  | "petra" 
  | "solflare"

const success = await connectWallet("metamask")
// Returns: boolean (true if connection successful)
```

#### **Disconnect Wallet**

```typescript
disconnectWallet()
// Clears all wallet data and resets state
```

#### **Switch Chain**

```typescript
// Supported chains
type ChainType = 
  | "ethereum" 
  | "polygon" 
  | "arbitrum" 
  | "optimism" 
  | "bsc" 
  | "solana" 
  | "flow" 
  | "aptos"

const success = await switchChain("arbitrum")
// Returns: boolean
```

### Portfolio API

#### **Fetch Portfolio**

```typescript
await refreshPortfolio()
// Fetches current tokens, values, and PnL
// Updates: tokens[], totalValue, totalPnl
```

#### **Portfolio Response Structure**

```typescript
interface Token {
  symbol: string              // "ETH", "BTC", etc.
  name: string               // "Ethereum", "Bitcoin"
  address: string            // Contract address
  chain: ChainType           // "ethereum", "solana", etc.
  decimals: number           // Decimal places
  price: number              // Current price in USD
  change24h: number          // 24h change percentage
  balance: number            // User's token balance
  value: number              // Balance * price
  logoUrl?: string           // Token logo URL
}
```

### Trading API

#### **Place Trade Order**

```typescript
interface TradeOrderRequest {
  type: "buy" | "sell"       // Order type
  token: Token               // Token to trade
  amount: number             // Amount in token units
  price: number              // Execution price
  total: number              // Total trade value
  chain: ChainType           // Chain to trade on
  isCrossChain: boolean      // Cross-chain swap?
  sourceChain?: ChainType    // For cross-chain trades
  targetChain?: ChainType    // For cross-chain trades
}

const txHash = await placeOrder({
  type: "buy",
  token: ethToken,
  amount: 1.5,
  price: 3245.67,
  total: 4868.5,
  chain: "ethereum",
  isCrossChain: false
})
// Returns: transaction hash
```

#### **Trade Order Response**

```typescript
interface TradeOrder {
  id: string                         // UUID
  type: "buy" | "sell"
  token: Token
  amount: number
  price: number
  total: number
  status: "pending" | "confirmed" | "failed" | "cancelled"
  timestamp: number                  // Unix timestamp
  txHash?: string                    // Blockchain tx hash
  chain: ChainType
  isCrossChain: boolean
  sourceChain?: ChainType
  targetChain?: ChainType
}
```

### Activity Log API

#### **Get Activity Log**

```typescript
const activities: ActivityLog[] = activityLog
// Real-time activity feed

interface ActivityLog {
  id: string
  type: "trade" | "liquidation" | "whale_activity" | "alert"
  description: string
  timestamp: number
  severity: "info" | "warning" | "critical"
  data: Record<string, any>
}
```

---

## Web3 Integration

### Supported Blockchain Networks

| Network | Chain ID | Type | Status |
|---------|----------|------|--------|
| Ethereum | 1 | L1 | ✅ Active |
| Polygon | 137 | L2/Sidechain | ✅ Active |
| Arbitrum | 42161 | L2 (Optimistic) | ✅ Active |
| Optimism | 10 | L2 (Optimistic) | ✅ Active |
| BSC | 56 | L1 Clone | ✅ Active |
| Solana | - | L1 | ✅ Active |
| Flow | - | L1 | 🔄 In Development |
| Aptos | - | L1 | 🔄 In Development |

### Supported Wallet Integrations

| Wallet | EVM Support | Solana Support | Status |
|--------|------------|----------------|--------|
| MetaMask | ✅ | ❌ | ✅ Integrated |
| WalletConnect | ✅ | ✅ | ✅ Integrated |
| Phantom | ❌ | ✅ | ✅ Integrated |
| Coinbase | ✅ | ❌ | ✅ Integrated |
| Petra | ❌ | ❌ | 🔄 In Dev (Aptos) |
| Solflare | ❌ | ✅ | ✅ Integrated |
| Flow | ❌ | ❌ | 🔄 In Dev |

### EIP-712 Signature Implementation

EIP-712 provides human-readable signing interface for secure transactions:

```typescript
interface EIP712TypedData {
  types: {
    EIP712Domain: Array<{name: string; type: string}>
    TradeOrder: Array<{name: string; type: string}>
    [key: string]: Array<{name: string; type: string}>
  }
  primaryType: string
  domain: {
    name: string
    version: string
    chainId: number
    verifyingContract: string
  }
  message: Record<string, any>
}

// Usage in signature modal
const typedData = buildTradeOrderTypedData({
  token: "0x...",
  amount: "1000000000000000000", // 1 token in wei
  price: "3245670000000000000",
  timestamp: Math.floor(Date.now() / 1000),
  deadline: Math.floor(Date.now() / 1000) + 300,
  nonce: 1
})

// User signs via wallet
const signature = await window.ethereum.request({
  method: "eth_signTypedData_v4",
  params: [userAddress, JSON.stringify(typedData)]
})
```

### Contract Interaction Utilities

```typescript
// lib/web3/contracts.ts

export function buildTradeOrderTypedData(order: TradeOrderParams): EIP712TypedData
// Builds EIP-712 typed data for trade orders

export function buildCopyTradingTypedData(config: CopyTradingConfig): EIP712TypedData
// Builds EIP-712 typed data for copy trading setup

export function detectCrossChain(
  sourceChain: ChainType,
  targetChain: ChainType
): boolean
// Detects if trade requires cross-chain bridging
```

---

## AI Trading System

### Overview

OPUS uses machine learning models to:

1. **Analyze market conditions** in real-time
2. **Scan tokens** for trading opportunities and risk assessment
3. **Generate trade proposals** with risk/reward ratios
4. **Execute autonomous trading** via AI agents
5. **Copy top traders** with customizable strategies

### AI Token Scanner

The AI Token Scanner analyzes blockchain tokens to identify:

- **Trading opportunities** based on technical analysis
- **Risk scores** (volatility, liquidity, rug pull probability)
- **Liquidity metrics** (DEX depth, volume)
- **Smart contract audit status**
- **Community sentiment** (social signals)

```typescript
interface TokenScanResult {
  token: Token
  opportunityScore: number           // 0-100
  riskScore: number                  // 0-100
  liquidityScore: number             // 0-100
  potentialROI: number               // Projected ROI %
  recommendation: "buy" | "sell" | "hold"
  risks: string[]                    // List of identified risks
  liquidity: {
    usdVolume24h: number
    totalLiquidity: number
    depth: number                     // Bid-ask spread
  }
  sentiment: {
    score: number                     // -100 to 100
    source: string
    timestamp: number
  }
}
```

### AI Trade Proposal System

The AI generates trade proposals based on:

```typescript
interface TradeProposal {
  id: string
  fromToken: Token
  toToken: Token
  side: "buy" | "sell"
  amount: number
  estimatedPrice: number
  slippage: number                   // Expected slippage %
  riskLevel: "low" | "medium" | "high"
  expectedReturn: number             // Projected return %
  confidence: number                 // 0-100
  reasoning: string                  // AI explanation
  timeframe: "5min" | "15min" | "1h" | "1d"
  expiresAt: number
}
```

**Example Trade Proposal:**
```json
{
  "id": "prop_123abc",
  "fromToken": { "symbol": "USDC", "chain": "ethereum", ... },
  "toToken": { "symbol": "ETH", "chain": "ethereum", ... },
  "side": "buy",
  "amount": 1000,
  "estimatedPrice": 3245.67,
  "slippage": 0.35,
  "riskLevel": "medium",
  "expectedReturn": 12.5,
  "confidence": 78,
  "reasoning": "Strong technical setup with RSI oversold signal. Volume confluence on daily support.",
  "timeframe": "1h",
  "expiresAt": 1702398000
}
```

### Copy Trading System

Copy top traders' strategies with customizable parameters:

```typescript
interface TopTrader {
  id: string
  address: string
  name: string
  avatar: string
  winRate: number                    // Percentage of winning trades
  pnl: number                        // Total profit/loss
  roi: number                        // Return on investment %
  riskScore: number                  // 0-100 (lower = less risky)
  strategies: TradingStrategy[]
  followers: number
  totalManaged: number
}

interface CopyTradingConfig {
  traderId: string
  maxSlippagePercent: number         // e.g., 1
  maxTradeSize: number               // In USDC
  riskMultiplier: number             // 0.5-2x
  stopLoss: number                   // Stop loss percentage
  takeProfit: number                 // Take profit percentage
  autoApprove: boolean               // Auto-execute copied trades
}
```

---

## Database Schema & Structure

### MongoDB Collections

#### 1. **users** Collection

Stores user profile and authentication data.

```typescript
interface UserDocument {
  _id: ObjectId                      // MongoDB auto-generated ID
  email: string                      // Unique
  passwordHash: string               // Bcrypted
  fullName: string
  walletAddresses: Array<{
    address: string
    chain: string                    // e.g., "ethereum"
    label?: string
    isPrimary: boolean
    verified: boolean
  }>
  preferences: {
    riskTolerance: "low" | "medium" | "high"
    tradingStyle: "conservative" | "balanced" | "aggressive"
    notificationsEnabled: boolean
    theme: "light" | "dark"
    twoFactorEnabled: boolean
  }
  subscription: {
    tier: "free" | "premium" | "pro"
    status: "active" | "inactive" | "cancelled"
    expiresAt: Date
  }
  createdAt: Date
  updatedAt: Date
  lastLogin: Date
}
```

**Indexes:**
```
- email (unique)
- walletAddresses.address (unique)
- createdAt (descending)
```

#### 2. **portfolios** Collection

Real-time portfolio snapshots and positions.

```typescript
interface PortfolioDocument {
  _id: ObjectId
  userId: ObjectId                   // Reference to users collection
  chain: string                      // "ethereum", "solana", etc.
  assets: Array<{
    symbol: string
    address: string
    balance: number
    value: number
    price: number
    change24h: number
    allocation: number               // Percentage of portfolio
  }>
  metrics: {
    totalValue: number
    totalInvested: number
    pnl: number                      // Profit/Loss
    pnlPercent: number
    riskScore: number                // 0-100
    sharpeRatio: number
    maxDrawdown: number
  }
  history: Array<{
    timestamp: Date
    totalValue: number
    pnl: number
  }>
  lastUpdated: Date
}
```

**Indexes:**
```
- userId, chain (compound unique)
- lastUpdated (descending)
```

#### 3. **trades** Collection

Complete trade history and execution records.

```typescript
interface TradeDocument {
  _id: ObjectId
  userId: ObjectId
  txHash: string                     // Blockchain transaction hash
  type: "buy" | "sell" | "swap"
  fromToken: {
    symbol: string
    address: string
    chain: string
    amount: number
    decimals: number
  }
  toToken: {
    symbol: string
    address: string
    chain: string
    amount: number
    decimals: number
  }
  status: "pending" | "confirmed" | "failed" | "cancelled"
  executedPrice: number
  estimatedPrice: number
  slippage: number
  gasFee: number
  total: number
  pnl?: number                       // After execution
  pnlPercent?: number
  isAiGenerated: boolean             // Was this AI-proposed?
  proposalId?: string
  isCrossChain: boolean
  sourceChain?: string
  targetChain?: string
  timestamp: Date
  executedAt?: Date
  failureReason?: string
}
```

**Indexes:**
```
- userId, timestamp (compound)
- txHash (unique)
- status
- isAiGenerated
```

#### 4. **ai_proposals** Collection

AI-generated trade proposals and suggestions.

```typescript
interface AIProposalDocument {
  _id: ObjectId
  userId: ObjectId
  proposal: {
    fromToken: string                // Symbol
    toToken: string
    side: "buy" | "sell"
    amount: number
    estimatedPrice: number
    slippage: number
    riskLevel: "low" | "medium" | "high"
    expectedReturn: number
    confidence: number               // 0-100
    reasoning: string
    timeframe: "5min" | "15min" | "1h" | "1d"
  }
  status: "pending" | "executed" | "rejected" | "expired"
  executedTradeId?: ObjectId         // If executed
  createdAt: Date
  expiresAt: Date
  executedAt?: Date
}
```

**Indexes:**
```
- userId, createdAt (compound)
- status
- expiresAt
```

#### 5. **copy_trading** Collection

Copy trading configurations and performance tracking.

```typescript
interface CopyTradingDocument {
  _id: ObjectId
  followerId: ObjectId               // User copying trades
  leaderId: ObjectId                 // Top trader being copied
  config: {
    maxSlippagePercent: number
    maxTradeSize: number
    riskMultiplier: number
    stopLoss: number
    takeProfit: number
    autoApprove: boolean
    active: boolean
  }
  performance: {
    tradesExecuted: number
    winRate: number
    totalPnl: number
    totalReturn: number
    sharpeRatio: number
  }
  createdAt: Date
  updatedAt: Date
  copiedTrades: ObjectId[]           // References to trades collection
}
```

**Indexes:**
```
- followerId, leaderId (compound unique)
- active
- updatedAt
```

#### 6. **ai_agents** Collection

Configuration and status of autonomous AI trading agents.

```typescript
interface AIAgentDocument {
  _id: ObjectId
  userId: ObjectId
  name: string
  status: "active" | "inactive" | "paused" | "error"
  config: {
    strategy: "trend_following" | "mean_reversion" | "arbitrage" | "copy_trading"
    chains: string[]
    tokens: Array<{
      symbol: string
      address: string
      maxAllocation: number          // Max % of portfolio
      minBalance: number
    }>
    tradingRules: {
      maxTradesPerDay: number
      minROI: number                 // Minimum ROI threshold
      maxRiskPerTrade: number        // % of portfolio
      riskStopLoss: number
      profitTakeProfit: number
    }
    execution: {
      autoExecute: boolean
      maxGasPrice: number
      slippageTolerance: number
    }
  }
  performance: {
    totalTrades: number
    winningTrades: number
    losingTrades: number
    totalPnl: number
    roi: number
    sharpeRatio: number
    maxDrawdown: number
  }
  lastExecutionTime?: Date
  nextScheduledExecution?: Date
  errors: Array<{
    timestamp: Date
    message: string
    traceId: string
  }>
  createdAt: Date
  updatedAt: Date
}
```

**Indexes:**
```
- userId
- status
- updatedAt
```

#### 7. **activity_log** Collection

User activity audit trail and transaction history.

```typescript
interface ActivityLogDocument {
  _id: ObjectId
  userId: ObjectId
  type: "trade" | "liquidation" | "whale_activity" | "alert" | "login" | "settings_change"
  description: string
  severity: "info" | "warning" | "critical"
  data: {
    tradeTxHash?: string
    tokenSymbol?: string
    amount?: number
    value?: number
    chain?: string
    [key: string]: any
  }
  timestamp: Date
}
```

**Indexes:**
```
- userId, timestamp (compound)
- type
- severity
```

---

## AI Agents Implementation

### Overview

AI Agents are autonomous systems that execute trading strategies 24/7 without user intervention.

### Architecture

```
┌─────────────────────────────────────────┐
│      AI Agent Manager (Backend)         │
│   - Orchestrates agent lifecycle        │
│   - Schedules executions                │
│   - Monitors performance                │
└──────────────┬──────────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
┌───▼──┐  ┌───▼──┐  ┌───▼──┐
│Agent │  │Agent │  │Agent │
│  #1  │  │  #2  │  │  #3  │
└───┬──┘  └───┬──┘  └───┬──┘
    │         │         │
    └────┬────┴────┬────┘
         │         │
    ┌────▼──┐  ┌──▼────┐
    │Market │  │Trade  │
    │Data   │  │Engine │
    │Stream │  │       │
    └───────┘  └──┬─────┘
                  │
              ┌───▼────────┐
              │ Blockchain │
              │  Networks  │
              └────────────┘
```

### Supported Strategies

#### 1. **Trend Following**

Follows uptrend and downtrend patterns using technical indicators.

```typescript
interface TrendFollowingConfig {
  strategy: "trend_following"
  indicators: {
    ma20: boolean                    // 20-period moving average
    ma50: boolean                    // 50-period moving average
    rsi: boolean                     // Relative Strength Index
    macd: boolean                    // MACD
    bollingerBands: boolean
  }
  buyConditions: {
    price_above_ma20: boolean
    price_above_ma50: boolean
    rsi_below_30: boolean            // Oversold
    macd_crossover: boolean
  }
  sellConditions: {
    price_below_ma20: boolean
    rsi_above_70: boolean            // Overbought
    macd_crossunder: boolean
  }
  timeframe: "5min" | "15min" | "1h" | "4h" | "1d"
}
```

#### 2. **Mean Reversion**

Trades on the assumption that prices revert to their mean.

```typescript
interface MeanReversionConfig {
  strategy: "mean_reversion"
  lookbackPeriod: number             // Days
  threshold: number                  // Standard deviations
  buyWhen: "price_below_lower_band"
  sellWhen: "price_above_upper_band"
  timeframe: string
}
```

#### 3. **Arbitrage**

Exploits price discrepancies across different exchanges/chains.

```typescript
interface ArbitrageConfig {
  strategy: "arbitrage"
  sourcChain: ChainType
  targetChain: ChainType
  minProfitPercent: number           // Minimum profit threshold
  maxSlippage: number
  tokens: string[]                   // Tokens to monitor
}
```

#### 4. **Copy Trading**

Automatically copies trades from top-performing traders.

```typescript
interface CopyTradingAgentConfig {
  strategy: "copy_trading"
  targetTrader: string               // Trader address/ID
  riskMultiplier: number             // 0.5 - 2.0
  maxTradeSize: number
  autoApprove: boolean
}
```

### Agent Configuration API

#### **Create AI Agent**

```typescript
POST /api/agents
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "name": "ETH Trend Follower",
  "status": "inactive",
  "config": {
    "strategy": "trend_following",
    "chains": ["ethereum", "arbitrum"],
    "tokens": [
      {
        "symbol": "ETH",
        "address": "0x...",
        "maxAllocation": 50,
        "minBalance": 0.1
      },
      {
        "symbol": "USDC",
        "address": "0x...",
        "maxAllocation": 50,
        "minBalance": 100
      }
    ],
    "tradingRules": {
      "maxTradesPerDay": 10,
      "minROI": 0.5,
      "maxRiskPerTrade": 2,
      "riskStopLoss": 5,
      "profitTakeProfit": 10
    },
    "execution": {
      "autoExecute": true,
      "maxGasPrice": 100,
      "slippageTolerance": 0.5
    }
  }
}
```

#### **Get Agent Status**

```typescript
GET /api/agents/{agentId}
Authorization: Bearer <jwt-token>

Response 200 OK:
{
  "id": "agent_123abc",
  "name": "ETH Trend Follower",
  "status": "active",
  "config": { ... },
  "performance": {
    "totalTrades": 45,
    "winningTrades": 28,
    "winRate": 62.2,
    "totalPnl": 1250.50,
    "roi": 12.5
  },
  "lastExecutionTime": "2025-12-12T14:30:00Z",
  "nextScheduledExecution": "2025-12-12T15:00:00Z"
}
```

#### **Update Agent Configuration**

```typescript
PUT /api/agents/{agentId}
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "status": "active",
  "config": { ... }
}
```

#### **Delete Agent**

```typescript
DELETE /api/agents/{agentId}
Authorization: Bearer <jwt-token>

Response 200 OK:
{
  "message": "Agent deleted successfully"
}
```

### Agent Execution Lifecycle

```
┌────────────────────┐
│   Agent Created    │
│    (Inactive)      │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Agent Activated   │
│   (Scheduled)      │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐      ┌──────────────┐
│  Check Market Data │◄─────┤ Market Event?│
│ & Conditions       │      └──────────────┘
└─────────┬──────────┘
          │
    ┌─────┴──────┐
    │            │
   YES          NO
    │            │
    ▼            │
┌─────────────┐  │
│ Generate    │  │
│ Trade Order │  │
└────┬────────┘  │
     │           │
     ▼           │
┌──────────────┐ │
│ Sign Order   │ │
│ (EIP-712)    │ │
└────┬─────────┘ │
     │           │
     ▼           │
┌──────────────┐ │
│Execute Trade │ │
│on Blockchain │ │
└────┬─────────┘ │
     │           │
     ▼           │
┌──────────────┐ │
│ Monitor TX   │ │
│ & Update DB  │ │
└────┬─────────┘ │
     │           │
     └─────┬─────┘
           │
           ▼
┌────────────────────┐
│ Schedule Next Run  │
│ (5-60 min later)   │
└────────────────────┘
```

---

## CLI Execution & Local Agent Running

### Installation & Setup

#### **1. Install Dependencies**

```bash
# Using pnpm
pnpm install

# Using npm
npm install

# Using yarn
yarn install
```

#### **2. Configure Environment Variables**

Create `.env.local` file in the project root:

```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_CHAIN_RPC_ETHEREUM=https://eth-rpc.example.com
NEXT_PUBLIC_CHAIN_RPC_ARBITRUM=https://arb-rpc.example.com
NEXT_PUBLIC_CHAIN_RPC_SOLANA=https://api.mainnet-beta.solana.com

# Backend (if running locally)
PORT=3001
MONGODB_URI=mongodb://localhost:27017/opus-trading
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=7200

# AI Agent Configuration
AI_MODEL_API_KEY=sk-your-ai-model-key
AI_MODEL_ENDPOINT=https://api.openai.com/v1
AGENT_CHECK_INTERVAL=300000  # 5 minutes in milliseconds
AGENT_MAX_CONCURRENT=5

# Web3
INFURA_KEY=your-infura-key
ALCHEMY_KEY=your-alchemy-key
ETHERSCAN_API_KEY=your-etherscan-key
```

#### **3. Start Development Server**

```bash
# Frontend only
pnpm dev
# Runs at http://localhost:3000

# With backend (separate terminal)
pnpm dev:backend
# Backend runs at http://localhost:3001
```

### Running AI Agents Locally

#### **Method 1: Via Web3 Interface (Recommended)**

```typescript
// In your browser console or app component
const { useWeb3 } = await import('@/lib/web3/context')

// Create a new AI agent
const agentConfig = {
  name: "My Trading Agent",
  strategy: "trend_following",
  chains: ["ethereum"],
  tokens: [
    { symbol: "ETH", address: "0x...", maxAllocation: 50 },
    { symbol: "USDC", address: "0x...", maxAllocation: 50 }
  ],
  tradingRules: {
    maxTradesPerDay: 5,
    minROI: 1,
    maxRiskPerTrade: 2,
    riskStopLoss: 5,
    profitTakeProfit: 15
  },
  execution: {
    autoExecute: false,  // Manual approval for local testing
    maxGasPrice: 50,
    slippageTolerance: 0.5
  }
}

// Send to API
const response = await fetch('/api/agents', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${jwtToken}`
  },
  body: JSON.stringify(agentConfig)
})

const agent = await response.json()
console.log('Agent created:', agent.id)
```

#### **Method 2: Via CLI Command (Backend)**

Create `scripts/run-agent.js`:

```javascript
#!/usr/bin/env node

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const AIAgent = require('../models/AIAgent');
const { executeAgentStrategy } = require('../services/agentService');

async function runAgent(agentId) {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');

    // Fetch agent configuration
    const agent = await AIAgent.findById(agentId);
    if (!agent) {
      throw new Error(`Agent ${agentId} not found`);
    }

    console.log(`\n🤖 Running Agent: ${agent.name}`);
    console.log(`📊 Strategy: ${agent.config.strategy}`);
    console.log(`⛓️  Chains: ${agent.config.chains.join(', ')}`);

    // Execute agent strategy
    const result = await executeAgentStrategy(agent);

    console.log('\n✅ Execution Complete');
    console.log(`Trade Orders Generated: ${result.ordersGenerated}`);
    console.log(`Trades Executed: ${result.tradesExecuted}`);
    console.log(`Total PnL: $${result.totalPnl}`);

    // Disconnect
    await mongoose.disconnect();
    console.log('\n✓ Disconnected from MongoDB');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run agent
const agentId = process.argv[2];
if (!agentId) {
  console.error('Usage: node scripts/run-agent.js <agentId>');
  process.exit(1);
}

runAgent(agentId);
```

**Run from command line:**

```bash
# Make script executable
chmod +x scripts/run-agent.js

# Run a specific agent
node scripts/run-agent.js 507f1f77bcf86cd799439011

# Output:
# ✓ Connected to MongoDB
# 🤖 Running Agent: ETH Trend Follower
# 📊 Strategy: trend_following
# ⛓️  Chains: ethereum, arbitrum
# ✅ Execution Complete
# Trade Orders Generated: 3
# Trades Executed: 2
# Total PnL: $145.30
```

#### **Method 3: Continuous Agent Daemon**

Create `scripts/agent-daemon.js`:

```javascript
#!/usr/bin/env node

const cron = require('node-cron');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const AIAgent = require('../models/AIAgent');
const { executeAgentStrategy } = require('../services/agentService');

const INTERVAL = process.env.AGENT_CHECK_INTERVAL || 300000; // 5 minutes
const MAX_CONCURRENT = process.env.AGENT_MAX_CONCURRENT || 5;

let activeExecutions = 0;

async function checkAndExecuteAgents() {
  if (activeExecutions >= MAX_CONCURRENT) {
    console.log(`⏳ Waiting... (${activeExecutions}/${MAX_CONCURRENT} agents running)`);
    return;
  }

  try {
    // Find active agents
    const activeAgents = await AIAgent.find({ 
      status: 'active',
      $or: [
        { lastExecutionTime: null },
        { lastExecutionTime: { $lt: new Date(Date.now() - INTERVAL) } }
      ]
    }).limit(MAX_CONCURRENT - activeExecutions);

    for (const agent of activeAgents) {
      activeExecutions++;

      executeAgentStrategy(agent)
        .then(result => {
          console.log(`✅ [${agent.name}] Trades: ${result.tradesExecuted}, PnL: $${result.totalPnl}`);
        })
        .catch(error => {
          console.error(`❌ [${agent.name}] Error: ${error.message}`);
        })
        .finally(() => {
          activeExecutions--;
        });
    }
  } catch (error) {
    console.error('Error checking agents:', error.message);
  }
}

async function startDaemon() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✓ Connected to MongoDB');
    console.log(`\n🚀 Agent Daemon Started`);
    console.log(`📍 Check interval: ${INTERVAL}ms`);
    console.log(`🔄 Max concurrent: ${MAX_CONCURRENT}\n`);

    // Check every INTERVAL
    setInterval(checkAndExecuteAgents, INTERVAL);

    // Initial check
    await checkAndExecuteAgents();

  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

startDaemon();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down gracefully...');
  await mongoose.disconnect();
  console.log('✓ Disconnected from MongoDB');
  process.exit(0);
});
```

**Start the daemon:**

```bash
# Run in background
nohup node scripts/agent-daemon.js > agent-daemon.log 2>&1 &

# Or with PM2 (recommended)
pm2 start scripts/agent-daemon.js --name "opus-agent-daemon"
pm2 logs opus-agent-daemon
```

#### **Method 4: Local Testing with Mock Data**

```typescript
// src/tests/agent-local-test.ts

import { TrendFollowingAgent } from '@/services/agents/TrendFollowingAgent'
import { mockMarketData } from '@/tests/mocks/marketData'

async function testAgentLocally() {
  const agent = new TrendFollowingAgent({
    name: 'Test Agent',
    config: {
      strategy: 'trend_following',
      chains: ['ethereum'],
      tokens: [
        { symbol: 'ETH', address: '0x...', maxAllocation: 50 }
      ],
      tradingRules: {
        maxTradesPerDay: 10,
        minROI: 1,
        maxRiskPerTrade: 2
      }
    }
  })

  // Simulate market data
  const marketData = mockMarketData.eth

  console.log('📊 Testing Agent with Mock Data...')
  console.log(`Token: ${marketData.symbol}`)
  console.log(`Price: $${marketData.price}`)
  console.log(`24h Change: ${marketData.change24h}%`)

  // Run strategy analysis
  const signal = await agent.analyze(marketData)

  console.log(`\n🎯 Trading Signal: ${signal.action}`)
  console.log(`Confidence: ${signal.confidence}%`)
  console.log(`Reason: ${signal.reasoning}`)

  if (signal.action === 'BUY') {
    console.log(`\n💰 Suggested Trade:`)
    console.log(`Amount: ${signal.amount}`)
    console.log(`Entry Price: $${signal.entryPrice}`)
    console.log(`Take Profit: $${signal.takeProfit}`)
    console.log(`Stop Loss: $${signal.stopLoss}`)
  }
}

testAgentLocally().catch(console.error)
```

**Run test:**

```bash
pnpm run test:agent-local
```

---

## Future Development Roadmap

### Phase 1: Foundation (Q1 2025) ✅

- [x] Multi-chain wallet connection
- [x] Portfolio tracking dashboard
- [x] Basic trading interface with EIP-712 signing
- [x] Frontend implementation
- [ ] **Next:** Backend API setup

### Phase 2: Backend & AI Core (Q1-Q2 2025) 🔄 Current

#### **Backend Infrastructure**
- [ ] Express.js REST API
- [ ] MongoDB integration with Mongoose schemas
- [ ] JWT authentication & middleware
- [ ] Rate limiting & security

#### **AI Token Scanner**
- [ ] Machine learning model integration
- [ ] Real-time token analysis
- [ ] Risk scoring algorithm
- [ ] Community sentiment analysis

#### **Trade Proposal Engine**
- [ ] Technical analysis indicators (MA, RSI, MACD, Bollinger Bands)
- [ ] Trade recommendation algorithm
- [ ] Risk/reward calculation
- [ ] Backtesting engine

### Phase 3: Autonomous Agents (Q2-Q3 2025)

#### **Agent Management**
- [ ] Trend following strategy implementation
- [ ] Mean reversion strategy
- [ ] Arbitrage strategy
- [ ] Copy trading automation
- [ ] Agent execution scheduler

#### **Advanced Features**
- [ ] Multi-strategy portfolio agent
- [ ] Genetic algorithm optimization
- [ ] Reinforcement learning integration
- [ ] Agent backtesting framework

### Phase 4: Copy Trading (Q3 2025)

- [ ] Top trader identification
- [ ] Performance ranking & leaderboard
- [ ] Copy trading execution
- [ ] Risk-adjusted position sizing
- [ ] Performance tracking & analytics

### Phase 5: Advanced Integrations (Q4 2025)

#### **Data Sources**
- [ ] Real-time market data feeds (CoinGecko, Chainlink oracles)
- [ ] DEX aggregators (1Inch, Uniswap v4)
- [ ] Cross-chain bridge integration
- [ ] Options trading support

#### **Smart Contracts**
- [ ] Trading strategy contract deployment
- [ ] Automated order execution contracts
- [ ] Agent factory contracts
- [ ] Treasury management contracts

#### **User Experience**
- [ ] Mobile app (React Native)
- [ ] Advanced charting (TradingView integration)
- [ ] Push notifications
- [ ] Email alerts

### Phase 6: Enterprise Features (2026)

- [ ] Multi-signature wallet support
- [ ] Institutional grade risk management
- [ ] Audit logging & compliance
- [ ] White-label solutions
- [ ] API for third-party integrations
- [ ] DAO governance

### Technology Upgrades

| Timeline | Upgrade |
|----------|---------|
| Q1 2025 | GraphQL API for real-time data |
| Q2 2025 | WebSocket support for live updates |
| Q3 2025 | Redis caching layer |
| Q4 2025 | Kubernetes deployment |
| 2026 | Microservices architecture |

### Feature Requests (Community Voted)

1. **Options Trading Support** ⭐⭐⭐
2. **Futures Trading** ⭐⭐⭐
3. **Margin Trading** ⭐⭐
4. **Lending/Borrowing** ⭐⭐
5. **NFT Portfolio Tracking** ⭐

---

## Environment Configuration

### Development Environment

```env
# Application
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=OPUS
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_DEBUG=true

# Database
MONGODB_URI=mongodb://localhost:27017/opus-trading-dev
MONGODB_LOG_LEVEL=debug

# JWT & Security
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRATION=7200
BCRYPT_ROUNDS=10

# RPC Providers
NEXT_PUBLIC_CHAIN_RPC_ETHEREUM=https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_CHAIN_RPC_ARBITRUM=https://arb-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_CHAIN_RPC_POLYGON=https://polygon-mainnet.g.alchemy.com/v2/YOUR_KEY
NEXT_PUBLIC_CHAIN_RPC_SOLANA=https://api.mainnet-beta.solana.com

# AI Services
AI_MODEL_PROVIDER=openai
AI_MODEL_API_KEY=sk-xxxxx
AI_MODEL_NAME=gpt-4

# Agent Configuration
AGENT_CHECK_INTERVAL=300000
AGENT_MAX_CONCURRENT=5
AGENT_TIMEOUT=60000

# Web3
INFURA_PROJECT_ID=your-infura-project-id
ALCHEMY_API_KEY=your-alchemy-key
ETHERSCAN_API_KEY=your-etherscan-key
```

### Production Environment

```env
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=OPUS
NEXT_PUBLIC_API_URL=https://api.opus-trading.com
NEXT_PUBLIC_DEBUG=false

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/opus-trading
MONGODB_LOG_LEVEL=warn

# JWT & Security (use strong random values)
JWT_SECRET=<generate-with-openssl-rand-base64-32>
JWT_EXPIRATION=3600
BCRYPT_ROUNDS=12

# RPC Providers (premium/dedicated)
NEXT_PUBLIC_CHAIN_RPC_ETHEREUM=https://eth-mainnet.g.alchemy.com/v2/prod-key
# ... other chains

# Rate Limiting
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX_REQUESTS=100

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@opus-trading.com
SMTP_PASS=xxxx
```

### Generate Secure JWT Secret

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { [byte](Get-Random -Max 256) }))
```

---

## Deployment Guide

### Frontend Deployment (Vercel)

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy to production"
git push origin main

# 2. Vercel automatically deploys from main branch
# No additional steps needed for frontend

# 3. Set environment variables in Vercel dashboard
# Settings > Environment Variables > Add NEXT_PUBLIC_API_URL, etc.
```

### Backend Deployment (Docker + AWS/GCP)

#### **1. Create Dockerfile**

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
```

#### **2. Build & Push Docker Image**

```bash
# Build
docker build -t opus-trading-api:latest .

# Tag for registry
docker tag opus-trading-api:latest gcr.io/your-project/opus-api:latest

# Push
docker push gcr.io/your-project/opus-api:latest
```

#### **3. Deploy to Cloud Run (GCP)**

```bash
gcloud run deploy opus-api \
  --image gcr.io/your-project/opus-api:latest \
  --platform managed \
  --region us-central1 \
  --set-env-vars MONGODB_URI=$MONGODB_URI,JWT_SECRET=$JWT_SECRET \
  --memory 512Mi \
  --cpu 1
```

#### **4. Deploy to AWS ECS**

```bash
# Create ECS task definition
aws ecs register-task-definition \
  --family opus-api \
  --container-definitions file://task-definition.json

# Update service
aws ecs update-service \
  --cluster opus-prod \
  --service opus-api \
  --force-new-deployment
```

---

## Security Best Practices

### Frontend Security
- ✅ Never store private keys or seed phrases in code
- ✅ Use HTTPS only in production
- ✅ Implement CSP (Content Security Policy)
- ✅ Sanitize all user inputs
- ✅ Use environment variables for sensitive data

### Backend Security
- ✅ Validate all API inputs
- ✅ Implement rate limiting (100 req/min default)
- ✅ Use CORS whitelist for allowed origins
- ✅ Hash passwords with bcrypt (12 rounds min)
- ✅ Implement API authentication (JWT)
- ✅ Use HTTPS/TLS for all connections
- ✅ Implement audit logging

### Web3 Security
- ✅ Always use EIP-712 typed signing
- ✅ Implement transaction validation
- ✅ Use hardware wallet support
- ✅ Implement multi-sig for large trades
- ✅ Regular security audits of contracts

### Database Security
- ✅ Use connection strings with authentication
- ✅ Implement IP whitelisting
- ✅ Enable database encryption at rest
- ✅ Regular backups (daily)
- ✅ Use VPC for database access

---

## Support & Resources

### Documentation
- API Documentation: `/docs/api`
- Architecture Guide: `/docs/architecture`
- Deployment Guide: `/docs/deployment`
- Security Guide: `/docs/security`

### Community
- GitHub Issues: Report bugs and request features
- Discord: [Join Community](https://discord.gg/opus)
- Twitter: [@OpusTrading](https://twitter.com/opustrading)

### Getting Help
1. Check existing GitHub issues
2. Ask in Discord community
3. Open a new GitHub issue with details
4. Contact: support@opus-trading.com

---

## License

OPUS AI Crypto Trading Platform is licensed under the **ISC License**.

See LICENSE file for details.

---

## Changelog

### v1.0.0 (December 12, 2025)
- ✅ Initial release with frontend dashboard
- ✅ Multi-chain wallet integration
- ✅ Portfolio tracking
- ✅ EIP-712 signing support
- 🔄 Backend API (in development)
- 🔄 AI agents (in development)

### Upcoming
- v1.1.0 - Backend API & database integration
- v1.2.0 - AI token scanner
- v1.3.0 - Autonomous agents
- v1.4.0 - Copy trading

---

**Last Updated:** December 12, 2025  
**Maintained by:** OPUS Team  
**Repository:** [GitHub](https://github.com/mesayanroy/OPUS-ai-crypto-Trade-)

