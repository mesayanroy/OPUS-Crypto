"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAptos } from "@/lib/web3/aptos-context"
import { agentStorage } from "@/lib/web3/agent-storage"
import { AIAgent } from "@/lib/web3/aptos-agent-types"
import { ActivityLog } from "@/components/dashboard/activity-panel"
import { Wallet, Zap, TrendingUp, Settings } from "lucide-react"

export function WalletBoundDashboard() {
  const { user, walletAddress, nativeBalance, balances, refreshBalances } = useAptos()
  const [agents, setAgents] = useState<AIAgent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!walletAddress) return

    const loadAgents = async () => {
      setLoading(true)
      try {
        const userAgents = await agentStorage.getAgentsForWallet(walletAddress)
        setAgents(userAgents)
      } finally {
        setLoading(false)
      }
    }

    loadAgents()
  }, [walletAddress])

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">Please connect your wallet to view dashboard</p>
      </div>
    )
  }

  const activeAgents = agents.filter((a) => a.status === "active").length
  const totalPnl = agents.reduce((sum, a) => sum + a.performance.totalPnl, 0)

  return (
    <div className="space-y-6">
      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Wallet Address Card */}
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Connected Wallet
            </h3>
          </div>
          <p className="font-mono text-sm break-all">{walletAddress?.slice(0, 10)}...{walletAddress?.slice(-8)}</p>
        </Card>

        {/* APT Balance */}
        <Card className="p-6 space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">APT Balance</h3>
          <p className="text-2xl font-semibold">{(Number(nativeBalance) / 1e8).toFixed(2)} APT</p>
          <Button
            onClick={refreshBalances}
            variant="ghost"
            size="sm"
            className="text-xs h-auto p-0 text-primary"
          >
            Refresh
          </Button>
        </Card>

        {/* Active Agents */}
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Active Agents
            </h3>
          </div>
          <p className="text-2xl font-semibold">{activeAgents}</p>
          <p className="text-xs text-muted-foreground">{agents.length} total agents</p>
        </Card>

        {/* Portfolio PnL */}
        <Card className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total PnL
            </h3>
          </div>
          <p className={`text-2xl font-semibold ${totalPnl >= 0 ? "text-green-500" : "text-red-500"}`}>
            {totalPnl >= 0 ? "+" : ""}
            {totalPnl.toFixed(2)} APT
          </p>
        </Card>
      </div>

      {/* Agents Section */}
      <Card className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Your AI Trading Agents
          </h2>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading agents...</p>
        ) : agents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No agents created yet. Create your first AI trading agent to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {agents.map((agent) => (
              <div key={agent.id} className="p-4 border rounded-lg hover:bg-muted/30 transition space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{agent.name}</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        agent.status === "active"
                          ? "bg-green-500/20 text-green-700"
                          : "bg-gray-500/20 text-gray-700"
                      }`}
                    >
                      {agent.status.toUpperCase()}
                    </span>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-4 text-xs gap-2 pt-2 border-t">
                  <div>
                    <p className="text-muted-foreground">Executions</p>
                    <p className="font-medium">{agent.performance.totalExecutions}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Success Rate</p>
                    <p className="font-medium">
                      {agent.performance.totalExecutions === 0
                        ? "0%"
                        : (
                            (agent.performance.successfulTrades /
                              (agent.performance.successfulTrades + agent.performance.failedTrades)) *
                            100
                          ).toFixed(0) + "%"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">PnL</p>
                    <p className={`font-medium ${agent.performance.totalPnl >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {agent.performance.totalPnl >= 0 ? "+" : ""}
                      {agent.performance.totalPnl.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ROI</p>
                    <p className="font-medium">{agent.performance.roi.toFixed(2)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Activity */}
      <Card className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <div className="text-sm text-muted-foreground text-center py-8">
          No recent activity. Create and activate an agent to see execution logs here.
        </div>
      </Card>
    </div>
  )
}
