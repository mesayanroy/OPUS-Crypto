"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import type { ConnectedWallet, WalletType, ChainType, Token, TradeOrder, ActivityLog } from "./types"
import { connectWalletProvider, setupWalletListeners, isWalletInstalled } from "./wallet-providers"

interface Web3ContextType {
  // Wallet State
  wallet: ConnectedWallet | null
  isConnecting: boolean
  isConnected: boolean

  // Actions
  connectWallet: (type: WalletType) => Promise<boolean>
  disconnectWallet: () => void
  switchChain: (chain: ChainType) => Promise<boolean>

  // Portfolio
  tokens: Token[]
  totalValue: number
  totalPnl: number
  refreshPortfolio: () => Promise<void>

  // Trading
  orders: TradeOrder[]
  placeOrder: (order: Omit<TradeOrder, "id" | "status" | "timestamp" | "txHash">) => Promise<string>

  // Activity
  activityLog: ActivityLog[]

  // UI State
  showWalletModal: boolean
  setShowWalletModal: (show: boolean) => void

  // Wallet Detection
  installedWallets: WalletType[]
  checkWalletInstalled: (type: WalletType) => boolean
}

const Web3Context = createContext<Web3ContextType | null>(null)

export function Web3Provider({ children }: { children: ReactNode }) {
  const [wallet, setWallet] = useState<ConnectedWallet | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [tokens, setTokens] = useState<Token[]>([])
  const [orders, setOrders] = useState<TradeOrder[]>([])
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([])
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [installedWallets, setInstalledWallets] = useState<WalletType[]>([])

  // Detect installed wallets on mount
  useEffect(() => {
    const checkWallets = () => {
      const types: WalletType[] = ["metamask", "coinbase", "phantom", "solflare", "petra", "flow", "walletconnect"]
      const installed = types.filter((type) => type === "walletconnect" || isWalletInstalled(type))
      setInstalledWallets(installed)
    }

    // Check immediately and after a delay (some wallets inject late)
    checkWallets()
    const timeout = setTimeout(checkWallets, 1000)

    return () => clearTimeout(timeout)
  }, [])

  // Setup wallet event listeners
  useEffect(() => {
    if (!wallet) return

    const cleanup = setupWalletListeners(
      (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet()
        } else if (accounts[0] !== wallet.address) {
          setWallet((prev) => (prev ? { ...prev, address: accounts[0] } : null))
        }
      },
      (chainId) => {
        const newChainId = Number.parseInt(chainId, 16)
        setWallet((prev) => (prev ? { ...prev, chainId: newChainId, chain: getChainFromId(newChainId) } : null))
      },
      () => {
        disconnectWallet()
      },
    )

    return cleanup
  }, [wallet])

  const connectWallet = useCallback(async (type: WalletType): Promise<boolean> => {
    setIsConnecting(true)
    try {
      const connectedWallet = await connectWalletProvider(type)

      if (connectedWallet) {
        setWallet(connectedWallet)
        await loadPortfolioData()
        await loadActivityLog()
        setShowWalletModal(false)
        return true
      }
      return false
    } catch (error) {
      console.error("[v0] Wallet connection failed:", error)
      return false
    } finally {
      setIsConnecting(false)
    }
  }, [])

  const disconnectWallet = useCallback(() => {
    // Disconnect from Phantom if connected
    if (wallet?.type === "phantom") {
      const phantom = (window as any).phantom?.solana || (window as any).solana
      phantom?.disconnect?.()
    }

    setWallet(null)
    setTokens([])
    setOrders([])
    setActivityLog([])
  }, [wallet])

  const switchChain = useCallback(
    async (chain: ChainType): Promise<boolean> => {
      if (!wallet) return false

      const chainIds: Record<ChainType, string> = {
        ethereum: "0x1",
        polygon: "0x89",
        arbitrum: "0xa4b1",
        optimism: "0xa",
        bsc: "0x38",
        solana: "0x65",
        flow: "0x2eb",
        aptos: "0x1",
      }

      try {
        const ethereum = (window as any).ethereum
        if (ethereum) {
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: chainIds[chain] }],
          })
          setWallet((prev) => (prev ? { ...prev, chain, chainId: Number.parseInt(chainIds[chain], 16) } : null))
          return true
        }
        return false
      } catch (error) {
        console.error("[v0] Chain switch failed:", error)
        return false
      }
    },
    [wallet],
  )

  const loadPortfolioData = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setTokens(getMockTokens())
  }

  const loadActivityLog = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    setActivityLog(getMockActivityLog())
  }

  const refreshPortfolio = useCallback(async () => {
    await loadPortfolioData()
  }, [])

  const placeOrder = useCallback(
    async (order: Omit<TradeOrder, "id" | "status" | "timestamp" | "txHash">): Promise<string> => {
      const orderId = `order-${Date.now()}`
      const newOrder: TradeOrder = {
        ...order,
        id: orderId,
        status: "pending",
        timestamp: Date.now(),
      }

      setOrders((prev) => [newOrder, ...prev])

      setTimeout(() => {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId ? { ...o, status: "confirmed", txHash: `0x${Math.random().toString(16).slice(2)}` } : o,
          ),
        )

        setActivityLog((prev) => [
          {
            id: `activity-${Date.now()}`,
            type: "trade",
            message: `${order.type.toUpperCase()} ${order.amount} ${order.token.symbol} @ $${order.price.toFixed(2)}`,
            timestamp: Date.now(),
          },
          ...prev,
        ])
      }, 2000)

      return orderId
    },
    [],
  )

  const checkWalletInstalled = useCallback((type: WalletType) => isWalletInstalled(type), [])

  const totalValue = tokens.reduce((sum, t) => sum + t.value, 0)
  const totalPnl = tokens.reduce((sum, t) => sum + (t.value * t.change24h) / 100, 0)

  return (
    <Web3Context.Provider
      value={{
        wallet,
        isConnecting,
        isConnected: !!wallet,
        connectWallet,
        disconnectWallet,
        switchChain,
        tokens,
        totalValue,
        totalPnl,
        refreshPortfolio,
        orders,
        placeOrder,
        activityLog,
        showWalletModal,
        setShowWalletModal,
        installedWallets,
        checkWalletInstalled,
      }}
    >
      {children}
    </Web3Context.Provider>
  )
}

export function useWeb3() {
  const context = useContext(Web3Context)
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

// Helper functions
function getChainFromId(chainId: number): ChainType {
  const chains: Record<number, ChainType> = {
    1: "ethereum",
    137: "polygon",
    42161: "arbitrum",
    10: "optimism",
    56: "bsc",
    101: "solana",
    747: "flow",
  }
  return chains[chainId] || "ethereum"
}

function getMockTokens(): Token[] {
  return [
    {
      symbol: "ETH",
      name: "Ethereum",
      address: "0x0",
      chain: "ethereum",
      decimals: 18,
      price: 3245.67,
      change24h: 2.34,
      balance: 1.5,
      value: 4868.51,
    },
    {
      symbol: "BTC",
      name: "Bitcoin",
      address: "0x1",
      chain: "ethereum",
      decimals: 8,
      price: 67234.12,
      change24h: -1.23,
      balance: 0.12,
      value: 8068.09,
    },
    {
      symbol: "SOL",
      name: "Solana",
      address: "0x2",
      chain: "solana",
      decimals: 9,
      price: 145.23,
      change24h: 5.67,
      balance: 25,
      value: 3630.75,
    },
    {
      symbol: "MATIC",
      name: "Polygon",
      address: "0x3",
      chain: "polygon",
      decimals: 18,
      price: 0.89,
      change24h: 3.12,
      balance: 2500,
      value: 2225.0,
    },
    {
      symbol: "ARB",
      name: "Arbitrum",
      address: "0x4",
      chain: "arbitrum",
      decimals: 18,
      price: 1.24,
      change24h: -0.56,
      balance: 1000,
      value: 1240.0,
    },
  ]
}

function getMockActivityLog(): ActivityLog[] {
  return [
    { id: "1", type: "trade", message: "BUY 0.5 ETH @ $3,245.67", timestamp: Date.now() - 300000 },
    { id: "2", type: "whale", message: "Whale moved 1,000 ETH to Binance", timestamp: Date.now() - 600000 },
    { id: "3", type: "alert", message: "SOL price up 5% in last hour", timestamp: Date.now() - 900000 },
    {
      id: "4",
      type: "liquidation",
      message: "Warning: BTC leverage position at risk",
      timestamp: Date.now() - 1200000,
    },
    { id: "5", type: "copy", message: "Copied trade from CryptoWhale.eth", timestamp: Date.now() - 1500000 },
  ]
}
