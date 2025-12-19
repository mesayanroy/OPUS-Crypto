# OPUS Technical Documentation

**Complete technical guide for the Aptos AI Trading Platform**

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Wallet-Only Authentication](#wallet-only-authentication)
3. [AI Agent Lifecycle](#ai-agent-lifecycle)
4. [Smart Contract Integration](#smart-contract-integration)
5. [Local MCP Server](#local-mcp-server)
6. [CLI Tooling](#cli-tooling)
7. [Indexer Integration](#indexer-integration)
8. [Deployment Guide](#deployment-guide)

---

## Architecture Overview

### System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        User's Browser                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  OPUS Frontend (Next.js)                                │  │
│  │  • Dashboard                                           │  │
│  │  • Agent Builder                                       │  │
│  │  • Wallet Connector                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                     │                          │               │
│                     ▼                          ▼               │
│           ┌────────────────────┐    ┌──────────────────┐     │
│           │ Aptos Wallet Ext.  │    │  localStorage    │     │
│           │  (Petra, Martian)  │    │  (agents, logs)  │     │
│           └────────────────────┘    └──────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
         │                                    │
         │ Wallet signature                  │
         │ + transaction data                │ Local config
         │                                    │
         ▼                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│              User's Machine (Optional MCP Server)               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  MCP Agent Runtime                                      │  │
│  │  • Trigger monitoring                                   │  │
│  │  • Transaction building                                │  │
│  │  • Execution logging                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                            │                                    │
│                            │ Signed TX                          │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  Aptos Blockchain            │
              │  • RPC node                  │
              │  • Ledger state              │
              │  • Smart contracts           │
              └──────────────────────────────┘
                             ▲
                             │ Query data
                             │
              ┌──────────────────────────────┐
              │  Aptos Indexer               │
              │  (Graphql API)               │
              └──────────────────────────────┘
```

### Component Breakdown

| Component | Location | Purpose |
|-----------|----------|---------|
| **Frontend** | `app/`, `components/` | User interface |
| **Wallet Context** | `lib/web3/aptos-context.tsx` | Wallet state mgmt (no auth) |
| **Agent Storage** | `lib/web3/agent-storage.ts` | localStorage persistence |
| **MCP Server** | `backend/mcp-server.ts` | Local agent runtime |
| **CLI** | `backend/cli/` | Agent management from terminal |

---

## Wallet-Only Authentication

### Philosophy

No email, password, or database users. **User identity = Wallet address.**

### Implementation

**File**: `lib/web3/aptos-context.tsx`

```typescript
export interface AptosUser {
  walletAddress: string // Primary identifier
  isConnected: boolean
  isLoading: boolean
}

const AptosContext = createContext<AptosContextType | null>(null)

export function AptosProvider({ children }: { children: ReactNode }) {
  const { account, connected, connecting } = useWallet()
  
  // User identity derived from wallet
  const user: AptosUser | null = connected
    ? {
        walletAddress: account?.address || "",
        isConnected: true,
        isLoading: connecting,
      }
    : null

  return <AptosContext.Provider value={{ user, ... }}>
    {children}
  </AptosContext.Provider>
}
```

### Data Isolation

All user data is stored **by wallet address**:

```typescript
// Agents indexed by wallet
{
  "opus_agents": {
    "0x1234...": [ /* agents for this wallet */ ],
    "0x5678...": [ /* agents for that wallet */ ]
  }
}

// Execution logs indexed by agent
{
  "opus_exec_logs": {
    "agent_123": [ /* logs */ ],
    "agent_456": [ /* logs */ ]
  }
}
```

### Security

- ✅ No password attacks possible
- ✅ User controls private key (in wallet extension)
- ✅ We never request signatures for "auth" (only transactions)
- ✅ Easy multi-wallet support (same user, different wallets)

---

## AI Agent Lifecycle

### 1. Creation

**User Flow**:
1. Opens AI Agent Builder
2. Configures trigger, action, limits
3. Clicks "Save & Enable"

**Code**:
```typescript
// Create agent
const agent: AIAgent = {
  id: `agent_${Date.now()}...`,
  walletAddress,
  name: "My Trading Bot",
  strategy: "manual",
  rules: [...], // User-configured
  status: "active",
  performance: { /* initial */ },
  limits: { /* from config */ },
  createdAt: Date.now(),
  updatedAt: Date.now(),
  isRunningLocally: false, // Set to true when MCP starts
}

// Save locally
await agentStorage.saveAgent(walletAddress, agent)
```

### 2. Storage

**File**: `lib/web3/agent-storage.ts`

Agents stored in **browser localStorage** (indexed by wallet):

```typescript
// Fetch agent for wallet
const agents = await agentStorage.getAgentsForWallet(walletAddress)
// Returns: AIAgent[]

// Save/update agent
await agentStorage.saveAgent(walletAddress, agent)
// Persists to localStorage

// Get agent by ID (with ownership check)
const agent = await agentStorage.getAgent(walletAddress, agentId)
// Returns: AIAgent | null
```

### 3. Execution (Local MCP)

**When user enables agent**:

1. Frontend sends agent config to local MCP server
2. MCP server starts monitoring trigger
3. Every N seconds:
   - Fetch on-chain data from Aptos indexer
   - Evaluate trigger condition (e.g., price > $10)
4. If trigger met:
   - Build transaction payload
   - Emit "needs signature" event to frontend
5. User sees signature request in wallet
6. User approves in wallet extension
7. MCP submits signed transaction
8. Log execution in `executionLogs`

### 4. Example Agent Rule

```typescript
const rule: AgentExecutionRule = {
  trigger: {
    type: "price_above",
    targetValue: 10, // $10
    tolerance: 0.5,  // ±$0.50
  },
  actions: [
    {
      type: "swap",
      dex: "LIQUIDSWAP",
      tokenIn: "0x1::aptos_coin::AptosCoin", // APT
      tokenOut: "0xf22b...::coin::USDC",      // USDC
      amountIn: 100,
      maxSlippage: 0.5, // 0.5%
      requiresApproval: true,
    },
  ],
  enabled: true,
  createdAt: Date.now(),
  approvalSignature: "0x...", // User signed rule
  executionCount: 0,
}
```

### 5. Performance Tracking

After each execution:

```typescript
agent.performance = {
  totalExecutions: agent.performance.totalExecutions + 1,
  successfulTrades: /* +1 if success */,
  failedTrades: /* +1 if failed */,
  totalPnl: /* new PnL */,
  roi: /* (PnL / initial) * 100 */,
}

await agentStorage.saveAgent(walletAddress, agent)
```

---

## Smart Contract Integration

### Approval Model

Every trade requires:

1. **Function** `approveAgent(agentId, maxAmount, expiryTime)`
   - Called once per agent setup
   - Grants agent limited approval on behalf of user
   - Max amount & expiry prevent abuse

2. **Trade Function** `executeAgentTrade(agentId, payload)`
   - Called by MCP server after user signs
   - Validates payload against approved limits
   - Executes trade on behalf of user

### Security Constraints

```solidity
struct AgentApproval {
    address agentOwner;
    uint256 maxAmount;
    uint64 expiryTime;
    bool enabled;
}

mapping(uint256 agentId => AgentApproval) public approvals;

function executeAgentTrade(
    uint256 agentId,
    uint256 amount,
    bytes calldata swapPayload
) external {
    AgentApproval storage approval = approvals[agentId];
    require(approval.enabled, "Agent not approved");
    require(block.timestamp < approval.expiryTime, "Approval expired");
    require(amount <= approval.maxAmount, "Amount exceeds limit");
    require(msg.sender == approval.agentOwner, "Unauthorized");
    
    // Execute swap
    _executeSwap(agentId, amount, swapPayload);
}
```

### No Blind Approvals

Users see:
- ✅ Exact amount limit
- ✅ Expiry date
- ✅ Wallet signature confirmation
- ✅ Gas estimate before signing

---

## Local MCP Server

### What is MCP?

**Model Context Protocol**: A standard for agents to interact with tools. Here, our MCP server:

- Monitors on-chain data
- Evaluates agent triggers
- Requests wallet signatures
- Submits transactions

### Installation

```bash
npm install -g @modelcontextprotocol/sdk
```

### Configuration

**File**: `public/mcp-config/agent-config.json`

```json
{
  "agentId": "agent_abc123",
  "walletAddress": "0x1234...",
  "rpcUrl": "https://fullnode.mainnet.aptoslabs.com/v1",
  "indexerUrl": "https://indexer.mainnet.aptoslabs.com/graphql",
  "checkInterval": 30000,
  "maxConcurrentTxs": 1,
  "enableDryRun": true
}
```

### Start MCP Server

```bash
# Manual start
cd backend
ts-node mcp-server.ts --config ../public/mcp-config/agent-config.json

# Or via CLI
opus-cli agent start --id agent_abc123 --wallet 0x1234...
```

### MCP Resource URIs

| URI | Method | Purpose |
|-----|--------|---------|
| `aptos://agent/{agentId}` | read | Get agent config |
| `aptos://agent/{agentId}/logs` | read | Get execution logs |
| `aptos://agent/{agentId}/trigger` | read | Evaluate trigger |
| `aptos://dex/{dexName}/quote` | read | Get DEX quote |
| `aptos://wallet/{address}/balance` | read | Get balance |

### Example MCP Call

```typescript
// Frontend requests trigger evaluation
const response = await mcpClient.resources.read({
  uri: "aptos://agent/agent_abc123/trigger",
})

// MCP returns:
{
  triggerMet: true,
  currentPrice: 10.5,
  triggerPrice: 10,
  action: { /* prepared action */ },
  signature_needed: true,
}

// Frontend shows signature modal
```

---

## CLI Tooling

### Installation

```bash
npm install -g opus-cli
# or
pip install opus-cli-python
```

### Commands

#### List Agents

```bash
opus-cli agent list --wallet 0x1234...

# Output:
# ID                    Name            Status    PnL
# agent_abc123         My Bot          active    +50.23 APT
# agent_xyz789         Copy Trader     inactive  -10.12 APT
```

#### Create Agent

```bash
opus-cli agent create \
  --name "DCA Bot" \
  --strategy trend_following \
  --config my-agent.json

# Interactive setup guides user through creation
```

#### Start Agent

```bash
opus-cli agent start --id agent_abc123

# Starts MCP server monitoring for this agent
```

#### Stop Agent

```bash
opus-cli agent stop --id agent_abc123
```

#### View Logs

```bash
opus-cli agent logs --id agent_abc123 --limit 20

# Output:
# Timestamp           Action      Status    PnL
# 2025-12-19 10:30   SWAP APT→USDC  Success  +2.50 APT
# 2025-12-19 09:00   SWAP APT→USDC  Success  +1.75 APT
```

---

## Indexer Integration

### Query Patterns

#### Get User's Recent Trades

```graphql
query GetUserTrades($address: String!, $limit: Int!) {
  coin_activities(
    where: {
      user: { _eq: $address }
      transaction_version: { _desc: true }
    }
    limit: $limit
  ) {
    transaction_version
    coin_type
    amount
    activity_type
    timestamp
  }
}
```

#### Get Token Price (via Liquidswap Pool)

```graphql
query GetTokenPrice($token: String!) {
  liquidswap_pools(
    where: {
      coins_with_x: { _contains: $token }
    }
    limit: 1
  ) {
    x_amount
    y_amount
    x_coin_type
    y_coin_type
  }
}
```

#### Monitor Agent Execution

```graphql
query GetAgentExecutions($agent_id: String!) {
  user_transactions(
    where: {
      payload: { _contains: { agent_id: $agent_id } }
    }
    limit: 50
  ) {
    version
    hash
    success
    timestamp
  }
}
```

---

## Deployment Guide

### Frontend Deployment (Vercel)

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy Aptos trading platform"
git push origin main

# 2. Vercel auto-deploys
# Set environment variables in Vercel dashboard:
# NEXT_PUBLIC_APTOS_CHAIN=mainnet
```

### Backend/MCP Deployment (Railway)

```bash
# 1. Link Railway project
railway link

# 2. Set environment variables
railway variables set APTOS_RPC_URL="https://fullnode.mainnet.aptoslabs.com/v1"
railway variables set APTOS_INDEXER_URL="https://indexer.mainnet.aptoslabs.com/graphql"
railway variables set PORT=3001

# 3. Deploy
railway up
```

### Production Checklist

- [ ] Use Aptos **Mainnet** (not testnet)
- [ ] Set `NEXT_PUBLIC_APTOS_CHAIN=mainnet`
- [ ] Verify RPC rate limits
- [ ] Configure monitoring for agent executions
- [ ] Set up Sentry for error tracking
- [ ] Enable HTTPS on all domains
- [ ] Test wallet connection with Petra
- [ ] Load test MCP server
- [ ] Document recovery procedures

---

## Troubleshooting

### Wallet Not Connecting

1. Check if extension installed: Petra, Martian, Pontem, or Hippo
2. Verify wallet is unlocked
3. Check browser console for errors
4. Try different wallet extension
5. Clear localStorage: `localStorage.clear()`

### Agent Not Executing

1. Check if MCP server running: `opus-cli agent status`
2. Verify trigger condition: `opus-cli agent logs`
3. Check Aptos indexer up: `curl https://indexer.mainnet.aptoslabs.com/graphql`
4. Verify wallet has APT for gas
5. Restart MCP: `opus-cli agent restart --id <id>`

### Transaction Failed

1. Check gas price: `opus-cli agent debug --id <id>`
2. Verify token pair exists on DEX
3. Check slippage tolerance (try increasing)
4. Verify approval not expired
5. Check Aptos RPC status

---

## Security Audit Checklist

- [ ] Private keys never stored on servers
- [ ] All transactions require wallet signature
- [ ] Approval limits enforced per-rule
- [ ] No "approve all" functions
- [ ] Agent execution confined to MCP process
- [ ] Indexer queries don't leak wallet data
- [ ] CLI commands don't expose secrets
- [ ] localStorage cleared on disconnect

---

**Last updated**: Dec 19, 2025  
**Version**: 1.0.0  
**Status**: Production Ready
