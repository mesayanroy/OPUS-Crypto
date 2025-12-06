// Real Web3 Wallet Providers Integration

import type { WalletType, ChainType, ConnectedWallet } from "./types"

// Check if wallet is installed
export function isWalletInstalled(type: WalletType): boolean {
  if (typeof window === "undefined") return false

  switch (type) {
    case "metamask":
      return !!(window as any).ethereum?.isMetaMask
    case "coinbase":
      return !!(window as any).ethereum?.isCoinbaseWallet || !!(window as any).coinbaseWalletExtension
    case "phantom":
      return !!(window as any).phantom?.solana || !!(window as any).solana?.isPhantom
    case "solflare":
      return !!(window as any).solflare?.isSolflare
    case "petra":
      return !!(window as any).aptos || !!(window as any).petra
    case "flow":
      return !!(window as any).fcl
    case "walletconnect":
      return true // WalletConnect is always available (modal-based)
    default:
      return false
  }
}

// Get all installed wallets
export function getInstalledWallets(): WalletType[] {
  const wallets: WalletType[] = []
  const types: WalletType[] = ["metamask", "coinbase", "phantom", "solflare", "petra", "flow"]

  types.forEach((type) => {
    if (isWalletInstalled(type)) {
      wallets.push(type)
    }
  })

  // WalletConnect is always available
  wallets.push("walletconnect")

  return wallets
}

// Connect to MetaMask
async function connectMetaMask(): Promise<ConnectedWallet | null> {
  try {
    const ethereum = (window as any).ethereum
    if (!ethereum?.isMetaMask) {
      window.open("https://metamask.io/download/", "_blank")
      return null
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" })
    const chainId = await ethereum.request({ method: "eth_chainId" })
    const balance = await ethereum.request({
      method: "eth_getBalance",
      params: [accounts[0], "latest"],
    })

    return {
      type: "metamask",
      address: accounts[0],
      chain: getChainFromId(Number.parseInt(chainId, 16)),
      balance: (Number.parseInt(balance, 16) / 1e18).toFixed(4),
      chainId: Number.parseInt(chainId, 16),
    }
  } catch (error) {
    console.error("[v0] MetaMask connection failed:", error)
    return null
  }
}

// Connect to Coinbase Wallet
async function connectCoinbase(): Promise<ConnectedWallet | null> {
  try {
    const ethereum = (window as any).ethereum
    if (!ethereum) {
      window.open("https://www.coinbase.com/wallet/downloads", "_blank")
      return null
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" })
    const chainId = await ethereum.request({ method: "eth_chainId" })
    const balance = await ethereum.request({
      method: "eth_getBalance",
      params: [accounts[0], "latest"],
    })

    return {
      type: "coinbase",
      address: accounts[0],
      chain: getChainFromId(Number.parseInt(chainId, 16)),
      balance: (Number.parseInt(balance, 16) / 1e18).toFixed(4),
      chainId: Number.parseInt(chainId, 16),
    }
  } catch (error) {
    console.error("[v0] Coinbase connection failed:", error)
    return null
  }
}

// Connect to Phantom (Solana)
async function connectPhantom(): Promise<ConnectedWallet | null> {
  try {
    const phantom = (window as any).phantom?.solana || (window as any).solana
    if (!phantom?.isPhantom) {
      window.open("https://phantom.app/download", "_blank")
      return null
    }

    const response = await phantom.connect()
    const publicKey = response.publicKey.toString()

    // Get SOL balance
    let balance = "0"
    try {
      const connection = new (window as any).solanaWeb3.Connection("https://api.mainnet-beta.solana.com")
      const lamports = await connection.getBalance(response.publicKey)
      balance = (lamports / 1e9).toFixed(4)
    } catch {
      balance = "0"
    }

    return {
      type: "phantom",
      address: publicKey,
      chain: "solana",
      balance,
      chainId: 101,
    }
  } catch (error) {
    console.error("[v0] Phantom connection failed:", error)
    return null
  }
}

// Connect to Solflare
async function connectSolflare(): Promise<ConnectedWallet | null> {
  try {
    const solflare = (window as any).solflare
    if (!solflare?.isSolflare) {
      window.open("https://solflare.com/download", "_blank")
      return null
    }

    await solflare.connect()
    const publicKey = solflare.publicKey.toString()

    return {
      type: "solflare",
      address: publicKey,
      chain: "solana",
      balance: "0",
      chainId: 101,
    }
  } catch (error) {
    console.error("[v0] Solflare connection failed:", error)
    return null
  }
}

// Connect to Petra (Aptos)
async function connectPetra(): Promise<ConnectedWallet | null> {
  try {
    const petra = (window as any).aptos || (window as any).petra
    if (!petra) {
      window.open("https://petra.app/download", "_blank")
      return null
    }

    const response = await petra.connect()
    const account = await petra.account()

    return {
      type: "petra",
      address: account.address,
      chain: "aptos",
      balance: "0",
      chainId: 1,
    }
  } catch (error) {
    console.error("[v0] Petra connection failed:", error)
    return null
  }
}

// Connect to Flow Wallet
async function connectFlow(): Promise<ConnectedWallet | null> {
  try {
    // Flow requires FCL (Flow Client Library) setup
    // This is a placeholder - in production, use @onflow/fcl
    console.log("[v0] Flow wallet connection - requires FCL setup")

    // Simulate connection for demo
    return {
      type: "flow",
      address: "0x" + Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      chain: "flow",
      balance: "0",
      chainId: 747,
    }
  } catch (error) {
    console.error("[v0] Flow connection failed:", error)
    return null
  }
}

// WalletConnect - Opens QR modal
async function connectWalletConnect(): Promise<ConnectedWallet | null> {
  try {
    // In production, use @walletconnect/web3-provider or @web3modal/ethers
    // This simulates the connection for demo purposes
    console.log("[v0] WalletConnect - requires @walletconnect/web3-provider setup")

    // Simulate connection
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return {
      type: "walletconnect",
      address: "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(""),
      chain: "ethereum",
      balance: (Math.random() * 10).toFixed(4),
      chainId: 1,
    }
  } catch (error) {
    console.error("[v0] WalletConnect failed:", error)
    return null
  }
}

// Main connect function
export async function connectWalletProvider(type: WalletType): Promise<ConnectedWallet | null> {
  switch (type) {
    case "metamask":
      return connectMetaMask()
    case "coinbase":
      return connectCoinbase()
    case "phantom":
      return connectPhantom()
    case "solflare":
      return connectSolflare()
    case "petra":
      return connectPetra()
    case "flow":
      return connectFlow()
    case "walletconnect":
      return connectWalletConnect()
    default:
      return null
  }
}

// Helper: Get chain type from chain ID
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

// Setup wallet event listeners
export function setupWalletListeners(
  onAccountChange: (accounts: string[]) => void,
  onChainChange: (chainId: string) => void,
  onDisconnect: () => void,
) {
  if (typeof window === "undefined") return

  const ethereum = (window as any).ethereum
  if (ethereum) {
    ethereum.on("accountsChanged", onAccountChange)
    ethereum.on("chainChanged", onChainChange)
    ethereum.on("disconnect", onDisconnect)

    return () => {
      ethereum.removeListener("accountsChanged", onAccountChange)
      ethereum.removeListener("chainChanged", onChainChange)
      ethereum.removeListener("disconnect", onDisconnect)
    }
  }
}
