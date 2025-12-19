#!/usr/bin/env ts-node
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

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import chalk from "chalk";
import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const CONFIG_DIR = path.join(process.env.HOME || process.env.USERPROFILE || ".", ".opus");
const AGENTS_FILE = path.join(CONFIG_DIR, "agents.json");
const MCP_LOG_FILE = path.join(CONFIG_DIR, "mcp.log");

interface Agent {
  id: string;
  name: string;
  walletAddress: string;
  status: "idle" | "running" | "paused" | "stopped";
  dex: string;
  tokenIn: string;
  tokenOut: string;
  maxAmount: number;
  slippage: number;
  createdAt: number;
  startedAt?: number;
  stoppedAt?: number;
  executionCount: number;
  totalVolume: number;
}

// Ensure config directory exists
function ensureConfigDir() {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true });
  }
}

// Load agents from file
function loadAgents(): Agent[] {
  ensureConfigDir();
  if (!fs.existsSync(AGENTS_FILE)) {
    return [];
  }
  try {
    return JSON.parse(fs.readFileSync(AGENTS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

// Save agents to file
function saveAgents(agents: Agent[]): void {
  ensureConfigDir();
  fs.writeFileSync(AGENTS_FILE, JSON.stringify(agents, null, 2));
}

// Log MCP operations
function logMCPOperation(message: string): void {
  ensureConfigDir();
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  fs.appendFileSync(MCP_LOG_FILE, logEntry);
}

// Get MCP server URL (default: localhost:3001)
function getMCPUrl(): string {
  return process.env.MCP_URL || "http://localhost:3001";
}

// Check MCP health
async function checkMCPHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${getMCPUrl()}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

// Agent list command
async function agentList(walletAddress?: string) {
  const agents = loadAgents();

  if (agents.length === 0) {
    console.log(chalk.yellow("No agents found. Create one with: opus agent create"));
    return;
  }

  const filtered = walletAddress ? agents.filter((a) => a.walletAddress === walletAddress) : agents;

  if (filtered.length === 0) {
    console.log(chalk.yellow(`No agents found for wallet: ${walletAddress}`));
    return;
  }

  console.log(chalk.cyan("\n📊 OPUS AI Trading Agents\n"));
  console.table(
    filtered.map((agent) => ({
      ID: agent.id.substring(0, 8) + "...",
      Name: agent.name,
      Status: agent.status === "running" ? chalk.green(agent.status) : chalk.yellow(agent.status),
      DEX: agent.dex,
      "Pair": `${agent.tokenIn}/${agent.tokenOut}`,
      Executions: agent.executionCount,
      Volume: `${(agent.totalVolume / 1e8).toFixed(2)} APT`,
    }))
  );
}

// Agent create command
async function agentCreate(name: string, dex: string, tokenPair: string) {
  const agents = loadAgents();
  const [tokenIn, tokenOut] = tokenPair.split(",").map((t) => t.trim());

  if (!tokenIn || !tokenOut) {
    console.error(chalk.red("Error: Invalid token pair. Use: TOKEN_IN,TOKEN_OUT"));
    process.exit(1);
  }

  const agent: Agent = {
    id: `agent_${Date.now()}`,
    name,
    walletAddress: process.env.OPUS_WALLET || "0x0",
    status: "idle",
    dex,
    tokenIn,
    tokenOut,
    maxAmount: 1_000_000_000_000, // 10 APT
    slippage: 50, // 0.5%
    createdAt: Date.now(),
    executionCount: 0,
    totalVolume: 0,
  };

  agents.push(agent);
  saveAgents(agents);

  console.log(chalk.green(`✓ Agent created: ${agent.id}`));
  console.log(chalk.gray(`  Name: ${agent.name}`));
  console.log(chalk.gray(`  DEX: ${agent.dex}`));
  console.log(chalk.gray(`  Pair: ${agent.tokenIn}/${agent.tokenOut}`));

  logMCPOperation(`Created agent: ${agent.id} (${agent.name})`);
}

// Agent start command
async function agentStart(agentId: string) {
  const agents = loadAgents();
  const agent = agents.find((a) => a.id === agentId);

  if (!agent) {
    console.error(chalk.red(`Agent not found: ${agentId}`));
    process.exit(1);
  }

  agent.status = "running";
  agent.startedAt = Date.now();
  saveAgents(agents);

  console.log(chalk.green(`✓ Agent started: ${agent.name}`));
  logMCPOperation(`Started agent: ${agentId}`);

  // Notify MCP server
  try {
    await fetch(`${getMCPUrl()}/api/agents/${agent.walletAddress}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId }),
    });
  } catch (error) {
    console.warn(chalk.yellow("Warning: Could not notify MCP server"));
  }
}

// Agent stop command
async function agentStop(agentId: string) {
  const agents = loadAgents();
  const agent = agents.find((a) => a.id === agentId);

  if (!agent) {
    console.error(chalk.red(`Agent not found: ${agentId}`));
    process.exit(1);
  }

  agent.status = "stopped";
  agent.stoppedAt = Date.now();
  saveAgents(agents);

  console.log(chalk.green(`✓ Agent stopped: ${agent.name}`));
  logMCPOperation(`Stopped agent: ${agentId}`);

  // Notify MCP server
  try {
    await fetch(`${getMCPUrl()}/api/agents/${agent.walletAddress}/stop`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId }),
    });
  } catch (error) {
    console.warn(chalk.yellow("Warning: Could not notify MCP server"));
  }
}

// Agent delete command
async function agentDelete(agentId: string) {
  const agents = loadAgents();
  const index = agents.findIndex((a) => a.id === agentId);

  if (index === -1) {
    console.error(chalk.red(`Agent not found: ${agentId}`));
    process.exit(1);
  }

  const agent = agents[index];
  agents.splice(index, 1);
  saveAgents(agents);

  console.log(chalk.green(`✓ Agent deleted: ${agent.name}`));
  logMCPOperation(`Deleted agent: ${agentId}`);
}

// Agent status command
async function agentStatus(agentId: string) {
  const agents = loadAgents();
  const agent = agents.find((a) => a.id === agentId);

  if (!agent) {
    console.error(chalk.red(`Agent not found: ${agentId}`));
    process.exit(1);
  }

  console.log(chalk.cyan(`\n📌 Agent: ${agent.name}\n`));
  console.log(`  ID: ${agent.id}`);
  console.log(`  Status: ${agent.status === "running" ? chalk.green(agent.status) : chalk.yellow(agent.status)}`);
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
async function agentLogs(agentId?: string, lines: number = 20) {
  console.log(chalk.cyan(`\n📋 MCP Server Logs (last ${lines} lines)\n`));

  if (!fs.existsSync(MCP_LOG_FILE)) {
    console.log(chalk.yellow("No logs found"));
    return;
  }

  const content = fs.readFileSync(MCP_LOG_FILE, "utf-8");
  const logLines = content.split("\n");
  const recentLines = logLines.slice(-lines);

  recentLines.forEach((line) => {
    if (line) {
      if (agentId && line.includes(agentId)) {
        console.log(chalk.yellow(line));
      } else if (!agentId) {
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
      console.log(chalk.green("✓ MCP Server is running and healthy"));
    } else {
      console.log(chalk.red("✗ MCP Server is not responding"));
      process.exit(1);
    }
  } catch (error) {
    console.log(chalk.red(`✗ Cannot connect to MCP Server at ${getMCPUrl()}`));
    process.exit(1);
  }
}

// MCP start command (placeholder - actual start would be in systemd/docker)
function mcpStart() {
  console.log(chalk.green("✓ To start MCP server, run:"));
  console.log(chalk.gray("  npm run dev:mcp"));
  console.log(chalk.gray("  OR"));
  console.log(chalk.gray("  docker-compose up mcp-server"));
}

// MCP stop command (placeholder)
function mcpStop() {
  console.log(chalk.green("✓ To stop MCP server, run:"));
  console.log(chalk.gray("  Ctrl+C in the terminal running the MCP server"));
}

// Main CLI setup
const argv = yargs(hideBin(process.argv))
  .command(
    "agent list [wallet]",
    "List all AI agents",
    (yargs) => yargs.positional("wallet", { describe: "Filter by wallet address", type: "string" }),
    (argv) => agentList(argv.wallet as string | undefined)
  )
  .command(
    "agent create <name> <dex> <tokens>",
    "Create a new AI agent",
    (yargs) =>
      yargs
        .positional("name", { describe: "Agent name", type: "string" })
        .positional("dex", { describe: "DEX (liquidswap, econia, panora)", type: "string" })
        .positional("tokens", { describe: "Token pair (e.g., APT,USDC)", type: "string" }),
    (argv) => agentCreate(argv.name as string, argv.dex as string, argv.tokens as string)
  )
  .command(
    "agent start <id>",
    "Start monitoring an agent",
    (yargs) => yargs.positional("id", { describe: "Agent ID", type: "string" }),
    (argv) => agentStart(argv.id as string)
  )
  .command(
    "agent stop <id>",
    "Stop monitoring an agent",
    (yargs) => yargs.positional("id", { describe: "Agent ID", type: "string" }),
    (argv) => agentStop(argv.id as string)
  )
  .command(
    "agent delete <id>",
    "Delete an agent",
    (yargs) => yargs.positional("id", { describe: "Agent ID", type: "string" }),
    (argv) => agentDelete(argv.id as string)
  )
  .command(
    "agent status <id>",
    "Show agent status",
    (yargs) => yargs.positional("id", { describe: "Agent ID", type: "string" }),
    (argv) => agentStatus(argv.id as string)
  )
  .command(
    "agent logs [id] [lines]",
    "Show agent execution logs",
    (yargs) =>
      yargs
        .positional("id", { describe: "Agent ID (optional)", type: "string" })
        .positional("lines", { describe: "Number of lines to show", type: "number", default: 20 }),
    (argv) => agentLogs(argv.id as string | undefined, argv.lines as number)
  )
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
  console.error(chalk.red("Error:"), error.message);
  process.exit(1);
});

export { Agent, loadAgents, saveAgents };
