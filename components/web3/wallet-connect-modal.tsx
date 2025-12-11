"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Loader2, ExternalLink, ChevronRight, Download, Smartphone } from "lucide-react"
import { useWeb3 } from "@/lib/web3/context"
import type { WalletType, WalletInfo } from "@/lib/web3/types"

const WALLETS: WalletInfo[] = [
  {
    type: "metamask",
    name: "MetaMask",
    icon: "/metamask-fox-logo-orange.jpg",
    chains: ["ethereum", "polygon", "arbitrum", "optimism", "bsc"],
  },
  {
    type: "walletconnect",
    name: "WalletConnect",
    icon: "/walletconnect-blue-logo.png",
    chains: ["ethereum", "polygon", "arbitrum", "optimism", "bsc"],
  },
  {
    type: "coinbase",
    name: "Coinbase Wallet",
    icon: "/coinbase-blue-circle-logo.jpg",
    chains: ["ethereum", "polygon", "arbitrum", "optimism", "bsc"],
  },
  {
    type: "phantom",
    name: "Phantom",
    icon: "/phantom-purple-ghost-logo.jpg",
    chains: ["solana", "ethereum", "polygon"],
  },
  {
    type: "solflare",
    name: "Solflare",
    icon: "/solflare-orange-sun-logo.png",
    chains: ["solana"],
  },
  {
    type: "flow",
    name: "Flow Wallet",
    icon: "/flow-green-logo-blockchain.jpg",
    chains: ["flow"],
  },
  {
    type: "petra",
    name: "Petra (Aptos)",
    icon: "/petra-aptos-red-logo.jpg",
    chains: ["aptos"],
  },
]

export function WalletConnectModal() {
  const { showWalletModal, setShowWalletModal, connectWallet, isConnecting, checkWalletInstalled } = useWeb3()
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showMobileOptions, setShowMobileOptions] = useState(false)

  if (!showWalletModal) return null

  const handleConnect = async (type: WalletType) => {
    setSelectedWallet(type)
    setError(null)

    const success = await connectWallet(type)
    if (!success) {
      const installed = checkWalletInstalled(type)
      if (!installed && type !== "walletconnect") {
        setError(`${WALLETS.find((w) => w.type === type)?.name} is not installed. Please install it first.`)
      } else {
        setError("Connection failed. Please try again.")
      }
    }
    setSelectedWallet(null)
  }

  const handleClose = () => {
    if (!isConnecting) {
      setShowWalletModal(false)
      setError(null)
      setSelectedWallet(null)
      setShowMobileOptions(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md rounded-2xl border border-border overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="absolute inset-0 bg-card/95 backdrop-blur-xl" />

        <div className="relative p-4 sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-foreground text-lg sm:text-xl font-semibold">Connect Wallet</h2>
              <p className="text-muted-foreground text-xs sm:text-sm mt-1">
                Select a wallet to connect to the platform
              </p>
            </div>
            <Button
              onClick={handleClose}
              variant="ghost"
              size="sm"
              disabled={isConnecting}
              className="text-muted-foreground hover:text-foreground -mr-2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2">
              <span className="flex-1">{error}</span>
              {error.includes("not installed") && (
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="shrink-0 flex items-center gap-1 text-primary hover:underline"
                >
                  <Download className="w-3 h-3" />
                  Install
                </a>
              )}
            </div>
          )}

          {/* Mobile Toggle */}
          <div className="mb-4 sm:hidden">
            <button
              onClick={() => setShowMobileOptions(!showMobileOptions)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border text-sm"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <Smartphone className="w-4 h-4" />
                On mobile? Use WalletConnect
              </span>
              <ChevronRight
                className={`w-4 h-4 text-muted-foreground transition-transform ${showMobileOptions ? "rotate-90" : ""}`}
              />
            </button>
          </div>

          {/* Wallet List */}
          <div className="space-y-2 max-h-[50vh] sm:max-h-[400px] overflow-y-auto pr-1">
            {WALLETS.map((wallet) => {
              const isLoading = isConnecting && selectedWallet === wallet.type
              const isInstalled = checkWalletInstalled(wallet.type) || wallet.type === "walletconnect"

              return (
                <button
                  key={wallet.type}
                  onClick={() => handleConnect(wallet.type)}
                  disabled={isConnecting}
                  className="w-full flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-background flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={wallet.icon || "/placeholder.svg"}
                      alt={wallet.name}
                      className="w-7 h-7 sm:w-8 sm:h-8 object-contain"
                    />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-foreground font-medium text-sm sm:text-base truncate">{wallet.name}</p>
                      {isInstalled && wallet.type !== "walletconnect" && (
                        <span className="shrink-0 px-1.5 py-0.5 rounded text-[10px] bg-primary/20 text-primary font-medium">
                          Installed
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-xs truncate">
                      {wallet.chains
                        .slice(0, 3)
                        .map((c) => c.charAt(0).toUpperCase() + c.slice(1))
                        .join(", ")}
                      {wallet.chains.length > 3 && ` +${wallet.chains.length - 3}`}
                    </p>
                  </div>
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="mt-4 sm:mt-6 pt-4 border-t border-border">
            <p className="text-muted-foreground text-xs text-center">
              By connecting, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>

          {/* New to Web3 */}
          <div className="mt-4 p-3 sm:p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-foreground text-sm font-medium mb-1">New to Web3?</p>
            <p className="text-muted-foreground text-xs mb-2">
              Learn how to set up a wallet and start trading securely
            </p>
            <a
              href="https://ethereum.org/wallets"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary text-xs hover:underline"
            >
              Learn more <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
