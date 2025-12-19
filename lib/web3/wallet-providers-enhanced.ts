// Enhanced Real Web3 Wallet Providers with Smart Contract Integration

import type { WalletType, ChainType, ConnectedWallet } from "./types"
import { ethers } from "ethers"
import { Connection, PublicKey } from "@solana/web3.js"
import { getChainId, getChainFromId, switchNetwork, CHAIN_CONFIGS } from "./chain-config"

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

// Connect to MetaMask with ethers.js
async function connectMetaMask(): Promise<ConnectedWallet | null> {
  try {
    const ethereum = (window as any).ethereum
    if (!ethereum?.isMetaMask) {
      window.open("https://metamask.io/download/", "_blank")
      return null
    }

    // Request account access
    const provider = new ethers.BrowserProvider(ethereum)
    const accounts = await provider.send("eth_requestAccounts", [])
    const network = await provider.getNetwork()
    const signer = await provider.getSigner()
    const balance = await provider.getBalance(accounts[0])

    return {
      type: "metamask",
      address: accounts[0],
      chain: getChainFromId(Number(network.chainId)),
      balance: ethers.formatEther(balance),
      chainId: Number(network.chainId),
    }
  } catch (error) {
    console.error("MetaMask connection failed:", error)
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

    const provider = new ethers.BrowserProvider(ethereum)
    const accounts = await provider.send("eth_requestAccounts", [])
    const network = await provider.getNetwork()
    const balance = await provider.getBalance(accounts[0])

    return {
      type: "coinbase",
      address: accounts[0],
      chain: getChainFromId(Number(network.chainId)),
      balance: ethers.formatEther(balance),
      chainId: Number(network.chainId),
    }
  } catch (error) {
    console.error("Coinbase connection failed:", error)
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
      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed")
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
      chainId: 101, // Solana mainnet
    }
  } catch (error) {
    console.error("Phantom connection failed:", error)
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

    // Get SOL balance
    let balance = "0"
    try {
      const connection = new Connection("https://api.mainnet-beta.solana.com", "confirmed")
      const pubKey = new PublicKey(publicKey)
      const lamports = await connection.getBalance(pubKey)
      balance = (lamports / 1e9).toFixed(4)
    } catch {
      balance = "0"
    }

    return {
      type: "solflare",
      address: publicKey,
      chain: "solana",
      balance,
      chainId: 101,
    }
  } catch (error) {
    console.error("Solflare connection failed:", error)
    return null
  }
}

// Connect to Petra (Aptos)
async function connectPetra(): Promise<ConnectedWallet | null> {
  try {
    const petra = (window as any).petra || (window as any).aptos
    if (!petra) {
      window.open("https://petra.app/", "_blank")
      return null
    }

    const response = await petra.connect()
    const address = response.address || response.account?.address

    // Get APT balance
    let balance = "0"
    try {
      const accountResource = await petra.account()
      balance = (Number(accountResource.coin?.value || 0) / 1e8).toFixed(4)
    } catch {
      balance = "0"
    }

    return {
      type: "petra",
      address,
      chain: "aptos",
      balance,
      chainId: 1, // Aptos mainnet
    }
  } catch (error) {
    console.error("Petra connection failed:", error)
    return null
  }
}

// Connect to Flow Wallet
async function connectFlow(): Promise<ConnectedWallet | null> {
  try {
    const fcl = (window as any).fcl
    if (!fcl) {
      window.open("https://flow.com/upgrade#wallets", "_blank")
      return null
    }

    await fcl.authenticate()
    const user = await fcl.currentUser().snapshot()

    return {
      type: "flow",
      address: user.addr,
      chain: "flow",
      balance: "0", // Would need to query Flow blockchain
      chainId: 1, // Flow mainnet
    }
  } catch (error) {
    console.error("Flow connection failed:", error)
    return null
  }
}

// Connect to WalletConnect
async function connectWalletConnect(): Promise<ConnectedWallet | null> {
  try {
    // WalletConnect v2 implementation would go here
    // For now, return null and open WalletConnect modal
    console.log("WalletConnect integration coming soon")
    return null
  } catch (error) {
    console.error("WalletConnect connection failed:", error)
    return null
  }
}

// Main wallet connection function
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

// Setup wallet event listeners
export function setupWalletListeners(
  onAccountsChanged: (accounts: string[]) => void,
  onChainChanged: (chainId: string) => void,
  onDisconnect: () => void,
): () => void {
  if (typeof window === "undefined") return () => {}

  const ethereum = (window as any).ethereum
  const phantom = (window as any).phantom?.solana
  const solflare = (window as any).solflare

  // EVM wallet listeners
  if (ethereum) {
    ethereum.on("accountsChanged", onAccountsChanged)
    ethereum.on("chainChanged", onChainChanged)
    ethereum.on("disconnect", onDisconnect)
  }

  // Phantom listeners
  if (phantom) {
    phantom.on("accountChanged", (publicKey: any) => {
      if (publicKey) {
        onAccountsChanged([publicKey.toString()])
      } else {
        onDisconnect()
      }
    })
    phantom.on("disconnect", onDisconnect)
  }

  // Solflare listeners
  if (solflare) {
    solflare.on("accountChanged", (publicKey: any) => {
      if (publicKey) {
        onAccountsChanged([publicKey.toString()])
      } else {
        onDisconnect()
      }
    })
    solflare.on("disconnect", onDisconnect)
  }

  // Cleanup function
  return () => {
    if (ethereum) {
      ethereum.removeListener("accountsChanged", onAccountsChanged)
      ethereum.removeListener("chainChanged", onChainChanged)
      ethereum.removeListener("disconnect", onDisconnect)
    }
    if (phantom) {
      phantom.removeListener("accountChanged", () => {})
      phantom.removeListener("disconnect", onDisconnect)
    }
    if (solflare) {
      solflare.removeListener("accountChanged", () => {})
      solflare.removeListener("disconnect", onDisconnect)
    }
  }
}

// Switch chain for connected wallet
export async function switchWalletChain(type: WalletType, chain: ChainType): Promise<boolean> {
  try {
    switch (type) {
      case "metamask":
      case "coinbase":
        return await switchNetwork(chain)
      case "phantom":
      case "solflare":
        // Solana wallets don't need chain switching
        return chain === "solana"
      case "petra":
        // Aptos wallets don't need chain switching
        return chain === "aptos"
      case "flow":
        // Flow wallets don't need chain switching
        return chain === "flow"
      default:
        return false
    }
  } catch (error) {
    console.error("Chain switch failed:", error)
    return false
  }
}

// Sign message with wallet
export async function signMessage(type: WalletType, message: string): Promise<string | null> {
  try {
    switch (type) {
      case "metamask":
      case "coinbase": {
        const ethereum = (window as any).ethereum
        if (!ethereum) return null

        const provider = new ethers.BrowserProvider(ethereum)
        const signer = await provider.getSigner()
        const signature = await signer.signMessage(message)
        return signature
      }
      case "phantom": {
        const phantom = (window as any).phantom?.solana
        if (!phantom) return null

        const encodedMessage = new TextEncoder().encode(message)
        const signedMessage = await phantom.signMessage(encodedMessage, "utf8")
        return Buffer.from(signedMessage.signature).toString("hex")
      }
      case "petra": {
        const petra = (window as any).petra
        if (!petra) return null

        const response = await petra.signMessage({
          message,
          nonce: Date.now().toString(),
        })
        return response.signature
      }
      default:
        return null
    }
  } catch (error) {
    console.error("Message signing failed:", error)
    return null
  }
}

// Send transaction
export async function sendTransaction(
  type: WalletType,
  to: string,
  value: string,
  data?: string,
): Promise<string | null> {
  try {
    switch (type) {
      case "metamask":
      case "coinbase": {
        const ethereum = (window as any).ethereum
        if (!ethereum) return null

        const provider = new ethers.BrowserProvider(ethereum)
        const signer = await provider.getSigner()

        const tx = await signer.sendTransaction({
          to,
          value: ethers.parseEther(value),
          data: data || "0x",
        })

        return tx.hash
      }
      case "phantom":
      case "solflare": {
        // Solana transaction would go here
        console.log("Solana transaction not implemented yet")
        return null
      }
      case "petra": {
        // Aptos transaction would go here
        console.log("Aptos transaction not implemented yet")
        return null
      }
      default:
        return null
    }
  } catch (error) {
    console.error("Transaction failed:", error)
    return null
  }
}
