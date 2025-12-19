/// Agent Approval Smart Contract for OPUS AI Trading Platform
/// 
/// This contract manages AI agent trading approvals with security constraints:
/// - Maximum trade amount limits (no blind approvals)
/// - Expiry time enforcement
/// - Per-agent approval tracking
/// - Transaction history logging
/// - Wallet-based access control
///
/// Module: 0x1234567890abcdef::agent_approval
/// Deployed on: Aptos Mainnet/Testnet/Devnet

module OpusAI::agent_approval {
    use std::string::String;
    use std::vector;
    use aptos_framework::object::{Self, Object};
    use aptos_framework::account::{Self, SignerCapability};
    use aptos_framework::timestamp;
    use aptos_framework::event;

    // ============================================================================
    // Constants
    // ============================================================================

    const MAX_APPROVAL_AMOUNT: u64 = 1_000_000_000_000; // Max 10,000 APT in octas
    const DEFAULT_EXPIRY_DURATION: u64 = 3600; // 1 hour in seconds
    const MAX_EXECUTIONS_DEFAULT: u64 = 100;

    // Error codes
    const EAPPROVAL_NOT_FOUND: u64 = 1;
    const EAPPROVAL_EXPIRED: u64 = 2;
    const EAMOUNT_EXCEEDS_LIMIT: u64 = 3;
    const EEXECUTION_LIMIT_REACHED: u64 = 4;
    const ENOT_AUTHORIZED: u64 = 5;
    const EINVALID_AGENT_ID: u64 = 6;
    const EALREADY_ACTIVE: u64 = 7;

    // ============================================================================
    // Structs
    // ============================================================================

    /// Represents an approval for an AI agent to execute trades
    /// 
    /// Fields:
    /// - agent_id: Unique identifier for the AI agent
    /// - wallet_address: Address of the wallet that created this approval
    /// - token_in: Type of token to swap from (e.g., "APT")
    /// - token_out: Type of token to swap to (e.g., "USDC")
    /// - max_amount: Maximum amount this agent can trade per execution
    /// - expiry_time: Unix timestamp when this approval expires
    /// - max_executions: Maximum number of times this rule can execute
    /// - execution_count: Current number of executions
    /// - is_active: Whether this approval is currently active
    /// - created_at: Unix timestamp of approval creation
    /// - dex: Decentralized exchange to use (e.g., "liquidswap", "econia")
    /// - slippage: Maximum allowed slippage percentage (e.g., 50 = 0.5%)
    #[resource_group_member(group = "aptos_framework::object::ObjectGroup")]
    struct AgentApproval has key {
        agent_id: String,
        wallet_address: address,
        token_in: String,
        token_out: String,
        max_amount: u64,
        expiry_time: u64,
        max_executions: u64,
        execution_count: u64,
        is_active: bool,
        created_at: u64,
        dex: String,
        slippage: u64,
    }

    /// Execution history record for audit trail
    struct ExecutionRecord has store, copy, drop {
        approval_id: address,
        agent_id: String,
        amount: u64,
        executed_at: u64,
        transaction_hash: String,
        status: String, // "pending", "success", "failed"
    }

    /// Agent profile stored on-chain
    struct AgentProfile has key {
        agent_id: String,
        wallet_address: address,
        active_approvals: vector<address>,
        total_executions: u64,
        total_volume: u64,
        created_at: u64,
        reputation_score: u64, // 0-100
        approval_count: u64,
    }

    // ============================================================================
    // Events
    // ============================================================================

    #[event]
    struct ApprovalCreatedEvent has drop, store {
        approval_id: address,
        agent_id: String,
        wallet_address: address,
        max_amount: u64,
        expiry_time: u64,
        timestamp: u64,
    }

    #[event]
    struct ApprovalRevokedEvent has drop, store {
        approval_id: address,
        agent_id: String,
        wallet_address: address,
        timestamp: u64,
    }

    #[event]
    struct ExecutionAttemptedEvent has drop, store {
        approval_id: address,
        agent_id: String,
        amount: u64,
        success: bool,
        reason: String,
        timestamp: u64,
    }

    #[event]
    struct ApprovalExpiredEvent has drop, store {
        approval_id: address,
        agent_id: String,
        wallet_address: address,
        timestamp: u64,
    }

    // ============================================================================
    // Public Functions
    // ============================================================================

    /// Create a new approval for an AI agent to trade
    /// 
    /// Arguments:
    /// - signer: The wallet owner creating this approval
    /// - agent_id: Unique identifier for the agent
    /// - token_in: Input token type
    /// - token_out: Output token type
    /// - max_amount: Maximum amount per trade (in octas, e.g., 1_000_000_000_000 = 10 APT)
    /// - dex: Which DEX to use ("liquidswap", "econia", "panora")
    /// - slippage: Max slippage in basis points (50 = 0.5%)
    ///
    /// Example:
    /// ```
    /// agent_approval::create_approval(
    ///     signer,
    ///     string::utf8(b"my_trading_bot"),
    ///     string::utf8(b"APT"),
    ///     string::utf8(b"USDC"),
    ///     1_000_000_000_000,  // 10 APT max
    ///     string::utf8(b"liquidswap"),
    ///     50  // 0.5% max slippage
    /// )
    /// ```
    public entry fun create_approval(
        signer: &signer,
        agent_id: String,
        token_in: String,
        token_out: String,
        max_amount: u64,
        dex: String,
        slippage: u64,
    ) acquires AgentProfile {
        let wallet_address = signer::address_of(signer);

        // Validate inputs
        assert!(max_amount > 0 && max_amount <= MAX_APPROVAL_AMOUNT, EAMOUNT_EXCEEDS_LIMIT);
        assert!(slippage > 0 && slippage <= 10000, 9); // 0.01% to 100%

        // Get or create agent profile
        let profile_exists = exists<AgentProfile>(wallet_address);
        if (!profile_exists) {
            let agent_profile = AgentProfile {
                agent_id: agent_id,
                wallet_address,
                active_approvals: vector::empty(),
                total_executions: 0,
                total_volume: 0,
                created_at: timestamp::now_seconds(),
                reputation_score: 50, // Start at neutral 50
                approval_count: 0,
            };
            move_to(signer, agent_profile);
        };

        // Create approval object
        let approval = object::create_named_object(signer, agent_id);
        let approval_signer = object::generate_signer(&approval);
        let approval_id = object::object_address(&approval);

        let agent_approval = AgentApproval {
            agent_id,
            wallet_address,
            token_in,
            token_out,
            max_amount,
            expiry_time: timestamp::now_seconds() + DEFAULT_EXPIRY_DURATION,
            max_executions: MAX_EXECUTIONS_DEFAULT,
            execution_count: 0,
            is_active: true,
            created_at: timestamp::now_seconds(),
            dex,
            slippage,
        };

        move_to(&approval_signer, agent_approval);

        // Update agent profile
        let profile = borrow_global_mut<AgentProfile>(wallet_address);
        vector::push_back(&mut profile.active_approvals, approval_id);
        profile.approval_count = profile.approval_count + 1;

        // Emit event
        event::emit(ApprovalCreatedEvent {
            approval_id,
            agent_id,
            wallet_address,
            max_amount,
            expiry_time: timestamp::now_seconds() + DEFAULT_EXPIRY_DURATION,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Execute a trade using an approved agent
    /// 
    /// Arguments:
    /// - signer: The agent (or authorized caller)
    /// - approval_id: Address of the approval object
    /// - amount: Amount to trade
    /// - transaction_hash: Hash of the swap transaction for audit trail
    ///
    /// Returns: true if execution was successful, false otherwise
    /// 
    /// This function validates:
    /// 1. Approval exists and is active
    /// 2. Approval has not expired
    /// 3. Execution count hasn't exceeded limit
    /// 4. Trade amount doesn't exceed max_amount
    public fun execute_with_approval(
        approval_id: address,
        amount: u64,
        transaction_hash: String,
        wallet_address: address,
    ): bool acquires AgentApproval, AgentProfile {
        // Check if approval exists
        assert!(exists<AgentApproval>(approval_id), EAPPROVAL_NOT_FOUND);

        let approval = borrow_global_mut<AgentApproval>(approval_id);

        // Verify wallet authorization
        assert!(approval.wallet_address == wallet_address, ENOT_AUTHORIZED);

        // Check if approval is active
        assert!(approval.is_active, 6);

        // Check if expired
        if (timestamp::now_seconds() > approval.expiry_time) {
            approval.is_active = false;
            event::emit(ApprovalExpiredEvent {
                approval_id,
                agent_id: approval.agent_id,
                wallet_address: approval.wallet_address,
                timestamp: timestamp::now_seconds(),
            });
            return false;
        };

        // Check execution limit
        if (approval.execution_count >= approval.max_executions) {
            event::emit(ExecutionAttemptedEvent {
                approval_id,
                agent_id: approval.agent_id,
                amount,
                success: false,
                reason: string::utf8(b"execution_limit_reached"),
                timestamp: timestamp::now_seconds(),
            });
            return false;
        };

        // Check amount limit
        if (amount > approval.max_amount) {
            event::emit(ExecutionAttemptedEvent {
                approval_id,
                agent_id: approval.agent_id,
                amount,
                success: false,
                reason: string::utf8(b"amount_exceeds_limit"),
                timestamp: timestamp::now_seconds(),
            });
            return false;
        };

        // Increment execution counter and update volume
        approval.execution_count = approval.execution_count + 1;

        // Update agent profile stats
        let profile = borrow_global_mut<AgentProfile>(wallet_address);
        profile.total_executions = profile.total_executions + 1;
        profile.total_volume = profile.total_volume + amount;

        // Emit success event
        event::emit(ExecutionAttemptedEvent {
            approval_id,
            agent_id: approval.agent_id,
            amount,
            success: true,
            reason: string::utf8(b"executed"),
            timestamp: timestamp::now_seconds(),
        });

        true
    }

    /// Revoke an active approval
    /// 
    /// Only the wallet owner can revoke their own approvals
    public entry fun revoke_approval(
        signer: &signer,
        approval_id: address,
    ) acquires AgentApproval, AgentProfile {
        assert!(exists<AgentApproval>(approval_id), EAPPROVAL_NOT_FOUND);

        let approval = borrow_global_mut<AgentApproval>(approval_id);
        let wallet_address = signer::address_of(signer);

        // Verify authorization
        assert!(approval.wallet_address == wallet_address, ENOT_AUTHORIZED);

        approval.is_active = false;

        // Update profile
        let profile = borrow_global_mut<AgentProfile>(wallet_address);
        profile.approval_count = if (profile.approval_count > 0) {
            profile.approval_count - 1
        } else {
            0
        };

        event::emit(ApprovalRevokedEvent {
            approval_id,
            agent_id: approval.agent_id,
            wallet_address,
            timestamp: timestamp::now_seconds(),
        });
    }

    /// Get approval details (read-only)
    #[view]
    public fun get_approval(
        approval_id: address,
    ): (String, address, String, String, u64, u64, u64, u64, bool) acquires AgentApproval {
        assert!(exists<AgentApproval>(approval_id), EAPPROVAL_NOT_FOUND);
        let approval = borrow_global<AgentApproval>(approval_id);

        (
            approval.agent_id,
            approval.wallet_address,
            approval.token_in,
            approval.token_out,
            approval.max_amount,
            approval.expiry_time,
            approval.execution_count,
            approval.max_executions,
            approval.is_active,
        )
    }

    /// Get agent profile (read-only)
    #[view]
    public fun get_agent_profile(
        wallet_address: address,
    ): (String, u64, u64, u64, u64) acquires AgentProfile {
        assert!(exists<AgentProfile>(wallet_address), EINVALID_AGENT_ID);
        let profile = borrow_global<AgentProfile>(wallet_address);

        (
            profile.agent_id,
            profile.total_executions,
            profile.total_volume,
            profile.reputation_score,
            profile.approval_count,
        )
    }

    /// Check if approval is valid and can execute
    #[view]
    public fun is_approval_valid(
        approval_id: address,
        amount: u64,
    ): bool acquires AgentApproval {
        if (!exists<AgentApproval>(approval_id)) {
            return false;
        };

        let approval = borrow_global<AgentApproval>(approval_id);

        // Check all validity conditions
        approval.is_active
            && timestamp::now_seconds() <= approval.expiry_time
            && approval.execution_count < approval.max_executions
            && amount <= approval.max_amount
    }

    // ============================================================================
    // Helper Functions (Internal)
    // ============================================================================

    /// Initialize module (called once on deployment)
    fun init_module(signer: &signer) {
        // Initialize any module-level state here if needed
        let _signer = signer;
    }
}
