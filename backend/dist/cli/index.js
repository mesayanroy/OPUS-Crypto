#!/usr/bin/env ts-node
"use strict";
/**
 * OPUS AI Trading Platform - CLI Tool
 *
 * Commands:
 * - agent list [--wallet ADDRESS]
 * - agent create [--name NAME] [--dex DEX] [--tokens TOKEN_IN,TOKEN_OUT]
 * - agent start [--id AGENT_ID]
 * - agent stop [--id AGENT_ID]
 * - agent delete [--id AGENT_ID]
 * - agent status [--id AGENT_ID]
 * - agent logs [--id AGENT_ID] [--lines COUNT]
 * - mcp health
 * - mcp start
 * - mcp stop
 * - wallet connect
 * - wallet disconnect
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAgents = loadAgents;
exports.saveAgents = saveAgents;
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const CONFIG_DIR = path_1.default.join(process.env.HOME || process.env.USERPROFILE || ".", ".opus");
const AGENTS_FILE = path_1.default.join(CONFIG_DIR, "agents.json");
const MCP_LOG_FILE = path_1.default.join(CONFIG_DIR, "mcp.log");
// Ensure config directory exists
function ensureConfigDir() {
    if (!fs_1.default.existsSync(CONFIG_DIR)) {
        fs_1.default.mkdirSync(CONFIG_DIR, { recursive: true });
    }
}
// Load agents from file
function loadAgents() {
    ensureConfigDir();
    if (!fs_1.default.existsSync(AGENTS_FILE)) {
        return [];
    }
    try {
        return JSON.parse(fs_1.default.readFileSync(AGENTS_FILE, "utf-8"));
    }
    catch {
        return [];
    }
}
// Save agents to file
function saveAgents(agents) {
    ensureConfigDir();
    fs_1.default.writeFileSync(AGENTS_FILE, JSON.stringify(agents, null, 2));
}
// Log MCP operations
function logMCPOperation(message) {
    ensureConfigDir();
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;
    fs_1.default.appendFileSync(MCP_LOG_FILE, logEntry);
}
// Get MCP server URL (default: localhost:3001)
function getMCPUrl() {
    return process.env.MCP_URL || "http://localhost:3001";
}
// Check MCP health
async function checkMCPHealth() {
    try {
        const response = await (0, node_fetch_1.default)(`${getMCPUrl()}/health`);
        return response.ok;
    }
    catch {
        return false;
    }
}
// Agent list command
async function agentList(walletAddress) {
    const agents = loadAgents();
    if (agents.length === 0) {
        console.log(chalk_1.default.yellow("No agents found. Create one with: opus agent create"));
        return;
    }
    const filtered = walletAddress ? agents.filter((a) => a.walletAddress === walletAddress) : agents;
    if (filtered.length === 0) {
        console.log(chalk_1.default.yellow(`No agents found for wallet: ${walletAddress}`));
        return;
    }
    console.log(chalk_1.default.cyan("\n📊 OPUS AI Trading Agents\n"));
    console.table(filtered.map((agent) => ({
        ID: agent.id.substring(0, 8) + "...",
        Name: agent.name,
        Status: agent.status === "running" ? chalk_1.default.green(agent.status) : chalk_1.default.yellow(agent.status),
        DEX: agent.dex,
        "Pair": `${agent.tokenIn}/${agent.tokenOut}`,
        Executions: agent.executionCount,
        Volume: `${(agent.totalVolume / 1e8).toFixed(2)} APT`,
    })));
}
// Agent create command
async function agentCreate(name, dex, tokenPair) {
    const agents = loadAgents();
    const [tokenIn, tokenOut] = tokenPair.split(",").map((t) => t.trim());
    if (!tokenIn || !tokenOut) {
        console.error(chalk_1.default.red("Error: Invalid token pair. Use: TOKEN_IN,TOKEN_OUT"));
        process.exit(1);
    }
    const agent = {
        id: `agent_${Date.now()}`,
        name,
        walletAddress: process.env.OPUS_WALLET || "0x0",
        status: "idle",
        dex,
        tokenIn,
        tokenOut,
        maxAmount: 1000000000000, // 10 APT
        slippage: 50, // 0.5%
        createdAt: Date.now(),
        executionCount: 0,
        totalVolume: 0,
    };
    agents.push(agent);
    saveAgents(agents);
    console.log(chalk_1.default.green(`✓ Agent created: ${agent.id}`));
    console.log(chalk_1.default.gray(`  Name: ${agent.name}`));
    console.log(chalk_1.default.gray(`  DEX: ${agent.dex}`));
    console.log(chalk_1.default.gray(`  Pair: ${agent.tokenIn}/${agent.tokenOut}`));
    logMCPOperation(`Created agent: ${agent.id} (${agent.name})`);
}
// Agent start command
async function agentStart(agentId) {
    const agents = loadAgents();
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) {
        console.error(chalk_1.default.red(`Agent not found: ${agentId}`));
        process.exit(1);
    }
    agent.status = "running";
    agent.startedAt = Date.now();
    saveAgents(agents);
    console.log(chalk_1.default.green(`✓ Agent started: ${agent.name}`));
    logMCPOperation(`Started agent: ${agentId}`);
    // Notify MCP server
    try {
        await (0, node_fetch_1.default)(`${getMCPUrl()}/api/agents/${agent.walletAddress}/start`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ agentId }),
        });
    }
    catch (error) {
        console.warn(chalk_1.default.yellow("Warning: Could not notify MCP server"));
    }
}
// Agent stop command
async function agentStop(agentId) {
    const agents = loadAgents();
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) {
        console.error(chalk_1.default.red(`Agent not found: ${agentId}`));
        process.exit(1);
    }
    agent.status = "stopped";
    agent.stoppedAt = Date.now();
    saveAgents(agents);
    console.log(chalk_1.default.green(`✓ Agent stopped: ${agent.name}`));
    logMCPOperation(`Stopped agent: ${agentId}`);
    // Notify MCP server
    try {
        await (0, node_fetch_1.default)(`${getMCPUrl()}/api/agents/${agent.walletAddress}/stop`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ agentId }),
        });
    }
    catch (error) {
        console.warn(chalk_1.default.yellow("Warning: Could not notify MCP server"));
    }
}
// Agent delete command
async function agentDelete(agentId) {
    const agents = loadAgents();
    const index = agents.findIndex((a) => a.id === agentId);
    if (index === -1) {
        console.error(chalk_1.default.red(`Agent not found: ${agentId}`));
        process.exit(1);
    }
    const agent = agents[index];
    agents.splice(index, 1);
    saveAgents(agents);
    console.log(chalk_1.default.green(`✓ Agent deleted: ${agent.name}`));
    logMCPOperation(`Deleted agent: ${agentId}`);
}
// Agent status command
async function agentStatus(agentId) {
    const agents = loadAgents();
    const agent = agents.find((a) => a.id === agentId);
    if (!agent) {
        console.error(chalk_1.default.red(`Agent not found: ${agentId}`));
        process.exit(1);
    }
    console.log(chalk_1.default.cyan(`\n📌 Agent: ${agent.name}\n`));
    console.log(`  ID: ${agent.id}`);
    console.log(`  Status: ${agent.status === "running" ? chalk_1.default.green(agent.status) : chalk_1.default.yellow(agent.status)}`);
    console.log(`  DEX: ${agent.dex}`);
    console.log(`  Pair: ${agent.tokenIn}/${agent.tokenOut}`);
    console.log(`  Max Amount: ${(agent.maxAmount / 1e8).toFixed(2)} APT`);
    console.log(`  Slippage: ${(agent.slippage / 100).toFixed(2)}%`);
    console.log(`  Created: ${new Date(agent.createdAt).toLocaleString()}`);
    console.log(`  Executions: ${agent.executionCount}`);
    console.log(`  Total Volume: ${(agent.totalVolume / 1e8).toFixed(2)} APT`);
    if (agent.startedAt) {
        console.log(`  Started: ${new Date(agent.startedAt).toLocaleString()}`);
    }
    if (agent.stoppedAt) {
        console.log(`  Stopped: ${new Date(agent.stoppedAt).toLocaleString()}`);
    }
    console.log();
}
// Agent logs command
async function agentLogs(agentId, lines = 20) {
    console.log(chalk_1.default.cyan(`\n📋 MCP Server Logs (last ${lines} lines)\n`));
    if (!fs_1.default.existsSync(MCP_LOG_FILE)) {
        console.log(chalk_1.default.yellow("No logs found"));
        return;
    }
    const content = fs_1.default.readFileSync(MCP_LOG_FILE, "utf-8");
    const logLines = content.split("\n");
    const recentLines = logLines.slice(-lines);
    recentLines.forEach((line) => {
        if (line) {
            if (agentId && line.includes(agentId)) {
                console.log(chalk_1.default.yellow(line));
            }
            else if (!agentId) {
                console.log(line);
            }
        }
    });
    console.log();
}
// MCP health command
async function mcpHealth() {
    try {
        const isHealthy = await checkMCPHealth();
        if (isHealthy) {
            console.log(chalk_1.default.green("✓ MCP Server is running and healthy"));
        }
        else {
            console.log(chalk_1.default.red("✗ MCP Server is not responding"));
            process.exit(1);
        }
    }
    catch (error) {
        console.log(chalk_1.default.red(`✗ Cannot connect to MCP Server at ${getMCPUrl()}`));
        process.exit(1);
    }
}
// MCP start command (placeholder - actual start would be in systemd/docker)
function mcpStart() {
    console.log(chalk_1.default.green("✓ To start MCP server, run:"));
    console.log(chalk_1.default.gray("  npm run dev:mcp"));
    console.log(chalk_1.default.gray("  OR"));
    console.log(chalk_1.default.gray("  docker-compose up mcp-server"));
}
// MCP stop command (placeholder)
function mcpStop() {
    console.log(chalk_1.default.green("✓ To stop MCP server, run:"));
    console.log(chalk_1.default.gray("  Ctrl+C in the terminal running the MCP server"));
}
// Main CLI setup
const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
    .command("agent list [wallet]", "List all AI agents", (yargs) => yargs.positional("wallet", { describe: "Filter by wallet address", type: "string" }), (argv) => agentList(argv.wallet))
    .command("agent create <name> <dex> <tokens>", "Create a new AI agent", (yargs) => yargs
    .positional("name", { describe: "Agent name", type: "string" })
    .positional("dex", { describe: "DEX (liquidswap, econia, panora)", type: "string" })
    .positional("tokens", { describe: "Token pair (e.g., APT,USDC)", type: "string" }), (argv) => agentCreate(argv.name, argv.dex, argv.tokens))
    .command("agent start <id>", "Start monitoring an agent", (yargs) => yargs.positional("id", { describe: "Agent ID", type: "string" }), (argv) => agentStart(argv.id))
    .command("agent stop <id>", "Stop monitoring an agent", (yargs) => yargs.positional("id", { describe: "Agent ID", type: "string" }), (argv) => agentStop(argv.id))
    .command("agent delete <id>", "Delete an agent", (yargs) => yargs.positional("id", { describe: "Agent ID", type: "string" }), (argv) => agentDelete(argv.id))
    .command("agent status <id>", "Show agent status", (yargs) => yargs.positional("id", { describe: "Agent ID", type: "string" }), (argv) => agentStatus(argv.id))
    .command("agent logs [id] [lines]", "Show agent execution logs", (yargs) => yargs
    .positional("id", { describe: "Agent ID (optional)", type: "string" })
    .positional("lines", { describe: "Number of lines to show", type: "number", default: 20 }), (argv) => agentLogs(argv.id, argv.lines))
    .command("mcp health", "Check MCP server health", {}, () => mcpHealth())
    .command("mcp start", "Start MCP server", {}, () => mcpStart())
    .command("mcp stop", "Stop MCP server", {}, () => mcpStop())
    .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Verbose output",
})
    .help()
    .alias("help", "h")
    .version()
    .alias("version", "V");
argv.parseAsync().catch((error) => {
    console.error(chalk_1.default.red("Error:"), error.message);
    process.exit(1);
});
