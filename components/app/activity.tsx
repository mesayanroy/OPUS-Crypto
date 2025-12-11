"use client"

import { useWeb3 } from "@/lib/web3/context"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, AlertTriangle, ActivityIcon, Users, Filter, Bell } from "lucide-react"
import { useState } from "react"

export function AppActivity() {
  const { isConnected, activityLog, orders, setShowWalletModal } = useWeb3()
  const [filter, setFilter] = useState<"all" | "trade" | "liquidation" | "whale" | "alert">("all")

  const filteredLogs = filter === "all" ? activityLog : activityLog.filter((log) => log.type === filter)

  if (!isConnected) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="text-center">
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">Connect your wallet to view activity</p>
          <Button onClick={() => setShowWalletModal(true)} className="bg-primary text-primary-foreground rounded-full">
            Connect Wallet
          </Button>
        </div>
      </div>
    )
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "trade":
        return <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
      case "liquidation":
        return <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-destructive" />
      case "whale":
        return <TrendingDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-400" />
      case "copy":
        return <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
      default:
        return <ActivityIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
    }
  }

  const getActivityBg = (type: string) => {
    switch (type) {
      case "trade":
        return "bg-primary/10"
      case "liquidation":
        return "bg-destructive/10"
      case "whale":
        return "bg-yellow-400/10"
      case "copy":
        return "bg-blue-400/10"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-foreground text-xl sm:text-2xl md:text-3xl font-semibold">Activity</h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor trades, alerts, and market events</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-border text-foreground hover:bg-muted/50 rounded-xl bg-transparent self-start sm:self-auto"
        >
          <Bell className="w-4 h-4 mr-2" />
          Notifications
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
        {[
          { id: "all" as const, label: "All" },
          { id: "trade" as const, label: "Trades" },
          { id: "liquidation" as const, label: "Liquidations" },
          { id: "whale" as const, label: "Whale" },
          { id: "alert" as const, label: "Alerts" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              filter === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Activity Feed */}
        <div className="lg:col-span-2">
          <div className="rounded-xl sm:rounded-2xl bg-card border border-border overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-foreground font-semibold text-sm sm:text-base">Activity Feed</h2>
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground h-8 w-8 p-0">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            <div className="divide-y divide-border max-h-[400px] sm:max-h-[500px] overflow-y-auto">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 sm:p-4 flex items-start gap-3 sm:gap-4 hover:bg-muted/20 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${getActivityBg(log.type)}`}
                    >
                      {getActivityIcon(log.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm sm:text-base">{log.message}</p>
                      <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                        {new Date(log.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`hidden sm:inline-block px-2 py-1 rounded-full text-xs font-medium capitalize shrink-0 ${
                        log.type === "trade"
                          ? "bg-primary/10 text-primary"
                          : log.type === "liquidation"
                            ? "bg-destructive/10 text-destructive"
                            : log.type === "whale"
                              ? "bg-yellow-400/10 text-yellow-400"
                              : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {log.type}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-6 sm:p-8 text-center">
                  <p className="text-muted-foreground text-sm">No activity to show</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order History & Alerts */}
        <div className="space-y-4">
          <div className="rounded-xl sm:rounded-2xl bg-card border border-border overflow-hidden">
            <div className="p-3 sm:p-4 border-b border-border">
              <h2 className="text-foreground font-semibold text-sm sm:text-base">Recent Orders</h2>
            </div>
            <div className="divide-y divide-border max-h-[250px] overflow-y-auto">
              {orders.length > 0 ? (
                orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium ${
                            order.type === "buy" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {order.type.toUpperCase()}
                        </span>
                        <span className="text-foreground font-medium text-sm">{order.token.symbol}</span>
                      </div>
                      <span
                        className={`text-[10px] sm:text-xs ${
                          order.status === "confirmed"
                            ? "text-primary"
                            : order.status === "pending"
                              ? "text-yellow-400"
                              : "text-destructive"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">{order.amount} tokens</span>
                      <span className="text-foreground">${order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 sm:p-6 text-center">
                  <p className="text-muted-foreground text-xs sm:text-sm">No orders yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Alerts Panel */}
          <div className="rounded-xl sm:rounded-2xl bg-card border border-border p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <h3 className="text-foreground font-semibold text-sm sm:text-base">Active Alerts</h3>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-yellow-400/10 border border-yellow-400/20">
                <p className="text-yellow-400 text-xs sm:text-sm font-medium">ETH Price Alert</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs mt-1">Notify when ETH drops below $3,000</p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-destructive/10 border border-destructive/20">
                <p className="text-destructive text-xs sm:text-sm font-medium">Liquidation Warning</p>
                <p className="text-muted-foreground text-[10px] sm:text-xs mt-1">BTC position at 85% margin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
