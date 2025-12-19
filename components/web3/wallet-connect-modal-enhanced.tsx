"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Loader2, ExternalLink, ChevronRight, Download, Wifi, Network } from "lucide-react"
import { useWeb3 } from "@/lib/web3/context"
import type { WalletType, WalletInfo } from "@/lib/web3/types"
// framer-motion removed to avoid build issues
import { CHAIN_CONFIGS, type ChainConfig } from "@/lib/web3/chain-config"

const WALLETS: WalletInfo[] = [
  {
    type: "metamask",
    name: "MetaMask",
    icon: "/metamask-fox-logo-orange.jpg",
    chains: ["ethereum", "polygon", "arbitrum", "optimism", "bsc"],
    description: "Most popular Ethereum wallet",
  },
  {
    type: "phantom",
    name: "Phantom",
    icon: "/phantom-purple-ghost-logo.jpg",
    chains: ["solana", "ethereum", "polygon"],
    description: "Multi-chain wallet with Solana support",
  },
  {
    type: "petra",
    name: "Petra Wallet",
    icon: "/petra-aptos-red-logo.jpg",
    chains: ["aptos"],
    description: "Official Aptos wallet",
  },
  {
    type: "coinbase",
    name: "Coinbase Wallet",
    icon: "/coinbase-blue-circle-logo.jpg",
    chains: ["ethereum", "polygon", "arbitrum", "optimism", "bsc"],
    description: "Trusted by millions worldwide",
  },
  {
    type: "solflare",
    name: "Solflare",
    icon: "/solflare-orange-sun-logo.png",
    chains: ["solana"],
    description: "Solana-first wallet",
  },
  {
    type: "walletconnect",
    name: "WalletConnect",
    icon: "/walletconnect-blue-logo.png",
    chains: ["ethereum", "polygon", "arbitrum", "optimism", "bsc"],
    description: "Connect any mobile wallet",
  },
]

export function WalletConnectModalEnhanced() {
  const { showWalletModal, setShowWalletModal, connectWallet, isConnecting, checkWalletInstalled } = useWeb3()
  const [selectedWallet, setSelectedWallet] = useState<WalletType | null>(null)
  const [selectedChain, setSelectedChain] = useState<keyof typeof CHAIN_CONFIGS | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<"wallet" | "chain">("wallet")

  if (!showWalletModal) return null

  const handleWalletSelect = (type: WalletType) => {
    const wallet = WALLETS.find((w) => w.type === type)
    if (!wallet) return

    // Check if wallet supports multiple chains
    const supportedChains = wallet.chains
    if (supportedChains.length > 1) {
      setSelectedWallet(type)
      setStep("chain")
    } else {
      // Direct connect for single-chain wallets
      handleConnect(type, supportedChains[0] as keyof typeof CHAIN_CONFIGS)
    }
  }

  const handleConnect = async (type: WalletType, chain?: keyof typeof CHAIN_CONFIGS) => {
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
      setSelectedWallet(null)
    } else {
      // Reset state on success
      setStep("wallet")
      setSelectedChain(null)
      setSelectedWallet(null)
    }
  }

  const handleClose = () => {
    if (!isConnecting) {
      setShowWalletModal(false)
      setError(null)
      setSelectedWallet(null)
      setSelectedChain(null)
      setStep("wallet")
    }
  }

  const getChainConfig = (chainName: string): ChainConfig | null => {
    const chainKey = Object.keys(CHAIN_CONFIGS).find(
      (key) => CHAIN_CONFIGS[key as keyof typeof CHAIN_CONFIGS].name.toLowerCase() === chainName.toLowerCase()
    )
    return chainKey ? CHAIN_CONFIGS[chainKey as keyof typeof CHAIN_CONFIGS] : null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with animation */}
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl border border-border/50 overflow-hidden shadow-2xl"
      >
        {/* Gradient overlay matching hero section */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-card to-primary/5 opacity-50" />
        <div className="absolute inset-0 bg-card/95 backdrop-blur-xl" />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-foreground text-xl font-semibold flex items-center gap-2">
                <Wifi className="w-5 h-5 text-primary" />
                {step === "wallet" ? "Connect Wallet" : "Select Network"}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {step === "wallet" 
                  ? "Choose your preferred Web3 wallet"
                  : `Select network for ${WALLETS.find(w => w.type === selectedWallet)?.name}`
                }
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
          <>
            {error && (
              <div
                className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2"
              >
                <span className="flex-1">{error}</span>
                {error.includes("not installed") && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="shrink-0 h-auto p-1 text-xs text-primary hover:underline"
                  >
                    <Download className="w-3 h-3 mr-1" />
                    Install
                  </Button>
                )}
              </div>
            )}
          </>

          {/* Content Area */}
          <>
            {step === "wallet" ? (
              <div
                key="wallet-list"
                className="space-y-2 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar"
              >
                {WALLETS.map((wallet) => {
                  const isInstalled = checkWalletInstalled(wallet.type)
                  const isLoading = isConnecting && selectedWallet === wallet.type

                  return (
                    <button
                      key={wallet.type}
                      onClick={() => handleWalletSelect(wallet.type)}
                      disabled={isConnecting}
                      className="w-full group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="relative flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/50 transition-all">
                        {/* Wallet Icon */}
                        <div className="w-12 h-12 rounded-xl bg-background/50 flex items-center justify-center overflow-hidden shadow-sm">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                            {wallet.name.charAt(0)}
                          </div>
                        </div>

                        {/* Wallet Info */}
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-foreground font-medium">{wallet.name}</span>
                            {!isInstalled && wallet.type !== "walletconnect" && (
                              <span className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
                                Not Installed
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{wallet.description}</p>
                          
                          {/* Supported Chains */}
                          <div className="flex gap-1 mt-2 flex-wrap">
                            {wallet.chains.slice(0, 3).map((chain) => {
                              const config = getChainConfig(chain)
                              return (
                                <span
                                  key={chain}
                                  className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary/80"
                                >
                                  {config?.name || chain}
                                </span>
                              )
                            })}
                            {wallet.chains.length > 3 && (
                              <span className="text-xs px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                                +{wallet.chains.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Icon */}
                        {isLoading ? (
                          <Loader2 className="w-5 h-5 text-primary animate-spin" />
                        ) : (
                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div
                key="chain-list"
                className="space-y-3"
              >
                <Button
                  onClick={() => setStep("wallet")}
                  variant="ghost"
                  size="sm"
                  className="mb-2 text-muted-foreground hover:text-foreground"
                >
                  ← Back to wallets
                </Button>

                {selectedWallet &&
                  WALLETS.find((w) => w.type === selectedWallet)?.chains.map((chainName) => {
                    const config = getChainConfig(chainName)
                    if (!config) return null

                    return (
                      <button
                        key={config.chainId}
                        onClick={() => handleConnect(selectedWallet, config.name.toLowerCase() as keyof typeof CHAIN_CONFIGS)}
                        className="w-full group"
                      >
                        <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 border border-border hover:border-primary/50 transition-all">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Network className="w-5 h-5 text-primary" />
                          </div>

                          <div className="flex-1 text-left">
                            <div className="font-medium text-foreground">{config.name}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              Chain ID: {config.chainId} • {config.nativeCurrency.symbol}
                            </div>
                          </div>

                          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                        </div>
                      </button>
                    )
                  })}
              </div>
            )}
          </>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground text-center">
              By connecting, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--primary) / 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--primary) / 0.5);
        }
      `}</style>
    </div>
  )
}
