/**
 * AI Agent Types & Configuration
 * Defines the structure for user-created trading agents
 */

import { AGENT_TRIGGER_TYPES, EXECUTION_RULES, DEX_CONFIGS } from "./aptos-config"

export interface AgentTrigger {
  type: keyof typeof AGENT_TRIGGER_TYPES
  targetValue: number // price, volume, or time in milliseconds
  tolerance?: number // for price change triggers
}

export interface AgentAction {
  type: "buy" | "sell" | "swap"
  dex: keyof typeof DEX_CONFIGS
  tokenIn: string // Token address
  tokenOut: string // Token address
  amountIn?: number // If buy/sell
  amountOut?: number // Expected output
  maxSlippage: number // in percentage (e.g., 0.5 for 0.5%)
  requiresApproval: boolean // Requires wallet signature
}

export interface AgentExecutionRule {
  trigger: AgentTrigger
  actions: AgentAction[]
  enabled: boolean
  createdAt: number // timestamp
  approvedAt?: number // When user signed off
  approvalSignature?: string // Wallet signature of rule
  executionCount: number
  lastExecutedAt?: number
}

export interface AIAgent {
  id: string // UUID
  walletAddress: string // Owner wallet - PRIMARY KEY for user binding
  name: string
  description?: string
  strategy: "trend_following" | "mean_reversion" | "arbitrage" | "manual"
  rules: AgentExecutionRule[]
  status: "active" | "inactive" | "paused" | "error"
  performance: {
    totalExecutions: number
    successfulTrades: number
    failedTrades: number
    totalPnl: number
    roi: number
  }
  limits: {
    maxDailyTrades: number
    maxPositionSize: number // percentage of portfolio
    maxSlippage: number
  }
  createdAt: number
  updatedAt: number
  isRunningLocally: boolean // Agent currently running on user's machine
  lastSyncedAt?: number
}

export interface AgentRunConfig {
  agentId: string
  walletAddress: string
  privateKeyPath?: string // For local execution (not stored on server)
  rpcUrl: string
  indexerUrl: string
  checkInterval: number // ms between checks
  maxConcurrentTxs: number
  enableDryRun: boolean
}

export interface AgentExecutionLog {
  id: string
  agentId: string
  ruleId: string
  timestamp: number
  action: AgentAction
  result: "pending" | "success" | "failed"
  txHash?: string
  gasUsed?: number
  error?: string
}

/**
 * Helper to validate agent rule
 */
export function validateAgentRule(rule: AgentExecutionRule): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!rule.trigger.targetValue || rule.trigger.targetValue <= 0) {
    errors.push("Invalid trigger target value")
  }

  if (rule.actions.length === 0) {
    errors.push("Agent must have at least one action")
  }

  rule.actions.forEach((action, idx) => {
    if (!action.tokenIn || !action.tokenOut) {
      errors.push(`Action ${idx}: Missing token addresses`)
    }
    if (action.maxSlippage < 0 || action.maxSlippage > 100) {
      errors.push(`Action ${idx}: Invalid slippage (must be 0-100%)`)
    }
    if (action.type === "buy" && !action.amountIn) {
      errors.push(`Action ${idx}: Buy requires amount`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Create default agent template
 */
export function createDefaultAgent(walletAddress: string): AIAgent {
  return {
    id: `agent_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    walletAddress,
    name: "New Trading Agent",
    description: "Custom trading agent",
    strategy: "manual",
    rules: [],
    status: "inactive",
    performance: {
      totalExecutions: 0,
      successfulTrades: 0,
      failedTrades: 0,
      totalPnl: 0,
      roi: 0,
    },
    limits: {
      maxDailyTrades: EXECUTION_RULES.MAX_TRADES_PER_DAY,
      maxPositionSize: EXECUTION_RULES.MAX_POSITION_SIZE,
      maxSlippage: EXECUTION_RULES.MAX_SLIPPAGE,
    },
    createdAt: Date.now(),
    updatedAt: Date.now(),
    isRunningLocally: false,
  }
}
