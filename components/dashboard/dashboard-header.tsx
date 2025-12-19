"use client"

import { Button } from "@/components/ui/button"
import { Wallet, ChevronDown, Zap } from "lucide-react"
import { useWeb3 } from "@/lib/web3/context"

export function DashboardHeader() {
  const { wallet, isConnected, isConnecting, setShowWalletModal, disconnectWallet } = useWeb3()

  const handleConnect = () => {
    setShowWalletModal(true)
  }

  const handleDisconnect = () => {
    disconnectWallet()
  }

  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-foreground font-semibold text-lg">AI Trading Bot</h1>
            <p className="text-muted-foreground text-xs">Web3 Dashboard</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="#portfolio" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Portfolio
          </a>
          <a href="#scanner" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            AI Scanner
          </a>
          <a href="#copy-trading" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Copy Trading
          </a>
          <a href="#activity" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
            Activity
          </a>
        </nav>

        {/* Wallet Connect */}
        {isConnected && wallet ? (
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-foreground text-sm font-medium">
                {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
              </span>
            </div>
            <Button
              onClick={handleDisconnect}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={isConnecting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 py-2 font-medium text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(120,252,214,0.3)]"
          >
            {isConnecting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Connecting...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Connect Wallet
              </span>
            )}
          </Button>
        )}
      </div>
    </header>
  )
}
