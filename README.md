# OPUS - AI Crypto Trading Platform

Create your own AI Agents VIA PROMPT that will do the trade and maintain your trading portfolio , ask them themto do swaps, DEX , CEX , Sel , Buy or liquidate assests on your will with easy cash in and cash out. Featuring real-time market analysis, automated trading insights, multi-chain wallet support, and copy trading capabilities. More Features are on the way untill that till our beta launch built your own ai agents and make them do the trades and yout u can chill drinking a coconut water maybe.

<img width="1554" height="902" alt="image" src="https://github.com/user-attachments/assets/2dc071a7-c13b-4d9b-b10b-46764f69adbf" />


## 🎯 Overview

OPUS AI Crypto Trading Platform is a comprehensive Web3 application that combines AI-powered market analysis with seamless multi-chain trading capabilities. The platform features:

- **AI Token Scanner** - Automatically scans the market to identify high-potential trading opportunities
- **AI Trade Analysis** - Provides intelligent trading recommendations based on technical analysis
- **AI Trade Proposals** - Generates detailed trade suggestions with risk assessment and reasoning
- **Multi-Chain Support** - Trade across Ethereum, Polygon, Arbitrum, Optimism, Solana, Flow, and Aptos
- **Copy Trading** - Follow and replicate successful traders' strategies
- **Portfolio Tracking** - Real-time portfolio monitoring and analytics
- **EIP-712 Signatures** - Secure transaction signing with typed data

## 🚀 Features

### AI-Powered Features
- **Market Scanning**: AI algorithms analyze market conditions to identify promising tokens
- **Trade Recommendations**: Get AI-generated buy/sell suggestions with detailed reasoning
- **Risk Assessment**: Automated risk scoring for every trading opportunity
- **Technical Analysis**: Real-time RSI, support/resistance level analysis, and volume indicators

### Web3 Features
- **Wallet Integration**: Support for MetaMask, Coinbase Wallet, Phantom, Solflare, Petra, Flow, and WalletConnect
- **Cross-Chain Trading**: Execute trades across multiple blockchain networks
- **Secure Signatures**: EIP-712 typed data signatures for secure transaction authorization
- **Activity Logging**: Comprehensive activity tracking and transaction history

### Trading Features
- **Spot Trading**: Buy and sell tokens across multiple chains
- **Copy Trading**: Automatically replicate top traders' positions
- **Portfolio Management**: Track holdings, P&L, and performance metrics
- **Real-time Updates**: Live price updates and market data

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 18.17 or higher
- **pnpm** (recommended) or npm/yarn
- **Git**

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OPUS-ai-crypto-Trade--1
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
OPUS-ai-crypto-Trade--1/
├── app/                    # Next.js app directory
│   ├── dashboard/          # Dashboard page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── dashboard/          # Dashboard-specific components
│   │   ├── ai-token-scanner.tsx      # AI market scanner
│   │   ├── trade-proposal-modal.tsx  # AI trade proposal UI
│   │   └── ...
│   ├── app/                # Application components
│   │   └── trading.tsx     # Trading interface with AI analysis
│   └── web3/               # Web3 wallet components
├── lib/                    # Utility libraries
│   └── web3/               # Web3 integration
│       ├── context.tsx     # Web3 context provider
│       ├── contracts.ts    # Smart contract utilities
│       ├── types.ts        # TypeScript type definitions
│       └── wallet-providers.ts  # Wallet connection logic
└── public/                 # Static assets
```

## 🤖 Adding AI Agent Functionality to Your Codebase

Follow these step-by-step instructions to integrate the AI agent features into your own project.

### Step 1: Set Up the Project Structure

Create the necessary directories if they don't exist:

```bash
mkdir -p components/dashboard
mkdir -p lib/web3
```

### Step 2: Install Required Dependencies

The project uses the following key dependencies. Ensure they're installed:

```bash
pnpm add next react react-dom
pnpm add lucide-react framer-motion
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu
pnpm add tailwindcss postcss autoprefixer
pnpm add -D typescript @types/node @types/react @types/react-dom
```

### Step 3: Create Type Definitions

Create `lib/web3/types.ts` with the following types:

```typescript
export type ChainType = "ethereum" | "polygon" | "arbitrum" | "optimism" | "bsc" | "solana" | "flow" | "aptos"
export type WalletType = "metamask" | "coinbase" | "phantom" | "solflare" | "petra" | "flow" | "walletconnect"

export interface Token {
  symbol: string
  name: string
  address: string
  chain: ChainType
  decimals: number
  price: number
  change24h: number
  balance: number
  value: number
}

export interface ScannedToken {
  symbol: string
  name: string
  score: number
  risk: "Low" | "Medium" | "High"
  liquidity: number
  reason: string
}

export interface TradeProposal {
  action: "buy" | "sell"
  symbol: string
  amount: number
  price: number
  reasoning: string
  riskScore: number
  estimatedSlippage: number
  liquidationZone: { min: number; max: number }
}
```

### Step 4: Create the AI Token Scanner Component

Create `components/dashboard/ai-token-scanner.tsx`:

```typescript
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, TrendingUp, AlertTriangle, Droplets, ChevronRight } from "lucide-react"
import { TradeProposalModal } from "./trade-proposal-modal"

// Component implementation from the codebase
// See: components/dashboard/ai-token-scanner.tsx
```

**Key Features:**
- `handleScan()` - Initiates AI market scanning
- `handleSuggestTrade()` - Opens AI trade proposal modal
- Displays scanned tokens with risk scores and AI reasoning

### Step 5: Create the Trade Proposal Modal

Create `components/dashboard/trade-proposal-modal.tsx`:

```typescript
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { TradeProposal } from "@/lib/web3/types"
// Component implementation
```

**Key Features:**
- Fetches AI-generated trade proposals
- Displays risk scores, slippage estimates, and liquidation zones
- Generates EIP-712 signatures for secure trading

### Step 6: Integrate AI Analysis in Trading Interface

Add AI analysis to your trading component (`components/app/trading.tsx`):

```typescript
const [isAIAnalyzing, setIsAIAnalyzing] = useState(false)
const [aiRecommendation, setAIRecommendation] = useState<string | null>(null)

const handleAIAnalysis = async () => {
  if (!selectedToken) return
  setIsAIAnalyzing(true)
  
  // Call your AI analysis API
  const response = await fetch('/api/ai/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token: selectedToken.symbol })
  })
  
  const data = await response.json()
  setAIRecommendation(data.recommendation)
  setIsAIAnalyzing(false)
}
```

### Step 7: Create API Routes for AI Functions

Create the following API routes:

**`app/api/ai/scan/route.ts`** - Market scanning endpoint:

```typescript
import { NextResponse } from 'next/server'

export async function POST() {
  // Implement your AI market scanning logic
  // This should analyze market conditions, liquidity, volume, etc.
  
  const scannedTokens = [
    {
      symbol: "ETH",
      name: "Ethereum",
      score: 87,
      risk: "Low" as const,
      liquidity: 15000000000,
      reason: "Strong institutional inflows and upcoming protocol upgrades"
    },
    // Add more tokens...
  ]
  
  return NextResponse.json({ tokens: scannedTokens })
}
```

**`app/api/ai/propose-trade/route.ts`** - Trade proposal endpoint:

```typescript
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { symbol } = await request.json()
  
  // Implement your AI trade proposal logic
  // Analyze technical indicators, calculate risk, etc.
  
  const proposal = {
    action: "buy" as const,
    symbol,
    amount: 50,
    price: 3245.67,
    reasoning: "Technical analysis indicates strong support level...",
    riskScore: 35,
    estimatedSlippage: 0.15,
    liquidationZone: { min: 2800, max: 2950 }
  }
  
  return NextResponse.json(proposal)
}
```

**`app/api/ai/analyze/route.ts`** - Trading analysis endpoint:

```typescript
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { token } = await request.json()
  
  // Implement your AI analysis logic
  // Calculate RSI, support/resistance, volume analysis, etc.
  
  const recommendation = `Based on technical analysis, ${token} shows strong support at $X.XX. 
    RSI indicates oversold conditions. Recommended action: HOLD or BUY on dips.`
  
  return NextResponse.json({ recommendation })
}
```

### Step 8: Connect AI Services (Optional)

To integrate with real AI services, you can connect to:

1. **OpenAI API** - For natural language analysis
2. **Custom ML Models** - For technical analysis
3. **Third-party APIs** - For market data and signals

Example integration with OpenAI:

```typescript
// app/api/ai/analyze/route.ts
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: Request) {
  const { token } = await request.json()
  
  const completion = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{
      role: "system",
      content: "You are a cryptocurrency trading analyst. Provide technical analysis..."
    }, {
      role: "user",
      content: `Analyze ${token} and provide trading recommendations.`
    }]
  })
  
  return NextResponse.json({ 
    recommendation: completion.choices[0].message.content 
  })
}
```

### Step 9: Add Web3 Context Provider

Wrap your app with the Web3 provider in `app/layout.tsx`:

```typescript
import { Web3Provider } from "@/lib/web3/context"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  )
}
```

### Step 10: Implement the Dashboard Page

Create `app/dashboard/page.tsx`:

```typescript
import { AITokenScanner } from "@/components/dashboard/ai-token-scanner"
import { PortfolioTracker } from "@/components/dashboard/portfolio-tracker"
import { CopyTradingSection } from "@/components/dashboard/copy-trading-section"
import { ActivityPanel } from "@/components/dashboard/activity-panel"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1400px] mx-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PortfolioTracker />
          <AITokenScanner />
        </div>
        {/* Add more components */}
      </div>
    </div>
  )
}
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# AI Service API Keys (if using external services)
OPENAI_API_KEY=your_openai_api_key_here

# Wallet Configuration
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# API Endpoints
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🎨 Customization

### Styling

The project uses Tailwind CSS. Customize colors and themes in `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: /* your primary color */;
  --background: /* your background color */;
}
```

### AI Model Customization

Modify the AI analysis logic in the API routes to use your preferred models or analysis strategies:

1. **Technical Analysis**: Add indicators like MACD, Bollinger Bands, etc.
2. **Risk Calculation**: Adjust risk scoring algorithms
3. **Trading Signals**: Customize buy/sell signal generation

## 🧪 Testing

Test the AI agent functionality:

1. **Test Market Scanning**
   - Navigate to the dashboard
   - Click "Scan Market" button
   - Verify tokens are returned with scores and risk levels

2. **Test Trade Proposals**
   - Select a scanned token
   - Click "AI Suggest Trade"
   - Verify proposal details (risk score, reasoning, etc.)

3. **Test AI Analysis**
   - Go to trading interface
   - Select a token
   - Click "Analyze" button
   - Verify recommendation appears

## 📚 Key Components Reference

### AI Token Scanner (`components/dashboard/ai-token-scanner.tsx`)
- Scans market for trading opportunities
- Displays tokens with AI-generated scores
- Provides risk assessment

### Trade Proposal Modal (`components/dashboard/trade-proposal-modal.tsx`)
- Shows detailed AI trade recommendations
- Displays risk scores and reasoning
- Generates secure signatures

### Trading Component (`components/app/trading.tsx`)
- Integrated AI analysis feature
- Real-time trading recommendations
- Cross-chain trading support

## 🔐 Security Considerations

1. **API Keys**: Never commit API keys to version control
2. **Wallet Connections**: Always verify wallet signatures
3. **EIP-712**: Use typed data signatures for secure transactions
4. **Rate Limiting**: Implement rate limiting on AI API endpoints
5. **Input Validation**: Validate all user inputs before processing

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Build for Production

```bash
pnpm build
pnpm start
```

## 📖 API Documentation

### AI Endpoints

**POST `/api/ai/scan`**
- Scans market for trading opportunities
- Returns: `{ tokens: ScannedToken[] }`

**POST `/api/ai/propose-trade`**
- Generates AI trade proposal
- Body: `{ symbol: string }`
- Returns: `TradeProposal`

**POST `/api/ai/analyze`**
- Analyzes a token for trading
- Body: `{ token: string }`
- Returns: `{ recommendation: string }`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation
- Review the codebase examples

## 🎯 Roadmap

- [ ] Real-time AI model integration
- [ ] Advanced technical indicators
- [ ] Social sentiment analysis
- [ ] Automated trading strategies
- [ ] Mobile app support
- [ ] Additional blockchain networks

---

Built with ❤️ using Next.js, TypeScript, and AI-powered trading algorithms.
