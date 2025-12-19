/**
 * AI Agent Storage Service
 * Stores agents locally indexed by wallet address
 * No server persistence - agents are user-owned and locally managed
 */

import { AIAgent, AgentExecutionLog } from "./aptos-agent-types"

const STORAGE_KEYS = {
  AGENTS: "opus_agents", // Map of walletAddress -> AIAgent[]
  EXECUTION_LOGS: "opus_exec_logs", // Map of agentId -> ExecutionLog[]
}

interface AgentStorage {
  agents: Record<string, AIAgent[]>
  executionLogs: Record<string, AgentExecutionLog[]>
}

class AgentStorageService {
  private storage: AgentStorage = {
    agents: {},
    executionLogs: {},
  }

  /**
   * Load agents for a specific wallet
   */
  async getAgentsForWallet(walletAddress: string): Promise<AIAgent[]> {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AGENTS)
      if (!stored) return []

      const allAgents = JSON.parse(stored) as Record<string, AIAgent[]>
      return allAgents[walletAddress] || []
    } catch (error) {
      console.error("Failed to load agents:", error)
      return []
    }
  }

  /**
   * Save agent for wallet
   */
  async saveAgent(walletAddress: string, agent: AIAgent): Promise<void> {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AGENTS)
      const allAgents = stored ? (JSON.parse(stored) as Record<string, AIAgent[]>) : {}

      if (!allAgents[walletAddress]) {
        allAgents[walletAddress] = []
      }

      const index = allAgents[walletAddress].findIndex((a) => a.id === agent.id)
      if (index >= 0) {
        allAgents[walletAddress][index] = agent
      } else {
        allAgents[walletAddress].push(agent)
      }

      localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(allAgents))
    } catch (error) {
      console.error("Failed to save agent:", error)
      throw error
    }
  }

  /**
   * Delete agent for wallet
   */
  async deleteAgent(walletAddress: string, agentId: string): Promise<void> {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AGENTS)
      if (!stored) return

      const allAgents = JSON.parse(stored) as Record<string, AIAgent[]>

      if (allAgents[walletAddress]) {
        allAgents[walletAddress] = allAgents[walletAddress].filter((a) => a.id !== agentId)
        localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(allAgents))
      }

      // Clean up execution logs
      const logsStored = localStorage.getItem(STORAGE_KEYS.EXECUTION_LOGS)
      if (logsStored) {
        const allLogs = JSON.parse(logsStored) as Record<string, AgentExecutionLog[]>
        delete allLogs[agentId]
        localStorage.setItem(STORAGE_KEYS.EXECUTION_LOGS, JSON.stringify(allLogs))
      }
    } catch (error) {
      console.error("Failed to delete agent:", error)
      throw error
    }
  }

  /**
   * Get agent by ID for a wallet (security: verify ownership)
   */
  async getAgent(walletAddress: string, agentId: string): Promise<AIAgent | null> {
    const agents = await this.getAgentsForWallet(walletAddress)
    return agents.find((a) => a.id === agentId) || null
  }

  /**
   * Log agent execution
   */
  async logExecution(agentId: string, log: AgentExecutionLog): Promise<void> {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXECUTION_LOGS)
      const allLogs = stored ? (JSON.parse(stored) as Record<string, AgentExecutionLog[]>) : {}

      if (!allLogs[agentId]) {
        allLogs[agentId] = []
      }

      allLogs[agentId].push(log)

      // Keep only last 100 logs per agent
      if (allLogs[agentId].length > 100) {
        allLogs[agentId] = allLogs[agentId].slice(-100)
      }

      localStorage.setItem(STORAGE_KEYS.EXECUTION_LOGS, JSON.stringify(allLogs))
    } catch (error) {
      console.error("Failed to log execution:", error)
    }
  }

  /**
   * Get execution logs for agent
   */
  async getExecutionLogs(agentId: string, limit = 50): Promise<AgentExecutionLog[]> {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.EXECUTION_LOGS)
      if (!stored) return []

      const allLogs = JSON.parse(stored) as Record<string, AgentExecutionLog[]>
      const logs = allLogs[agentId] || []

      return logs.slice(-limit).reverse()
    } catch (error) {
      console.error("Failed to get execution logs:", error)
      return []
    }
  }

  /**
   * Clear all data for wallet (on disconnect)
   */
  async clearWalletData(walletAddress: string): Promise<void> {
    if (typeof window === "undefined") return

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AGENTS)
      if (stored) {
        const allAgents = JSON.parse(stored) as Record<string, AIAgent[]>
        delete allAgents[walletAddress]
        localStorage.setItem(STORAGE_KEYS.AGENTS, JSON.stringify(allAgents))
      }
    } catch (error) {
      console.error("Failed to clear wallet data:", error)
    }
  }
}

export const agentStorage = new AgentStorageService()
