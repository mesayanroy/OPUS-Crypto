"use client"

import { useState } from "react"
import { useWeb3 } from "@/lib/web3/context"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp, TrendingDown, Search, Filter, AlertTriangle } from "lucide-react"

export function AppPortfolio() {
  const { isConnected, tokens, totalValue, totalPnl, refreshPortfolio, setShowWalletModal } = useWeb3()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshPortfolio()
    setIsRefreshing(false)
  }

  const filteredTokens = tokens.filter(
    (token) =>
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (!isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">Connect your wallet to view portfolio</p>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-foreground text-xl sm:text-2xl md:text-3xl font-semibold">Portfolio</h1>
          <p className="text-muted-foreground text-sm mt-1">Track your holdings and performance</p>
        </div>
        <Button
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          className="border-border text-foreground hover:bg-muted/50 rounded-xl bg-transparent self-start sm:self-auto"
          disabled={isRefreshing}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-card border border-border">
          <p className="text-muted-foreground text-xs sm:text-sm">Total Value</p>
          <p className="text-foreground text-xl sm:text-2xl font-semibold mt-1">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-card border border-border">
          <p className="text-muted-foreground text-xs sm:text-sm">24h Change</p>
          <div className="flex items-center gap-2 mt-1">
            {totalPnl >= 0 ? (
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            ) : (
              <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-destructive" />
            )}
            <p className={`text-xl sm:text-2xl font-semibold ${totalPnl >= 0 ? "text-primary" : "text-destructive"}`}>
              {totalPnl >= 0 ? "+" : ""}${Math.abs(totalPnl).toFixed(2)}
            </p>
          </div>
        </div>
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-card border border-border">
          <p className="text-muted-foreground text-xs sm:text-sm">Assets</p>
          <p className="text-foreground text-xl sm:text-2xl font-semibold mt-1">{tokens.length}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-foreground hover:bg-muted/50 rounded-xl bg-transparent"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Token List */}
      <div className="rounded-xl sm:rounded-2xl bg-card border border-border overflow-hidden">
        <div className="hidden md:grid grid-cols-6 gap-4 px-4 sm:px-6 py-3 border-b border-border bg-muted/30">
          <p className="text-muted-foreground text-sm font-medium col-span-2">Asset</p>
          <p className="text-muted-foreground text-sm font-medium text-right">Price</p>
          <p className="text-muted-foreground text-sm font-medium text-right">24h Change</p>
          <p className="text-muted-foreground text-sm font-medium text-right">Holdings</p>
          <p className="text-muted-foreground text-sm font-medium text-right">Value</p>
        </div>
        <div className="divide-y divide-border">
          {filteredTokens.map((token) => (
            <div
              key={token.symbol}
              className="flex flex-wrap md:grid md:grid-cols-6 gap-2 md:gap-4 px-4 sm:px-6 py-3 sm:py-4 hover:bg-muted/30 transition-colors"
            >
              {/* Asset */}
              <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto md:col-span-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-semibold text-xs sm:text-sm">{token.symbol.slice(0, 2)}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground font-medium text-sm sm:text-base">{token.symbol}</p>
                  <p className="text-muted-foreground text-xs sm:text-sm truncate">{token.name}</p>
                </div>
                {/* Mobile: Show value on same row */}
                <div className="md:hidden text-right">
                  <p className="text-foreground font-medium text-sm">${token.value.toLocaleString()}</p>
                  <span
                    className={`inline-flex items-center gap-1 text-xs ${
                      token.change24h >= 0 ? "text-primary" : "text-destructive"
                    }`}
                  >
                    {token.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {token.change24h >= 0 ? "+" : ""}
                    {token.change24h.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Price - Desktop only */}
              <div className="text-right hidden md:block">
                <p className="text-foreground">${token.price.toLocaleString()}</p>
              </div>

              {/* 24h Change - Desktop only */}
              <div className="text-right hidden md:block">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                    token.change24h >= 0 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {token.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {token.change24h >= 0 ? "+" : ""}
                  {token.change24h.toFixed(2)}%
                </span>
              </div>

              {/* Holdings - Desktop only */}
              <div className="text-right hidden md:block">
                <p className="text-foreground">{token.balance.toLocaleString()}</p>
                <p className="text-muted-foreground text-sm">{token.symbol}</p>
              </div>

              {/* Value - Desktop only */}
              <div className="text-right hidden md:block">
                <p className="text-foreground font-medium">${token.value.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Warning */}
      <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-start gap-2 sm:gap-3">
        <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-yellow-400 font-medium text-sm sm:text-base">Portfolio Risk Notice</p>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1">
            Cryptocurrency investments are volatile. Monitor your positions regularly and consider setting stop-losses.
          </p>
        </div>
      </div>
    </div>
  )
}
