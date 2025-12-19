/**
 * API Client for OPUS AI Trading Platform
 * Connects frontend to Express backend endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Auth token management
let authToken: string | null = null

export function setAuthToken(token: string) {
  authToken = token
  if (typeof window !== "undefined") {
    localStorage.setItem("opus_auth_token", token)
  }
}

export function getAuthToken(): string | null {
  if (authToken) return authToken
  if (typeof window !== "undefined") {
    authToken = localStorage.getItem("opus_auth_token")
  }
  return authToken
}

export function clearAuthToken() {
  authToken = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("opus_auth_token")
  }
}

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = getAuthToken()
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || "API request failed")
    }

    return data
  } catch (error: any) {
    console.error(`API Error [${endpoint}]:`, error)
    return {
      success: false,
      error: error.message || "An error occurred",
    }
  }
}

// Authentication API
export const authApi = {
  register: async (data: { email: string; password: string; fullName: string }) => {
    return apiRequest<{ token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  login: async (data: { email: string; password: string }) => {
    return apiRequest<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  getProfile: async () => {
    return apiRequest<any>("/auth/me")
  },
}

// Wallet API
export const walletApi = {
  connect: async (data: { address: string; chain: string; signature?: string }) => {
    return apiRequest("/wallet/connect", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  list: async () => {
    return apiRequest<any[]>("/wallet/list")
  },

  disconnect: async (address: string) => {
    return apiRequest(`/wallet/disconnect/${address}`, {
      method: "DELETE",
    })
  },
}

// Trading API
export const tradingApi = {
  getHistory: async (limit = 50, skip = 0) => {
    return apiRequest<any[]>(`/trading/history?limit=${limit}&skip=${skip}`)
  },

  placeOrder: async (order: {
    type: "buy" | "sell" | "swap"
    fromToken: any
    toToken: any
    amount: number
    estimatedPrice: number
  }) => {
    return apiRequest<any>("/trading/order", {
      method: "POST",
      body: JSON.stringify(order),
    })
  },

  getProposals: async () => {
    return apiRequest<any[]>("/trading/proposals")
  },

  executeProposal: async (proposalId: string) => {
    return apiRequest<any>(`/trading/proposals/${proposalId}/execute`, {
      method: "POST",
    })
  },
}

// Portfolio API
export const portfolioApi = {
  get: async (chain?: string) => {
    const query = chain ? `?chain=${chain}` : ""
    return apiRequest<any>(`/portfolio${query}`)
  },

  update: async (data: {
    chain: string
    assets: any[]
    metrics: any
  }) => {
    return apiRequest("/portfolio/update", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },
}

// AI Agent API
export const aiAgentApi = {
  list: async () => {
    return apiRequest<any[]>("/ai-agents")
  },

  create: async (agent: {
    name: string
    config: any
  }) => {
    return apiRequest<any>("/ai-agents", {
      method: "POST",
      body: JSON.stringify(agent),
    })
  },

  update: async (id: string, updates: any) => {
    return apiRequest<any>(`/ai-agents/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    })
  },

  delete: async (id: string) => {
    return apiRequest(`/ai-agents/${id}`, {
      method: "DELETE",
    })
  },

  toggle: async (id: string) => {
    return apiRequest<any>(`/ai-agents/${id}/toggle`, {
      method: "POST",
    })
  },
}

export default {
  auth: authApi,
  wallet: walletApi,
  trading: tradingApi,
  portfolio: portfolioApi,
  aiAgent: aiAgentApi,
}
