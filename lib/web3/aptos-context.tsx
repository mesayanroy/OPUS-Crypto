/**
 * Aptos Wallet-Only Context
 * User identity is tied 100% to connected wallet address
 * No email/password authentication
 */

"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useWallet, WalletContextState } from "@aptos-labs/wallet-adapter-react"
import { getAptosConfig } from "./aptos-config"

export interface AptosUser {
  walletAddress: string
  isConnected: boolean
  isLoading: boolean
}

export interface UserBalance {
  symbol: string
  balance: string
  decimals: number
  usdValue?: number
}

export interface UserAsset {
  type: string
  address: string
  balance: string
}

interface AptosContextType {
  // Wallet & Auth
  user: AptosUser | null
  isConnecting: boolean
  isConnected: boolean
  walletAddress: string | null

  // Wallet actions
  connectWallet: () => Promise<void>
  disconnectWallet: () => void

  // User data (wallet-bound)
  balances: UserBalance[]
  assets: UserAsset[]
  nativeBalance: string
  refreshBalances: () => Promise<void>

  // Aptos SDK
  aptos: Aptos | null
  account: any

  // Modals
  showWalletModal: boolean
  setShowWalletModal: (show: boolean) => void
}

const AptosContext = createContext<AptosContextType | null>(null)

export function AptosProvider({ children }: { children: ReactNode }) {
  const { account, connected, connecting, disconnect, signAndSubmitTransaction } = useWallet()

  const [balances, setBalances] = useState<UserBalance[]>([])
  const [assets, setAssets] = useState<UserAsset[]>([])
  const [nativeBalance, setNativeBalance] = useState("0")
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [aptos, setAptos] = useState<Aptos | null>(null)

  // Initialize Aptos SDK
  useEffect(() => {
    const config = getAptosConfig()
    const aptosConfig = new AptosConfig({ network: Network.MAINNET })
    const aptosClient = new Aptos(aptosConfig)
    setAptos(aptosClient)
  }, [])

  // Fetch balances when wallet connects
  useEffect(() => {
    if (connected && account && aptos) {
      refreshBalances()
    }
  }, [connected, account?.address, aptos])

  const connectWallet = useCallback(async () => {
    // Wallet connection is handled by WalletConnectButton from wallet adapter
    // This is just a callback placeholder for custom connection flow if needed
  }, [])

  const disconnectWallet = useCallback(async () => {
    await disconnect()
    setBalances([])
    setAssets([])
    setNativeBalance("0")
  }, [disconnect])

  const refreshBalances = useCallback(async () => {
    if (!connected || !account?.address || !aptos) return

    try {
      // Fetch native APT balance
      const accountData = await aptos.getAccountInfo({ accountAddress: account.address })

      if (accountData) {
        // APT balance in octas (1 APT = 10^8 octas)
        const aptBalance = (accountData.sequence_number || 0).toString()
        setNativeBalance(aptBalance)

        // Fetch coin resources
        const resources = await aptos.getAccountResources({ accountAddress: account.address })

        const userAssets: UserAsset[] = []
        const userBalances: UserBalance[] = []

        resources?.forEach((resource: any) => {
          if (resource.type.includes("0x1::coin::CoinStore")) {
            const coinType = resource.type.replace("0x1::coin::CoinStore<", "").replace(">", "")

            userAssets.push({
              type: coinType,
              address: account.address,
              balance: resource.data?.coin?.value || "0",
            })

            // Parse into readable balances
            if (coinType.includes("AptosCoin")) {
              userBalances.push({
                symbol: "APT",
                balance: resource.data?.coin?.value || "0",
                decimals: 8,
              })
            }
          }
        })

        setAssets(userAssets)
        setBalances(userBalances)
      }
    } catch (error) {
      console.error("Failed to refresh balances:", error)
    }
  }, [connected, account?.address, aptos])

  const user: AptosUser | null = connected
    ? {
        walletAddress: account?.address || "",
        isConnected: true,
        isLoading: connecting,
      }
    : null

  return (
    <AptosContext.Provider
      value={{
        user,
        isConnecting: connecting,
        isConnected: connected,
        walletAddress: account?.address || null,
        connectWallet,
        disconnectWallet,
        balances,
        assets,
        nativeBalance,
        refreshBalances,
        aptos,
        account,
        showWalletModal,
        setShowWalletModal,
      }}
    >
      {children}
    </AptosContext.Provider>
  )
}

export function useAptos() {
  const context = useContext(AptosContext)
  if (!context) {
    throw new Error("useAptos must be used within AptosProvider")
  }
  return context
}
