/**
 * Aptos Indexer Integration Service
 * 
 * Queries Aptos blockchain via GraphQL indexer for:
 * - Account balances and assets
 * - Trading history and events
 * - Token prices and volumes
 * - Agent execution monitoring
 * - Transaction status tracking
 * 
 * Indexer Endpoint: https://indexer.mainnet.aptoslabs.com/graphql
 */

import fetch from "node-fetch";

const INDEXER_URL = "https://indexer.mainnet.aptoslabs.com/graphql";

interface CoinBalance {
  coinType: string;
  amount: string;
  metadata?: {
    decimals: number;
    name: string;
    symbol: string;
  };
}

interface TokenPrice {
  coinType: string;
  price: number;
  priceChange24h: number;
  volume24h: string;
  marketCap: string;
  lastUpdated: number;
}

interface TradeEvent {
  transactionHash: string;
  timestamp: number;
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
  dex: string;
  status: "success" | "failed" | "pending";
}

interface AgentExecution {
  ruleId: string;
  agentId: string;
  walletAddress: string;
  trigger: string;
  action: string;
  timestamp: number;
  transactionHash: string;
  status: "pending" | "success" | "failed";
  amount: string;
}

class AptosIndexerService {
  private indexerUrl: string;

  constructor(indexerUrl: string = INDEXER_URL) {
    this.indexerUrl = indexerUrl;
  }

  /**
   * Execute a GraphQL query against the Aptos indexer
   */
  private async executeQuery(query: string, variables?: Record<string, any>): Promise<any> {
    try {
      const response = await fetch(this.indexerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          variables: variables || {},
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = (await response.json()) as any;

      if (data.errors) {
        throw new Error(`GraphQL Error: ${data.errors[0]?.message}`);
      }

      return data.data;
    } catch (error) {
      console.error("[Indexer] Query failed:", error);
      throw error;
    }
  }

  /**
   * Get all coin balances for a wallet address
   *
   * Example:
   * ```
   * const balances = await indexer.getCoinBalances("0x1234...");
   * console.log(balances); // [{ coinType: "0x1::aptos_coin::AptosCoin", amount: "1000000" }]
   * ```
   */
  async getCoinBalances(walletAddress: string): Promise<CoinBalance[]> {
    const query = `
      query GetBalances($address: String!) {
        current_coin_balances(
          where: { owner_address: { _eq: $address } }
          order_by: { last_transaction_version: desc }
        ) {
          coin_type
          amount
        }
      }
    `;

    const data = await this.executeQuery(query, { address: walletAddress });
    return data.current_coin_balances || [];
  }

  /**
   * Get specific coin balance (e.g., APT balance)
   */
  async getCoinBalance(walletAddress: string, coinType: string): Promise<string> {
    const query = `
      query GetBalance($address: String!, $coinType: String!) {
        current_coin_balances(
          where: { 
            owner_address: { _eq: $address }
            coin_type: { _eq: $coinType }
          }
        ) {
          amount
        }
      }
    `;

    const data = await this.executeQuery(query, {
      address: walletAddress,
      coinType,
    });

    const balance = data.current_coin_balances?.[0];
    return balance?.amount || "0";
  }

  /**
   * Get swap events for a wallet (trading history)
   *
   * Example:
   * ```
   * const trades = await indexer.getSwapEvents("0x1234...", 0, 10);
   * // Returns last 10 swap transactions
   * ```
   */
  async getSwapEvents(
    walletAddress: string,
    offset: number = 0,
    limit: number = 20
  ): Promise<TradeEvent[]> {
    const query = `
      query GetSwaps($address: String!, $offset: Int!, $limit: Int!) {
        events(
          where: {
            account_address: { _eq: $address }
            event_type: { _ilike: "%swap%Event%" }
          }
          order_by: { transaction_version: desc }
          offset: $offset
          limit: $limit
        ) {
          transaction_hash
          transaction_version
          event_index
          event_type
          data
          indexed_type
          inserted_at
        }
      }
    `;

    const data = await this.executeQuery(query, {
      address: walletAddress,
      offset,
      limit,
    });

    // Parse swap events
    return (
      data.events?.map((event: any) => ({
        transactionHash: event.transaction_hash,
        timestamp: Math.floor(new Date(event.inserted_at).getTime() / 1000),
        tokenIn: this.extractTokenFromSwapEvent(event.data, "token_in"),
        tokenOut: this.extractTokenFromSwapEvent(event.data, "token_out"),
        amountIn: this.extractAmountFromSwapEvent(event.data, "amount_in"),
        amountOut: this.extractAmountFromSwapEvent(event.data, "amount_out"),
        dex: this.extractDexFromEventType(event.event_type),
        status: "success", // Indexer only returns confirmed events
      })) || []
    );
  }

  /**
   * Get token price from indexed price data
   *
   * Note: This requires a price feed integration (e.g., Switchboard, Pyth)
   * For now, returns mock data - integrate real price oracle for production
   */
  async getTokenPrice(coinType: string): Promise<TokenPrice> {
    // In production, integrate with:
    // - Switchboard Oracle (switchboard.xyz)
    // - Pyth Network (pyth.network)
    // - Or run your own price aggregator

    // Mock implementation
    const priceMap: Record<string, number> = {
      "0x1::aptos_coin::AptosCoin": 12.5,
      "0x5e4a221b811c61df06f2dc47b92e51de37213eb6a8460b53875cb290217e2e81::usdc::USDC": 1.0,
      "0x7d7e436f0b921221386289490fae4842d4d87d38540f5c5ecfb996f502ccead5::usdt::USDT": 1.001,
    };

    const price = priceMap[coinType] || 0;

    return {
      coinType,
      price,
      priceChange24h: (Math.random() - 0.5) * 10, // Mock data
      volume24h: String(Math.floor(Math.random() * 1e15)),
      marketCap: String(Math.floor(Math.random() * 1e18)),
      lastUpdated: Math.floor(Date.now() / 1000),
    };
  }

  /**
   * Get agent execution events (contract events from agent approvals)
   *
   * Queries ExecutionAttemptedEvent and ApprovalExpiredEvent
   */
  async getAgentExecutions(
    walletAddress: string,
    agentId?: string,
    limit: number = 50
  ): Promise<AgentExecution[]> {
    const query = `
      query GetAgentExecutions($address: String!, $limit: Int!) {
        events(
          where: {
            account_address: { _eq: $address }
            event_type: { _ilike: "%ExecutionAttemptedEvent%" }
          }
          order_by: { transaction_version: desc }
          limit: $limit
        ) {
          transaction_hash
          transaction_version
          data
          inserted_at
        }
      }
    `;

    const data = await this.executeQuery(query, {
      address: walletAddress,
      limit,
    });

    // Parse execution events
    return (
      data.events?.map((event: any) => ({
        ruleId: this.extractFieldFromEvent(event.data, "approval_id"),
        agentId: this.extractFieldFromEvent(event.data, "agent_id"),
        walletAddress,
        trigger: "smart_contract_event",
        action: "trade_execution",
        timestamp: Math.floor(new Date(event.inserted_at).getTime() / 1000),
        transactionHash: event.transaction_hash,
        status: this.extractFieldFromEvent(event.data, "success") === "true" ? "success" : "failed",
        amount: this.extractFieldFromEvent(event.data, "amount"),
      })) || []
    );
  }

  /**
   * Get account transaction history
   *
   * Useful for monitoring all wallet activity
   */
  async getAccountTransactions(
    walletAddress: string,
    offset: number = 0,
    limit: number = 20
  ): Promise<any[]> {
    const query = `
      query GetTransactions($address: String!, $offset: Int!, $limit: Int!) {
        transactions(
          where: { sender_address: { _eq: $address } }
          order_by: { version: desc }
          offset: $offset
          limit: $limit
        ) {
          hash
          version
          timestamp
          success
          gas_used
          gas_unit_price
          entry_function_id_str
        }
      }
    `;

    const data = await this.executeQuery(query, {
      address: walletAddress,
      offset,
      limit,
    });

    return data.transactions || [];
  }

  /**
   * Check if a specific transaction was successful
   */
  async getTransactionStatus(transactionHash: string): Promise<"success" | "failed" | "pending"> {
    const query = `
      query GetTransactionStatus($hash: String!) {
        transactions(where: { hash: { _eq: $hash } }) {
          success
          version
        }
      }
    `;

    const data = await this.executeQuery(query, { hash: transactionHash });
    const tx = data.transactions?.[0];

    if (!tx) return "pending";
    return tx.success ? "success" : "failed";
  }

  /**
   * Get DEX trade volume (requires integration with DEX event streams)
   *
   * For LiquidSwap, Econia, Panora
   */
  async getDEXVolume(dex: string, period: "24h" | "7d" | "30d" = "24h"): Promise<string> {
    // Mock implementation - in production, aggregate actual DEX events
    const volumes: Record<string, string> = {
      liquidswap: "50000000000000", // ~500,000 APT
      econia: "25000000000000", // ~250,000 APT
      panora: "10000000000000", // ~100,000 APT
    };

    return volumes[dex] || "0";
  }

  /**
   * Monitor trigger conditions via indexer
   *
   * Polls for price changes, volume changes, etc.
   */
  async monitorTrigger(
    tokenPair: [string, string],
    triggerType: "price_above" | "price_below" | "volume_above",
    targetValue: number
  ): Promise<boolean> {
    try {
      const priceIn = await this.getTokenPrice(tokenPair[0]);
      const priceOut = await this.getTokenPrice(tokenPair[1]);
      const price = priceIn.price / priceOut.price;

      switch (triggerType) {
        case "price_above":
          return price > targetValue;
        case "price_below":
          return price < targetValue;
        case "volume_above":
          return parseInt(priceIn.volume24h) > targetValue;
        default:
          return false;
      }
    } catch (error) {
      console.error("[Indexer] Trigger monitoring failed:", error);
      return false;
    }
  }

  // Helper methods
  private extractTokenFromSwapEvent(eventData: any, field: string): string {
    // Parse from event data structure
    if (typeof eventData === "string") {
      try {
        const parsed = JSON.parse(eventData);
        return parsed[field] || "UNKNOWN";
      } catch {
        return "UNKNOWN";
      }
    }
    return eventData[field] || "UNKNOWN";
  }

  private extractAmountFromSwapEvent(eventData: any, field: string): string {
    if (typeof eventData === "string") {
      try {
        const parsed = JSON.parse(eventData);
        return parsed[field] || "0";
      } catch {
        return "0";
      }
    }
    return eventData[field] || "0";
  }

  private extractDexFromEventType(eventType: string): string {
    if (eventType.includes("liquidswap")) return "liquidswap";
    if (eventType.includes("econia")) return "econia";
    if (eventType.includes("panora")) return "panora";
    return "unknown";
  }

  private extractFieldFromEvent(eventData: any, field: string): string {
    if (typeof eventData === "string") {
      try {
        const parsed = JSON.parse(eventData);
        return parsed[field] || "";
      } catch {
        return "";
      }
    }
    return eventData[field] || "";
  }
}

// Export singleton instance
export const aptosIndexer = new AptosIndexerService();
export { AptosIndexerService, CoinBalance, TokenPrice, TradeEvent, AgentExecution };
