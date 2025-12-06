"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useWeb3 } from "@/lib/web3/context"
import {
  Wallet,
  ChevronDown,
  Copy,
  ExternalLink,
  LogOut,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Check,
  Loader2,
  RefreshCw,
} from "lucide-react"

export function WalletDropdown() {
  const { wallet, isConnected, isConnecting, setShowWalletModal, disconnectWallet, totalValue, tokens, activityLog } =
    useWeb3()
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"assets" | "activity">("assets")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleCopyAddress = async () => {
    if (wallet?.address) {
      await navigator.clipboard.writeText(wallet.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getExplorerUrl = () => {
    if (!wallet) return "#"
    const explorers: Record<string, string> = {
      ethereum: "https://etherscan.io/address/",
      polygon: "https://polygonscan.com/address/",
      arbitrum: "https://arbiscan.io/address/",
      optimism: "https://optimistic.etherscan.io/address/",
      bsc: "https://bscscan.com/address/",
      solana: "https://solscan.io/account/",
      flow: "https://flowscan.org/account/",
      aptos: "https://explorer.aptoslabs.com/account/",
    }
    return `${explorers[wallet.chain] || explorers.ethereum}${wallet.address}`
  }

  const getWalletIcon = () => {
    if (!wallet) return null
    const icons: Record<string, string> = {
      metamask: "/metamask-fox-logo-orange.jpg",
      phantom: "/phantom-purple-ghost-logo.jpg",
      coinbase: "/coinbase-blue-circle-logo.jpg",
      walletconnect: "/walletconnect-blue-logo.png",
      solflare: "/solflare-orange-sun-logo.png",
      flow: "/flow-green-logo-blockchain.jpg",
      petra: "/petra-aptos-red-logo.jpg",
    }
    return icons[wallet.type]
  }

  if (!isConnected) {
    return (
      <Button
        onClick={() => setShowWalletModal(true)}
        disabled={isConnecting}
        className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4 sm:px-6 py-2 font-medium text-sm transition-all duration-300 hover:shadow-[0_0_20px_rgba(120,252,214,0.3)]"
      >
        {isConnecting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="hidden sm:inline">Connecting...</span>
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            <span className="hidden sm:inline">Connect Wallet</span>
            <span className="sm:hidden">Connect</span>
          </span>
        )}
      </Button>
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Connected Wallet Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 rounded-full bg-card/50 border border-border hover:border-primary/30 transition-all duration-300 group"
      >
        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              src={getWalletIcon() || "/placeholder.svg"}
              alt={wallet?.type}
              className="w-6 h-6 rounded-full object-cover"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-background" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-foreground text-sm font-medium">
              {wallet?.address.slice(0, 6)}...{wallet?.address.slice(-4)}
            </p>
            <p className="text-muted-foreground text-xs capitalize">{wallet?.chain}</p>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-border bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header with Balance */}
          <div className="p-4 bg-gradient-to-br from-primary/10 to-transparent border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <img
                  src={getWalletIcon() || "/placeholder.svg"}
                  alt={wallet?.type}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-foreground text-sm font-medium capitalize">{wallet?.type} Wallet</p>
                  <p className="text-muted-foreground text-xs capitalize">{wallet?.chain} Network</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopyAddress}
                  className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                  title="Copy address"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <a
                  href={getExplorerUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-muted/50 transition-colors"
                  title="View on explorer"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              </div>
            </div>

            <div className="text-center py-2">
              <p className="text-muted-foreground text-xs mb-1">Total Balance</p>
              <p className="text-foreground text-2xl font-bold">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>

            {/* Cash In / Cash Out Buttons */}
            <div className="flex gap-2 mt-3">
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors text-sm font-medium">
                <ArrowDownLeft className="w-4 h-4" />
                Cash In
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-muted/50 text-foreground hover:bg-muted transition-colors text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
                Cash Out
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab("assets")}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                activeTab === "assets"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Assets
            </button>
            <button
              onClick={() => setActiveTab("activity")}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors flex items-center justify-center gap-1.5 ${
                activeTab === "activity"
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Activity
            </button>
          </div>

          {/* Content */}
          <div className="max-h-64 overflow-y-auto">
            {activeTab === "assets" ? (
              <div className="p-2">
                {tokens.slice(0, 5).map((token, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                        {token.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-foreground text-sm font-medium">{token.symbol}</p>
                        <p className="text-muted-foreground text-xs">{token.balance.toFixed(4)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-foreground text-sm font-medium">${token.value.toFixed(2)}</p>
                      <p className={`text-xs ${token.change24h >= 0 ? "text-primary" : "text-destructive"}`}>
                        {token.change24h >= 0 ? "+" : ""}
                        {token.change24h.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-2">
                {activityLog.slice(0, 5).map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        log.type === "trade"
                          ? "bg-primary/20 text-primary"
                          : log.type === "liquidation"
                            ? "bg-destructive/20 text-destructive"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {log.type === "trade" ? <RefreshCw className="w-4 h-4" /> : <History className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm truncate">{log.message}</p>
                      <p className="text-muted-foreground text-xs">{new Date(log.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border">
            <button
              onClick={() => {
                disconnectWallet()
                setIsOpen(false)
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Disconnect Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
