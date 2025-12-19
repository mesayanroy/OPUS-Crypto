// Real Chain IDs and RPC Configurations for Multi-Chain Support

export interface ChainConfig {
  chainId: number | string
  chainName: string
  nativeCurrency: {
    name: string
    symbol: string
    decimals: number
  }
  rpcUrls: string[]
  blockExplorerUrls: string[]
  iconUrl?: string
}

// Ethereum Mainnet
export const ETHEREUM_MAINNET: ChainConfig = {
  chainId: 1,
  chainName: "Ethereum Mainnet",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: [
    "https://eth.llamarpc.com",
    "https://rpc.ankr.com/eth",
    "https://ethereum.publicnode.com",
  ],
  blockExplorerUrls: ["https://etherscan.io"],
  iconUrl: "/chains/ethereum.svg",
}

// Polygon Mainnet
export const POLYGON_MAINNET: ChainConfig = {
  chainId: 137,
  chainName: "Polygon Mainnet",
  nativeCurrency: {
    name: "MATIC",
    symbol: "MATIC",
    decimals: 18,
  },
  rpcUrls: [
    "https://polygon-rpc.com",
    "https://rpc.ankr.com/polygon",
    "https://polygon.llamarpc.com",
  ],
  blockExplorerUrls: ["https://polygonscan.com"],
  iconUrl: "/chains/polygon.svg",
}

// Arbitrum One
export const ARBITRUM_ONE: ChainConfig = {
  chainId: 42161,
  chainName: "Arbitrum One",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: [
    "https://arb1.arbitrum.io/rpc",
    "https://rpc.ankr.com/arbitrum",
    "https://arbitrum.llamarpc.com",
  ],
  blockExplorerUrls: ["https://arbiscan.io"],
  iconUrl: "/chains/arbitrum.svg",
}

// Optimism Mainnet
export const OPTIMISM_MAINNET: ChainConfig = {
  chainId: 10,
  chainName: "Optimism",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: [
    "https://mainnet.optimism.io",
    "https://rpc.ankr.com/optimism",
    "https://optimism.llamarpc.com",
  ],
  blockExplorerUrls: ["https://optimistic.etherscan.io"],
  iconUrl: "/chains/optimism.svg",
}

// BSC (Binance Smart Chain)
export const BSC_MAINNET: ChainConfig = {
  chainId: 56,
  chainName: "BNB Smart Chain",
  nativeCurrency: {
    name: "BNB",
    symbol: "BNB",
    decimals: 18,
  },
  rpcUrls: [
    "https://bsc-dataseed.binance.org",
    "https://rpc.ankr.com/bsc",
    "https://binance.llamarpc.com",
  ],
  blockExplorerUrls: ["https://bscscan.com"],
  iconUrl: "/chains/bsc.svg",
}

// Base Mainnet
export const BASE_MAINNET: ChainConfig = {
  chainId: 8453,
  chainName: "Base",
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  rpcUrls: [
    "https://mainnet.base.org",
    "https://base.llamarpc.com",
  ],
  blockExplorerUrls: ["https://basescan.org"],
  iconUrl: "/chains/base.svg",
}

// Solana Mainnet
export const SOLANA_MAINNET = {
  chainId: "solana:mainnet",
  chainName: "Solana Mainnet",
  nativeCurrency: {
    name: "Solana",
    symbol: "SOL",
    decimals: 9,
  },
  rpcUrls: [
    "https://api.mainnet-beta.solana.com",
    "https://rpc.ankr.com/solana",
    "https://solana-api.projectserum.com",
  ],
  blockExplorerUrls: ["https://explorer.solana.com"],
  iconUrl: "/chains/solana.svg",
}

// Aptos Mainnet
export const APTOS_MAINNET = {
  chainId: "aptos:mainnet",
  chainName: "Aptos Mainnet",
  nativeCurrency: {
    name: "Aptos",
    symbol: "APT",
    decimals: 8,
  },
  rpcUrls: [
    "https://fullnode.mainnet.aptoslabs.com/v1",
    "https://aptos-mainnet.pontem.network",
  ],
  blockExplorerUrls: ["https://explorer.aptoslabs.com"],
  iconUrl: "/chains/aptos.svg",
}

// Flow Mainnet
export const FLOW_MAINNET = {
  chainId: "flow:mainnet",
  chainName: "Flow Mainnet",
  nativeCurrency: {
    name: "Flow",
    symbol: "FLOW",
    decimals: 8,
  },
  rpcUrls: [
    "https://rest-mainnet.onflow.org",
  ],
  blockExplorerUrls: ["https://flowscan.org"],
  iconUrl: "/chains/flow.svg",
}

// Chain configurations map
export const CHAIN_CONFIGS: Record<string, ChainConfig | typeof SOLANA_MAINNET | typeof APTOS_MAINNET | typeof FLOW_MAINNET> = {
  ethereum: ETHEREUM_MAINNET,
  polygon: POLYGON_MAINNET,
  arbitrum: ARBITRUM_ONE,
  optimism: OPTIMISM_MAINNET,
  bsc: BSC_MAINNET,
  base: BASE_MAINNET,
  solana: SOLANA_MAINNET,
  aptos: APTOS_MAINNET,
  flow: FLOW_MAINNET,
}

// Get chain ID from chain type
export function getChainId(chainType: string): number | string {
  const config = CHAIN_CONFIGS[chainType]
  return config?.chainId ?? 1
}

// Get chain type from chain ID
export function getChainFromId(chainId: number | string): string {
  const entry = Object.entries(CHAIN_CONFIGS).find(([_, config]) => config.chainId === chainId)
  return entry?[0] ?? "ethereum"
}

// Switch network in MetaMask/EVM wallet
export async function switchNetwork(chainType: string): Promise<boolean> {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    return false
  }

  const config = CHAIN_CONFIGS[chainType] as ChainConfig
  if (!config || typeof config.chainId === "string") {
    return false // Non-EVM chains
  }

  const ethereum = (window as any).ethereum

  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${config.chainId.toString(16)}` }],
    })
    return true
  } catch (switchError: any) {
    // Chain not added to wallet, try adding it
    if (switchError.code === 4902) {
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${config.chainId.toString(16)}`,
              chainName: config.chainName,
              nativeCurrency: config.nativeCurrency,
              rpcUrls: config.rpcUrls,
              blockExplorerUrls: config.blockExplorerUrls,
            },
          ],
        })
        return true
      } catch (addError) {
        console.error("Failed to add chain:", addError)
        return false
      }
    }
    console.error("Failed to switch chain:", switchError)
    return false
  }
}

// Add network to wallet
export async function addNetwork(chainType: string): Promise<boolean> {
  if (typeof window === "undefined" || !(window as any).ethereum) {
    return false
  }

  const config = CHAIN_CONFIGS[chainType] as ChainConfig
  if (!config || typeof config.chainId === "string") {
    return false
  }

  const ethereum = (window as any).ethereum

  try {
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: `0x${config.chainId.toString(16)}`,
          chainName: config.chainName,
          nativeCurrency: config.nativeCurrency,
          rpcUrls: config.rpcUrls,
          blockExplorerUrls: config.blockExplorerUrls,
        },
      ],
    })
    return true
  } catch (error) {
    console.error("Failed to add network:", error)
    return false
  }
}
