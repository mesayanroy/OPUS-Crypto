/**
 * Aptos Blockchain Configuration
 * Core chain for OPUS trading platform
 */

export const APTOS_CONFIG = {
  MAINNET: {
    chainId: "1",
    chainName: "Aptos Mainnet",
    rpcUrl: "https://fullnode.mainnet.aptoslabs.com/v1",
    indexerUrl: "https://indexer.mainnet.aptoslabs.com/graphql",
    explorerUrl: "https://explorer.aptoslabs.com",
    faucetUrl: null,
  },
  TESTNET: {
    chainId: "2",
    chainName: "Aptos Testnet",
    rpcUrl: "https://fullnode.testnet.aptoslabs.com/v1",
    indexerUrl: "https://indexer.testnet.aptoslabs.com/graphql",
    explorerUrl: "https://explorer.aptoslabs.com?network=testnet",
    faucetUrl: "https://faucet.testnet.aptoslabs.com",
  },
  DEVNET: {
    chainId: "40",
    chainName: "Aptos Devnet",
    rpcUrl: "https://fullnode.devnet.aptoslabs.com/v1",
    indexerUrl: "https://indexer.devnet.aptoslabs.com/graphql",
    explorerUrl: "https://explorer.aptoslabs.com?network=devnet",
    faucetUrl: "https://faucet.devnet.aptoslabs.com",
  },
}

export const ACTIVE_CHAIN = process.env.NEXT_PUBLIC_APTOS_CHAIN || "mainnet"

export const getAptosConfig = () => {
  const chain = ACTIVE_CHAIN.toLowerCase() as keyof typeof APTOS_CONFIG
  return APTOS_CONFIG[chain] || APTOS_CONFIG.MAINNET
}

/**
 * DEX Configurations on Aptos
 */
export const DEX_CONFIGS = {
  LIQUIDSWAP: {
    name: "LiquidSwap",
    address: "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19290ff",
    module: "scripts_v2",
    fee: 0.003, // 0.3%
    supported: true,
  },
  ECONIA: {
    name: "Econia",
    address: "0xc0deb00c405f84c85dc13442e305df75d42919ea27df88eb7ff2ff8be8f4f92e",
    module: "user",
    fee: 0.001, // 0.1%
    supported: true,
  },
  PANORA: {
    name: "Panora",
    address: "0x61d2c22a6cb7831bee0f48363674619d404099c937dcd4f38d8814436c47b146",
    module: "swap",
    fee: 0.002, // 0.2%
    supported: true,
  },
}

/**
 * Token Registry on Aptos
 */
export const APTOS_TOKENS = {
  APT: {
    symbol: "APT",
    name: "Aptos",
    address: "0x1::aptos_coin::AptosCoin",
    decimals: 8,
    logoUrl: "https://raw.githubusercontent.com/aptos-labs/token-list/main/assets/aptos_apt.svg",
  },
  USDC: {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xf22bede237a07e121b56d91a491eb7713f2342294c3124a993f87548f5ee752f::coin::USDC",
    decimals: 6,
    logoUrl: "https://raw.githubusercontent.com/aptos-labs/token-list/main/assets/usdc.png",
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    address: "0xf22bede237a07e121b56d91a491eb7713f2342294c3124a993f87548f5ee752f::coin::USDT",
    decimals: 6,
    logoUrl: "https://raw.githubusercontent.com/aptos-labs/token-list/main/assets/usdt.png",
  },
  WETH: {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0xf22bede237a07e121b56d91a491eb7713f2342294c3124a993f87548f5ee752f::coin::WETH",
    decimals: 8,
    logoUrl: "https://raw.githubusercontent.com/aptos-labs/token-list/main/assets/weth.png",
  },
}

/**
 * AI Agent Supported Triggers
 */
export const AGENT_TRIGGER_TYPES = {
  PRICE_ABOVE: "price_above",
  PRICE_BELOW: "price_below",
  PRICE_CHANGE: "price_change",
  VOLUME_ABOVE: "volume_above",
  TIME_INTERVAL: "time_interval",
  MANUAL: "manual",
}

/**
 * AI Agent Execution Rules
 */
export const EXECUTION_RULES = {
  MAX_SLIPPAGE: 0.05, // 5%
  MAX_TRADES_PER_DAY: 100,
  MAX_POSITION_SIZE: 0.5, // 50% of portfolio
  MIN_TRADE_AMOUNT: 1, // 1 APT minimum
  GAS_PRICE_LIMIT: 100, // Octas per gas unit
}
