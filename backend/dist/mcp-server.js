"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
class MCPServer {
    constructor(port = 3001) {
        this.conversationHistory = [];
        this.port = port;
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        this.wss = new ws_1.WebSocketServer({ server: this.server });
        this.client = new sdk_1.default({
            apiKey: process.env.ANTHROPIC_API_KEY,
        });
        this.setupMiddleware();
        this.setupRoutes();
        this.setupWebSocket();
    }
    setupMiddleware() {
        this.app.use(express_1.default.json());
        this.app.use((req, res, next) => {
            console.log(`[MCP] ${req.method} ${req.path}`);
            next();
        });
    }
    setupRoutes() {
        // Health check
        this.app.get("/health", (req, res) => {
            res.json({
                status: "operational",
                timestamp: new Date().toISOString(),
                version: "1.0.0",
            });
        });
        // Evaluate trigger condition
        this.app.post("/api/evaluate-trigger", (req, res) => {
            const { trigger, currentPrice, currentVolume } = req.body;
            const result = this.evaluateTrigger(trigger, currentPrice, currentVolume);
            res.json({ triggered: result });
        });
        // Execute rule (with approval check)
        this.app.post("/api/execute-rule", async (req, res) => {
            const { rule, walletAddress } = req.body;
            if (!this.validateRuleExecution(rule, walletAddress)) {
                return res.status(400).json({ error: "Rule validation failed" });
            }
            try {
                const execution = await this.executeRule(rule);
                res.json(execution);
            }
            catch (error) {
                res.status(500).json({ error: String(error) });
            }
        });
        // List active agents
        this.app.get("/api/agents/:walletAddress", (req, res) => {
            const { walletAddress } = req.params;
            // This would fetch from localStorage in browser or database
            res.json({
                walletAddress,
                agents: [],
                activeRules: 0,
            });
        });
        // Start agent monitoring
        this.app.post("/api/agents/:walletAddress/start", (req, res) => {
            const { walletAddress } = req.params;
            const { agentId } = req.body;
            res.json({
                agentId,
                walletAddress,
                status: "monitoring_started",
                timestamp: new Date().toISOString(),
            });
        });
        // Stop agent monitoring
        this.app.post("/api/agents/:walletAddress/stop", (req, res) => {
            const { walletAddress } = req.params;
            const { agentId } = req.body;
            res.json({
                agentId,
                walletAddress,
                status: "monitoring_stopped",
                timestamp: new Date().toISOString(),
            });
        });
        // Request wallet signature for transaction
        this.app.post("/api/request-signature", (req, res) => {
            const { walletAddress, transaction, rule } = req.body;
            res.json({
                walletAddress,
                requiresApproval: true,
                rule: {
                    id: rule.id,
                    action: rule.action,
                    maxAmount: rule.action.amount * 1.1, // Add 10% buffer
                    expiryTime: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
                },
                signatureRequired: true,
                message: `Approve trade: ${rule.action.tokenIn} → ${rule.action.tokenOut}`,
            });
        });
        // AI-assisted agent analysis
        this.app.post("/api/ai-analysis", async (req, res) => {
            const { query, agentMetrics } = req.body;
            try {
                const response = await this.analyzeWithAI(query, agentMetrics);
                res.json({ analysis: response });
            }
            catch (error) {
                res.status(500).json({ error: String(error) });
            }
        });
        // Batch execute rules
        this.app.post("/api/batch-execute", async (req, res) => {
            const { rules, walletAddress } = req.body;
            const results = await Promise.all(rules.map((rule) => this.executeRule(rule)));
            res.json({
                walletAddress,
                executed: results.length,
                results,
                timestamp: new Date().toISOString(),
            });
        });
    }
    setupWebSocket() {
        this.wss.on("connection", (ws) => {
            console.log("[MCP] WebSocket client connected");
            ws.on("message", async (data) => {
                try {
                    const message = JSON.parse(data);
                    if (message.type === "agent_query") {
                        const response = await this.handleAgentQuery(message.payload);
                        ws.send(JSON.stringify({ type: "agent_response", payload: response }));
                    }
                    else if (message.type === "trigger_status") {
                        ws.send(JSON.stringify({
                            type: "trigger_update",
                            payload: { agentId: message.agentId, status: "monitoring" },
                        }));
                    }
                    else if (message.type === "execution_request") {
                        const result = await this.executeRule(message.rule);
                        ws.send(JSON.stringify({ type: "execution_result", payload: result }));
                    }
                }
                catch (error) {
                    ws.send(JSON.stringify({ type: "error", error: String(error) }));
                }
            });
            ws.on("close", () => {
                console.log("[MCP] WebSocket client disconnected");
            });
            // Send heartbeat
            const heartbeat = setInterval(() => {
                if (ws.readyState === 1) {
                    ws.send(JSON.stringify({ type: "heartbeat", timestamp: Date.now() }));
                }
            }, 30000);
            ws.on("close", () => clearInterval(heartbeat));
        });
    }
    evaluateTrigger(trigger, currentPrice, currentVolume) {
        switch (trigger.type) {
            case "price_above":
                return currentPrice > trigger.targetValue;
            case "price_below":
                return currentPrice < trigger.targetValue;
            case "price_change": {
                const tolerance = trigger.tolerance || 5;
                const change = Math.abs((currentPrice - trigger.targetValue) / trigger.targetValue) * 100;
                return change > tolerance;
            }
            case "volume_above":
                return currentVolume > trigger.targetValue;
            case "time_interval":
                return true; // Time-based triggers always evaluate to true in this context
            case "manual":
                return false; // Manual triggers require explicit invocation
            default:
                return false;
        }
    }
    validateRuleExecution(rule, walletAddress) {
        // Check if rule is active
        if (!rule.isActive)
            return false;
        // Check execution limit
        if (rule.maxExecutions && rule.executionCount >= rule.maxExecutions) {
            return false;
        }
        // Check expiry time
        if (rule.expiryTime && Date.now() > rule.expiryTime) {
            return false;
        }
        // Check approval signature
        if (!rule.approvalSignature) {
            return false;
        }
        return true;
    }
    async executeRule(rule) {
        console.log(`[MCP] Executing rule: ${rule.id}`);
        // Simulate rule execution
        return {
            ruleId: rule.id,
            status: "pending_signature",
            requiresWalletApproval: true,
            estimatedOutcome: {
                inputAmount: rule.action.amount,
                estimatedOutput: rule.action.amount * 0.99, // Account for slippage
                slippage: rule.action.slippage,
            },
            transactionHash: null,
            executedAt: new Date().toISOString(),
            nextCheckIn: Math.random() * 60000, // Next check in 0-60 seconds
        };
    }
    async handleAgentQuery(query) {
        // Add to conversation history
        this.conversationHistory.push({
            role: "user",
            content: query,
        });
        // Keep conversation history limited to last 20 messages
        if (this.conversationHistory.length > 20) {
            this.conversationHistory = this.conversationHistory.slice(-20);
        }
        try {
            const response = await this.client.messages.create({
                model: "claude-3-5-sonnet-20241022",
                max_tokens: 1024,
                system: `You are an expert AI trading agent advisor for the OPUS platform. 
You help users understand trading strategies, agent configurations, and risk management.
Always emphasize the importance of wallet security and approval limits on trades.
Provide concise, actionable advice.`,
                messages: this.conversationHistory.map((msg) => ({
                    role: msg.role,
                    content: msg.content,
                })),
            });
            const assistantMessage = response.content[0].type === "text" ? response.content[0].text : "Unable to generate response";
            // Add assistant response to history
            this.conversationHistory.push({
                role: "assistant",
                content: assistantMessage,
            });
            return assistantMessage;
        }
        catch (error) {
            console.error("[MCP] AI analysis error:", error);
            throw error;
        }
    }
    async analyzeWithAI(query, agentMetrics) {
        const context = agentMetrics
            ? `Agent Metrics:\n${JSON.stringify(agentMetrics, null, 2)}\n\n`
            : "";
        const fullQuery = `${context}User Query: ${query}`;
        return this.handleAgentQuery(fullQuery);
    }
    start() {
        this.server.listen(this.port, () => {
            console.log(`[MCP] Server running on http://localhost:${this.port}`);
            console.log(`[MCP] Health check: http://localhost:${this.port}/health`);
            console.log(`[MCP] WebSocket: ws://localhost:${this.port}`);
        });
    }
    stop() {
        this.server.close(() => {
            console.log("[MCP] Server stopped");
        });
    }
}
// Start server if this is the main module
if (require.main === module) {
    const server = new MCPServer(parseInt(process.env.MCP_PORT || "3001"));
    server.start();
    // Graceful shutdown
    process.on("SIGINT", () => {
        console.log("[MCP] Received SIGINT, shutting down gracefully...");
        server.stop();
        process.exit(0);
    });
}
exports.default = MCPServer;
