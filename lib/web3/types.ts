// Web3 Types for OPUS - Aptos-Focused Trading Platform

export type WalletType = "petra" | "martian" | "pontem" | "hippo"

export type ChainType = "aptos" // Aptos only

export interface WalletInfo {
  type: WalletType
  name: string
  icon: string
  chains: ChainType[]
  installed?: boolean
}

export interface ConnectedWallet {
  type: WalletType
  address: string // Aptos wallet address (0x...)
  chain: "aptos"
  balance: string // Native APT balance in octas
  chainId: "1" // Mainnet
}

export interface Token {
  symbol: string
  name: string
  address: string
  chain: ChainType
  decimals: number
  price: number
  change24h: number
  balance: number
  value: number
  logoUrl?: string
}

export interface TradeOrder {
  id: string
  type: "buy" | "sell" | "swap"
  tokenIn: string // Aptos token type
  tokenOut: string // Aptos token type
  amountIn: number
  amountOut: number
  price: number
  slippage: number
  dex: "liquidswap" | "econia" | "panora"
  status: "pending" | "confirmed" | "failed" | "cancelled"
  timestamp: number
  txHash?: string
  gasFee?: number
  requiresSignature: true // Always require signature on Aptos
}

export interface EIP712TypedData {
  types: {
    EIP712Domain: { name: string; type: string }[]
    [key: string]: { name: string; type: string }[]
  }
  primaryType: string
  domain: {
    name: string
    version: string
    chainId: number
    verifyingContract: string
  }
  message: Record<string, unknown>
}

export interface RelayerTransaction {
  id: string
  userAddress: string
  targetContract: string
  data: string
  signature: string
  status: "pending" | "submitted" | "confirmed" | "failed"
  txHash?: string
  gasEstimate?: string
  timestamp: number
}

export interface TopTrader {
  address: string
  name: string
  avatar: string
  pnl: number
  pnlPercent: number
  winRate: number
  followers: number
  strategy: string
  riskScore: number
  trades: number
}

export interface ActivityLog {
  id: string
  type: "trade" | "liquidation" | "whale" | "alert" | "copy"
  message: string
  timestamp: number
  data?: Record<string, unknown>
}
