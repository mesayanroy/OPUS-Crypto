"use client"

import { useState } from "react"
import { useWeb3 } from "@/lib/web3/context"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Search, Brain, AlertTriangle, ArrowRight, Loader2, Users, X } from "lucide-react"
import { buildTradeOrderTypedData, buildCopyTradingTypedData, detectCrossChain } from "@/lib/web3/contracts"
import { SignatureModal } from "@/components/web3/signature-modal"
import type { EIP712TypedData, ChainType, Token, TopTrader } from "@/lib/web3/types"

// Mock market data
const MARKET_TOKENS: Token[] = [
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x1",
    chain: "ethereum",
    decimals: 18,
    price: 3245.67,
    change24h: 2.34,
    balance: 0,
    value: 0,
  },
  {
    symbol: "BTC",
    name: "Bitcoin",
    address: "0x2",
    chain: "ethereum",
    decimals: 8,
    price: 67234.12,
    change24h: -1.23,
    balance: 0,
    value: 0,
  },
  {
    symbol: "SOL",
    name: "Solana",
    address: "0x3",
    chain: "solana",
    decimals: 9,
    price: 145.23,
    change24h: 5.67,
    balance: 0,
    value: 0,
  },
  {
    symbol: "ARB",
    name: "Arbitrum",
    address: "0x4",
    chain: "arbitrum",
    decimals: 18,
    price: 1.24,
    change24h: -0.56,
    balance: 0,
    value: 0,
  },
  {
    symbol: "MATIC",
    name: "Polygon",
    address: "0x5",
    chain: "polygon",
    decimals: 18,
    price: 0.89,
    change24h: 3.12,
    balance: 0,
    value: 0,
  },
  {
    symbol: "OP",
    name: "Optimism",
    address: "0x6",
    chain: "optimism",
    decimals: 18,
    price: 2.45,
    change24h: 1.89,
    balance: 0,
    value: 0,
  },
]

const TOP_TRADERS: TopTrader[] = [
  {
    address: "0x1234...5678",
    name: "CryptoWhale.eth",
    avatar: "",
    pnl: 156780,
    pnlPercent: 234.5,
    winRate: 78,
    followers: 12453,
    strategy: "Momentum",
    riskScore: 35,
    trades: 1245,
  },
  {
    address: "0x2345...6789",
    name: "DeFiKing",
    avatar: "",
    pnl: 89450,
    pnlPercent: 167.8,
    winRate: 72,
    followers: 8923,
    strategy: "Value",
    riskScore: 28,
    trades: 892,
  },
  {
    address: "0x3456...7890",
    name: "AlphaHunter",
    avatar: "",
    pnl: 67230,
    pnlPercent: 145.2,
    winRate: 65,
    followers: 6234,
    strategy: "Scalping",
    riskScore: 62,
    trades: 3421,
  },
]

export function AppTrading() {
  const { wallet, isConnected, setShowWalletModal } = useWeb3()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState("")
  const [targetChain, setTargetChain] = useState<ChainType>("ethereum")
  const [isAIAnalyzing, setIsAIAnalyzing] = useState(false)
  const [aiRecommendation, setAIRecommendation] = useState<string | null>(null)
  const [showMobileTradePanel, setShowMobileTradePanel] = useState(false)

  const [showSignature, setShowSignature] = useState(false)
  const [signatureData, setSignatureData] = useState<EIP712TypedData | null>(null)
  const [intentSummary, setIntentSummary] = useState("")
  const [orderSourceChain, setOrderSourceChain] = useState<ChainType | undefined>()
  const [orderTargetChain, setOrderTargetChain] = useState<ChainType | undefined>()

  const filteredTokens = MARKET_TOKENS.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAIAnalysis = async () => {
    if (!selectedToken) return
    setIsAIAnalyzing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setAIRecommendation(
      `Based on technical analysis, ${selectedToken.symbol} shows strong support at $${(selectedToken.price * 0.95).toFixed(2)}. RSI indicates oversold conditions. Recommended action: ${selectedToken.change24h > 0 ? "HOLD or BUY on dips" : "Accumulate gradually"}.`,
    )
    setIsAIAnalyzing(false)
  }

  const handleTrade = () => {
    if (!selectedToken || !amount || !wallet) return

    const sourceChain = wallet.chain
    const crossChainInfo = detectCrossChain(sourceChain, targetChain)

    const orderData = {
      type: tradeType,
      token: selectedToken,
      amount: Number.parseFloat(amount),
      price: selectedToken.price,
      total: Number.parseFloat(amount) * selectedToken.price,
      chain: targetChain,
      isCrossChain: crossChainInfo.isCrossChain,
      sourceChain: sourceChain,
      targetChain: targetChain,
    }

    const typedData = buildTradeOrderTypedData(orderData, wallet.address, wallet.chainId)

    setSignatureData(typedData)
    setOrderSourceChain(sourceChain)
    setOrderTargetChain(targetChain)
    setIntentSummary(
      `You are authorizing a ${tradeType.toUpperCase()} order for ${amount} ${selectedToken.symbol} at $${selectedToken.price.toFixed(2)} per token. Total: $${(Number.parseFloat(amount) * selectedToken.price).toLocaleString()}.${crossChainInfo.isCrossChain ? ` This is a cross-chain transaction from ${sourceChain} to ${targetChain}.` : ""}`,
    )
    setShowSignature(true)
  }

  const handleCopyTrader = (trader: TopTrader) => {
    if (!wallet) return

    const typedData = buildCopyTradingTypedData(trader.address, wallet.address, 10000, wallet.chainId)

    setSignatureData(typedData)
    setOrderSourceChain(undefined)
    setOrderTargetChain(undefined)
    setIntentSummary(
      `You are authorizing copy-trading from ${trader.name}. This will mirror their trades with a maximum allocation of $10,000. You can cancel at any time.`,
    )
    setShowSignature(true)
  }

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token)
    setShowMobileTradePanel(true)
  }

  if (!isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">Connect your wallet to start trading</p>
          <Button onClick={() => setShowWalletModal(true)} className="bg-primary text-primary-foreground rounded-full">
            Connect Wallet
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground text-xl sm:text-2xl md:text-3xl font-semibold">Trading</h1>
        <p className="text-muted-foreground text-sm mt-1">AI-powered trading with gasless transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Market Overview */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tokens..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          {/* Token List */}
          <div className="rounded-xl sm:rounded-2xl bg-card border border-border overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-border">
              <h2 className="text-foreground font-semibold text-sm sm:text-base">Market</h2>
            </div>
            <div className="divide-y divide-border max-h-[300px] sm:max-h-[400px] overflow-y-auto">
              {filteredTokens.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => handleTokenSelect(token)}
                  className={`w-full flex items-center justify-between p-3 sm:p-4 hover:bg-muted/30 transition-colors ${
                    selectedToken?.symbol === token.symbol ? "bg-primary/5 border-l-2 border-l-primary" : ""
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-semibold text-xs sm:text-sm">{token.symbol.slice(0, 2)}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-foreground font-medium text-sm sm:text-base">{token.symbol}</p>
                      <p className="text-muted-foreground text-xs sm:text-sm capitalize">{token.chain}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground font-medium text-sm sm:text-base">${token.price.toLocaleString()}</p>
                    <p
                      className={`text-xs sm:text-sm flex items-center justify-end gap-1 ${
                        token.change24h >= 0 ? "text-primary" : "text-destructive"
                      }`}
                    >
                      {token.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {token.change24h >= 0 ? "+" : ""}
                      {token.change24h.toFixed(2)}%
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Copy Trading Section */}
          <div className="rounded-xl sm:rounded-2xl bg-card border border-border overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-border flex items-center gap-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <h2 className="text-foreground font-semibold text-sm sm:text-base">Copy Trading</h2>
            </div>
            <div className="divide-y divide-border">
              {TOP_TRADERS.map((trader) => (
                <div key={trader.address} className="p-3 sm:p-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-semibold text-xs sm:text-sm">{trader.name.slice(0, 2)}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-foreground font-medium text-sm sm:text-base truncate">{trader.name}</p>
                      <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm flex-wrap">
                        <span className="text-primary">+{trader.pnlPercent}%</span>
                        <span className="text-muted-foreground hidden sm:inline">Win: {trader.winRate}%</span>
                        <span
                          className={`px-1 sm:px-1.5 py-0.5 rounded text-[10px] sm:text-xs ${
                            trader.riskScore <= 40
                              ? "bg-primary/10 text-primary"
                              : trader.riskScore <= 60
                                ? "bg-yellow-400/10 text-yellow-400"
                                : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          Risk: {trader.riskScore}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleCopyTrader(trader)}
                    variant="outline"
                    size="sm"
                    className="border-primary/20 text-primary hover:bg-primary/10 rounded-full text-xs sm:text-sm shrink-0"
                  >
                    Mirror
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trade Panel - Desktop */}
        <div className="hidden lg:block space-y-4">
          <TradePanel
            selectedToken={selectedToken}
            tradeType={tradeType}
            setTradeType={setTradeType}
            amount={amount}
            setAmount={setAmount}
            targetChain={targetChain}
            setTargetChain={setTargetChain}
            wallet={wallet}
            isAIAnalyzing={isAIAnalyzing}
            aiRecommendation={aiRecommendation}
            handleAIAnalysis={handleAIAnalysis}
            handleTrade={handleTrade}
          />
        </div>
      </div>

      {/* Mobile Trade Panel - Slide up */}
      {showMobileTradePanel && selectedToken && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setShowMobileTradePanel(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border rounded-t-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h3 className="text-foreground font-semibold">Trade {selectedToken.symbol}</h3>
              <button
                onClick={() => setShowMobileTradePanel(false)}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4">
              <TradePanel
                selectedToken={selectedToken}
                tradeType={tradeType}
                setTradeType={setTradeType}
                amount={amount}
                setAmount={setAmount}
                targetChain={targetChain}
                setTargetChain={setTargetChain}
                wallet={wallet}
                isAIAnalyzing={isAIAnalyzing}
                aiRecommendation={aiRecommendation}
                handleAIAnalysis={handleAIAnalysis}
                handleTrade={handleTrade}
                onClose={() => setShowMobileTradePanel(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      <SignatureModal
        isOpen={showSignature}
        onClose={() => setShowSignature(false)}
        typedData={signatureData}
        userAddress={wallet?.address || ""}
        chain={wallet?.chain || "ethereum"}
        sourceChain={orderSourceChain}
        targetChain={orderTargetChain}
        intentSummary={intentSummary}
        onSuccess={(txHash) => {
          setAmount("")
          setSelectedToken(null)
          setAIRecommendation(null)
          setShowMobileTradePanel(false)
        }}
      />
    </div>
  )
}

function TradePanel({
  selectedToken,
  tradeType,
  setTradeType,
  amount,
  setAmount,
  targetChain,
  setTargetChain,
  wallet,
  isAIAnalyzing,
  aiRecommendation,
  handleAIAnalysis,
  handleTrade,
  onClose,
}: {
  selectedToken: Token | null
  tradeType: "buy" | "sell"
  setTradeType: (type: "buy" | "sell") => void
  amount: string
  setAmount: (amount: string) => void
  targetChain: ChainType
  setTargetChain: (chain: ChainType) => void
  wallet: any
  isAIAnalyzing: boolean
  aiRecommendation: string | null
  handleAIAnalysis: () => void
  handleTrade: () => void
  onClose?: () => void
}) {
  if (!selectedToken) {
    return (
      <div className="rounded-xl sm:rounded-2xl bg-card border border-border p-4 sm:p-6 text-center">
        <p className="text-muted-foreground text-sm">Select a token to trade</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl sm:rounded-2xl bg-card border border-border p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm sm:text-base">{selectedToken.symbol.slice(0, 2)}</span>
          </div>
          <div>
            <p className="text-foreground text-base sm:text-lg font-semibold">{selectedToken.symbol}</p>
            <p className="text-muted-foreground text-xs sm:text-sm">{selectedToken.name}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-foreground text-base sm:text-lg font-semibold">${selectedToken.price.toLocaleString()}</p>
          <p className={`text-xs sm:text-sm ${selectedToken.change24h >= 0 ? "text-primary" : "text-destructive"}`}>
            {selectedToken.change24h >= 0 ? "+" : ""}
            {selectedToken.change24h.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* AI Analysis */}
      <div className="p-3 sm:p-4 rounded-xl bg-muted/30 border border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-foreground text-xs sm:text-sm font-medium">AI Analysis</span>
          </div>
          <Button
            onClick={handleAIAnalysis}
            size="sm"
            variant="ghost"
            disabled={isAIAnalyzing}
            className="text-primary hover:text-primary/80 text-xs h-7"
          >
            {isAIAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : "Analyze"}
          </Button>
        </div>
        <p className="text-muted-foreground text-xs sm:text-sm">
          {aiRecommendation || "Click Analyze for AI-powered trading insights"}
        </p>
      </div>

      {/* Trade Type */}
      <div className="flex gap-2">
        <button
          onClick={() => setTradeType("buy")}
          className={`flex-1 py-2 sm:py-2.5 rounded-xl font-medium transition-colors text-sm ${
            tradeType === "buy"
              ? "bg-primary text-primary-foreground"
              : "bg-muted/50 text-muted-foreground hover:text-foreground"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setTradeType("sell")}
          className={`flex-1 py-2 sm:py-2.5 rounded-xl font-medium transition-colors text-sm ${
            tradeType === "sell"
              ? "bg-destructive text-destructive-foreground"
              : "bg-muted/50 text-muted-foreground hover:text-foreground"
          }`}
        >
          Sell
        </button>
      </div>

      {/* Amount Input */}
      <div>
        <label className="text-muted-foreground text-xs sm:text-sm mb-1.5 block">Amount</label>
        <input
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        />
      </div>

      {/* Target Chain */}
      <div>
        <label className="text-muted-foreground text-xs sm:text-sm mb-1.5 block">Target Chain</label>
        <select
          value={targetChain}
          onChange={(e) => setTargetChain(e.target.value as ChainType)}
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        >
          <option value="ethereum">Ethereum</option>
          <option value="polygon">Polygon</option>
          <option value="arbitrum">Arbitrum</option>
          <option value="optimism">Optimism</option>
          <option value="bsc">BSC</option>
          <option value="solana">Solana</option>
        </select>
      </div>

      {/* Cross-chain Warning */}
      {wallet && wallet.chain !== targetChain && (
        <div className="p-2.5 sm:p-3 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-400 text-xs sm:text-sm font-medium">Cross-Chain Transaction</p>
            <p className="text-muted-foreground text-[10px] sm:text-xs mt-0.5 flex items-center gap-1">
              <span className="capitalize">{wallet.chain}</span>
              <ArrowRight className="w-3 h-3" />
              <span className="capitalize">{targetChain}</span>
            </p>
          </div>
        </div>
      )}

      {/* Total */}
      {amount && (
        <div className="p-2.5 sm:p-3 rounded-xl bg-muted/30 border border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="text-foreground font-medium">
              ${(Number.parseFloat(amount) * selectedToken.price).toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Trade Button */}
      <Button
        onClick={handleTrade}
        disabled={!amount || Number.parseFloat(amount) <= 0}
        className={`w-full py-2.5 sm:py-3 rounded-xl font-medium ${
          tradeType === "buy"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
        }`}
      >
        {tradeType === "buy" ? "Buy" : "Sell"} {selectedToken.symbol}
      </Button>

      <p className="text-center text-muted-foreground text-[10px] sm:text-xs">Gasless transaction via relayer</p>
    </div>
  )
}
