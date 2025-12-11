"use client"

import { useWeb3 } from "@/lib/web3/context"
import { TrendingUp, TrendingDown, Wallet, Activity, Users, AlertTriangle } from "lucide-react"

export function AppDashboard() {
  const { isConnected, totalValue, totalPnl, tokens, activityLog, setShowWalletModal } = useWeb3()

  if (!isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <Wallet className="w-8 h-8 sm:w-10 sm:h-10 text-primary" />
          </div>
          <h2 className="text-foreground text-xl sm:text-2xl font-semibold mb-2 sm:mb-3">Connect Your Wallet</h2>
          <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
            Connect your Web3 wallet to access portfolio tracking, AI-powered trading, and copy-trading features.
          </p>
          <button
            onClick={() => setShowWalletModal(true)}
            className="px-6 sm:px-8 py-2.5 sm:py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors text-sm sm:text-base"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

  const stats = [
    {
      label: "Portfolio Value",
      value: `$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      change: totalPnl,
      icon: Wallet,
    },
    {
      label: "24h PnL",
      value: `${totalPnl >= 0 ? "+" : ""}$${Math.abs(totalPnl).toFixed(2)}`,
      change: (totalPnl / totalValue) * 100,
      icon: totalPnl >= 0 ? TrendingUp : TrendingDown,
    },
    {
      label: "Active Positions",
      value: tokens.length.toString(),
      change: 0,
      icon: Activity,
    },
    {
      label: "Copy Traders",
      value: "3",
      change: 12.5,
      icon: Users,
    },
  ]

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground text-xl sm:text-2xl md:text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your trading activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-card border border-border hover:border-primary/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
                {stat.change !== 0 && (
                  <span
                    className={`text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full ${
                      stat.change >= 0 ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {stat.change >= 0 ? "+" : ""}
                    {stat.change.toFixed(1)}%
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm">{stat.label}</p>
              <p className="text-foreground text-base sm:text-xl font-semibold mt-0.5 sm:mt-1 truncate">{stat.value}</p>
            </div>
          )
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Top Holdings */}
        <div className="lg:col-span-2 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card border border-border">
          <h2 className="text-foreground text-base sm:text-lg font-semibold mb-3 sm:mb-4">Top Holdings</h2>
          <div className="space-y-2 sm:space-y-3">
            {tokens.slice(0, 5).map((token) => (
              <div
                key={token.symbol}
                className="flex items-center justify-between p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold text-xs sm:text-sm">{token.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <p className="text-foreground font-medium text-sm sm:text-base">{token.symbol}</p>
                    <p className="text-muted-foreground text-xs sm:text-sm">{token.balance} tokens</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-foreground font-medium text-sm sm:text-base">${token.value.toLocaleString()}</p>
                  <p className={`text-xs sm:text-sm ${token.change24h >= 0 ? "text-primary" : "text-destructive"}`}>
                    {token.change24h >= 0 ? "+" : ""}
                    {token.change24h.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-card border border-border">
          <h2 className="text-foreground text-base sm:text-lg font-semibold mb-3 sm:mb-4">Recent Activity</h2>
          <div className="space-y-2 sm:space-y-3">
            {activityLog.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start gap-2 sm:gap-3">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    log.type === "trade"
                      ? "bg-primary/10"
                      : log.type === "liquidation"
                        ? "bg-destructive/10"
                        : log.type === "whale"
                          ? "bg-yellow-400/10"
                          : "bg-muted"
                  }`}
                >
                  {log.type === "liquidation" ? (
                    <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-destructive" />
                  ) : log.type === "trade" ? (
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  ) : (
                    <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-foreground text-xs sm:text-sm truncate">{log.message}</p>
                  <p className="text-muted-foreground text-[10px] sm:text-xs">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
