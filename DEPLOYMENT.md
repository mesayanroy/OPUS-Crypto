# OPUS AI Trading Platform - Production Deployment Guide

Complete guide for deploying the OPUS platform to production on Aptos Mainnet.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
3. [Backend MCP Server Deployment (Railway/Render)](#backend-mcp-server-deployment)
4. [Smart Contract Deployment](#smart-contract-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Monitoring & Logging](#monitoring--logging)
7. [Security Best Practices](#security-best-practices)
8. [Post-Deployment Validation](#post-deployment-validation)
9. [Rollback Procedures](#rollback-procedures)
10. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment Checklist

Before deploying to production:

- [ ] **Code Review**: All changes reviewed and tested in staging
- [ ] **Security Audit**: Smart contracts audited for vulnerabilities
- [ ] **Environment Variables**: All required secrets configured
- [ ] **Test Suite**: 100% of critical paths tested
- [ ] **Performance**: Load testing completed, no bottlenecks
- [ ] **Backup**: Database backups configured and tested
- [ ] **Monitoring**: Uptime monitoring and alerting set up
- [ ] **Documentation**: API documentation updated and published
- [ ] **Disaster Recovery**: Recovery procedures documented and tested
- [ ] **Compliance**: Legal review completed if applicable

### Required Secrets

```bash
# Frontend (.env.production)
NEXT_PUBLIC_APTOS_RPC=https://fullnode.mainnet.aptoslabs.com/v1
NEXT_PUBLIC_INDEXER_URL=https://indexer.mainnet.aptoslabs.com/graphql
NEXT_PUBLIC_MCP_SERVER_URL=https://mcp.opus-ai.io
ANTHROPIC_API_KEY=sk-ant-...

# Backend (backend/.env)
ANTHROPIC_API_KEY=sk-ant-...
MCP_PORT=3001
NODE_ENV=production
LOG_LEVEL=info
DATABASE_URL=local_storage
```

---

## Frontend Deployment (Vercel)

### Step 1: Prepare Frontend for Production

```bash
# 1. Navigate to project root
cd d:\OPUS-ai-crypto-Trade-

# 2. Run production build
npm run build

# 3. Test production build locally
npm run start

# 4. Verify no errors in build output
# Should see: "✓ Compiled successfully"
```

### Step 2: Deploy to Vercel

```bash
# Option A: Using Vercel CLI
npm i -g vercel
vercel --prod

# Option B: Using GitHub Integration
# 1. Push to GitHub main branch
git push origin main

# 2. Connect repository to Vercel at https://vercel.com
# 3. Vercel automatically deploys on main branch push
```

### Step 3: Configure Environment Variables in Vercel

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add production environment variables:

```
NEXT_PUBLIC_APTOS_RPC=https://fullnode.mainnet.aptoslabs.com/v1
NEXT_PUBLIC_INDEXER_URL=https://indexer.mainnet.aptoslabs.com/graphql
NEXT_PUBLIC_MCP_SERVER_URL=https://mcp.opus-ai.io
ANTHROPIC_API_KEY=sk-ant-...
```

3. Redeploy to apply environment variables:

```bash
vercel --prod --force
```

### Step 4: Set Up Custom Domain

1. In Vercel Dashboard → Domains
2. Add your custom domain (e.g., `trading.opus-ai.io`)
3. Update DNS records to point to Vercel
4. Enable SSL certificate (automatic)

### Step 5: Configure Edge Middleware (Optional - Advanced Security)

Create `middleware.ts` for edge-level security:

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next();
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

Deploy and verify:

```bash
npm run build && vercel --prod
```

---

## Backend MCP Server Deployment

### Option A: Railway.app (Recommended for Simplicity)

#### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up and connect GitHub
3. Create new project

#### Step 2: Deploy MCP Server

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login to Railway
railway login

# 3. Create project
railway init

# 4. Link to GitHub repository
railway link --repo mesayanroy/OPUS-ai-crypto-Trade-

# 5. Deploy
railway up --service mcp-server
```

#### Step 3: Configure Environment

```bash
railway variables set \
  ANTHROPIC_API_KEY=sk-ant-... \
  MCP_PORT=3001 \
  NODE_ENV=production \
  LOG_LEVEL=info
```

#### Step 4: Monitor Deployment

```bash
# View logs
railway logs -s mcp-server

# Check status
railway status
```

### Option B: Docker on Render.com

#### Step 1: Create Dockerfile

Already provided in `backend/Dockerfile`. Verify content:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY backend/ ./
EXPOSE 3001
CMD ["npm", "run", "dev:mcp"]
```

#### Step 2: Deploy to Render

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Configure:
   - **Name**: `opus-mcp-server`
   - **Region**: Frankfurt (or closest to Aptos RPC)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:mcp`
   - **Environment Variables**: Add ANTHROPIC_API_KEY, etc.

5. Deploy

#### Step 3: Set Up Auto-Redeployment

In Render Dashboard:
- Settings → Auto-Deploy → Enable

---

## Smart Contract Deployment

### Step 1: Compile Move Contract

```bash
# Navigate to contract directory
cd backend/contracts

# Install Aptos CLI
brew install aptos  # macOS
# or download from https://aptos.dev/en/build/cli

# Compile contract
aptos move compile --package-dir . --named-addresses OpusAI=default

# Should output:
# Compiling 'OpusAI::agent_approval'
# Compiling successful
```

### Step 2: Configure for Mainnet

```bash
# Set network to mainnet
aptos config set-network --network-name mainnet

# Verify configuration
aptos config show
# Should show: current_network: mainnet
```

### Step 3: Deploy Contract

```bash
# Fund account with test APT first (if needed)
aptos account fund-with-faucet --account default

# Deploy contract to mainnet
aptos move publish \
  --package-dir . \
  --named-addresses OpusAI=0x1234567890abcdef \
  --assume-yes

# Note: Replace 0x1234567890abcdef with your wallet address
```

Expected output:

```
Transaction submitted
Transaction hash: 0x...
Package ID: 0x...
```

### Step 4: Verify Deployment

```bash
# Check contract exists
aptos move view \
  --function-id 0x1234567890abcdef::agent_approval::get_approval \
  --args 0x...

# Or use indexer to verify
curl -X POST https://indexer.mainnet.aptoslabs.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { move_resources(where: { type_name: {_like: \"%agent_approval%\"} }) { address } }"
  }'
```

### Step 5: Document Contract Address

Create `backend/contracts/DEPLOYMENT.json`:

```json
{
  "mainnet": {
    "module_address": "0x1234567890abcdef",
    "module_name": "agent_approval",
    "deployment_tx": "0x...",
    "deployed_at": "2024-12-19T10:00:00Z",
    "verified": true
  }
}
```

---

## Environment Configuration

### Create `.env.production` for Frontend

```bash
# frontend/.env.production
NEXT_PUBLIC_APTOS_RPC=https://fullnode.mainnet.aptoslabs.com/v1
NEXT_PUBLIC_INDEXER_URL=https://indexer.mainnet.aptoslabs.com/graphql
NEXT_PUBLIC_MCP_SERVER_URL=https://mcp.opus-ai.io
NEXT_PUBLIC_NETWORK=mainnet
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Google Analytics
```

### Create `.env.production` for Backend

```bash
# backend/.env.production
NODE_ENV=production
MCP_PORT=3001
LOG_LEVEL=info
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=local_storage
APTOS_RPC_URL=https://fullnode.mainnet.aptoslabs.com/v1
APTOS_INDEXER_URL=https://indexer.mainnet.aptoslabs.com/graphql
```

### Validate Configuration

```bash
# Run validation script
node backend/scripts/validate-config.js

# Output should show:
# ✓ All required environment variables present
# ✓ APTOS RPC responding
# ✓ Indexer accessible
# ✓ Anthropic API key valid
```

---

## Monitoring & Logging

### Set Up Application Monitoring

#### Option A: Vercel Analytics (Frontend)

Already included with Vercel deployment. View in Vercel Dashboard → Analytics

#### Option B: Sentry for Error Tracking

1. Create Sentry account at https://sentry.io
2. Create new project (JavaScript/React)
3. Install Sentry SDK:

```bash
npm install @sentry/nextjs
```

4. Initialize in `app/layout.tsx`:

```typescript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### Set Up Uptime Monitoring

#### Using UptimeRobot (Free Tier Available)

1. Go to https://uptimerobot.com
2. Create account and login
3. Add monitors:

```
- Frontend: https://opus-ai.io (every 5 min)
- MCP Server: https://mcp.opus-ai.io/health (every 5 min)
```

4. Configure alerts:
   - Email notification on downtime
   - Slack webhook integration

### Configure Logging

#### Backend Logging with Winston

Already configured in `backend/mcp-server.ts`. Verify logging:

```typescript
// Log levels: error, warn, info, debug
console.log("[MCP] Server running on http://localhost:3001");
console.error("[MCP] Error details");
```

#### View Logs

**Railway**:
```bash
railway logs -s mcp-server --follow
```

**Render**:
```
Dashboard → Service → Logs (automatic)
```

**Local**:
```bash
tail -f ~/.opus/mcp.log
```

---

## Security Best Practices

### 1. Enable HTTPS Everywhere

- ✅ Vercel: Automatic SSL
- ✅ Railway: Automatic SSL
- ✅ Custom domains: Add SSL certificate

### 2. Secure Environment Variables

**Never commit secrets:**

```bash
# Good: Use .env.local (git-ignored)
echo "ANTHROPIC_API_KEY=sk-ant-..." > backend/.env.local

# Bad: Committing secrets ❌
git add backend/.env  # DON'T DO THIS
```

**Rotate secrets regularly:**

```bash
# 1. Generate new API key
# 2. Update in deployment platform
# 3. Verify application still works
# 4. Retire old key
```

### 3. Rate Limiting

Add rate limiting middleware:

```typescript
// backend/middleware/rate-limit.ts
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  keyGenerator: (req) => req.ip,
});

export default limiter;
```

Apply to routes:

```typescript
app.post("/api/execute-rule", limiter, async (req, res) => {
  // Handler
});
```

### 4. Smart Contract Security

**Before deployment:**

- [ ] Contract audited by security firm
- [ ] Formal verification completed
- [ ] No unchecked external calls
- [ ] All arithmetic checked for overflow/underflow
- [ ] Access control verified

**Deployment safety:**

```bash
# Deploy to testnet first
aptos move publish \
  --package-dir . \
  --network testnet \
  --assume-yes

# Wait 24 hours, monitor events
# If all good, deploy to mainnet
aptos move publish \
  --package-dir . \
  --network mainnet \
  --assume-yes
```

### 5. API Security

Add CORS restrictions:

```typescript
import cors from "cors";

app.use(cors({
  origin: "https://opus-ai.io",
  credentials: true,
}));
```

Add security headers:

```typescript
import helmet from "helmet";

app.use(helmet());
```

---

## Post-Deployment Validation

### Step 1: Smoke Tests

```bash
# Test frontend
curl -L https://opus-ai.io | grep "OPUS Trading" ✓

# Test MCP server health
curl https://mcp.opus-ai.io/health | jq .status
# Expected: "operational" ✓

# Test Aptos connectivity
curl -X POST https://fullnode.mainnet.aptoslabs.com/v1 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"ledger_info","params":[],"id":1}' \
  | jq .result.chain_id
# Expected: "mainnet" ✓
```

### Step 2: Functional Tests

**Wallet Connection:**
1. Open https://opus-ai.io
2. Click "Connect Wallet"
3. Select Aptos wallet (Petra/Martian)
4. Sign transaction
5. Verify wallet address displayed ✓

**Agent Creation:**
1. Navigate to Dashboard
2. Click "Create Agent"
3. Fill in agent details
4. Click "Create"
5. Verify agent appears in list ✓

**MCP Monitoring:**
1. Create agent with price trigger
2. Wait for trigger condition
3. Monitor MCP server logs
4. Verify execution attempt logged ✓

### Step 3: Performance Testing

```bash
# Load test frontend
ab -n 1000 -c 100 https://opus-ai.io

# Load test MCP API
ab -n 1000 -c 100 https://mcp.opus-ai.io/health

# Should see:
# - Requests/sec > 100
# - Failed requests: 0
# - Time per request: < 100ms
```

### Step 4: Security Validation

```bash
# Check SSL certificate
openssl s_client -connect opus-ai.io:443

# Verify security headers
curl -I https://opus-ai.io | grep -i "X-Content-Type-Options"
# Expected: X-Content-Type-Options: nosniff ✓

# OWASP ZAP scan
docker run -t owasp/zap2docker-stable zap-baseline.py -t https://opus-ai.io
```

---

## Rollback Procedures

### Rollback Frontend (Vercel)

```bash
# View deployment history
vercel ls

# Rollback to previous version
vercel rollback

# Or specify version
vercel rollback v1.2.3

# Verify rollback
vercel ls  # Should show new "Current" version
```

### Rollback MCP Server

**Railway:**
```bash
railway deployments list
railway deployments promote <PREVIOUS_DEPLOYMENT_ID>
```

**Render:**
```
Dashboard → Deployments → Select previous deployment → Click "Re-deploy"
```

### Rollback Smart Contract

**Note: Smart contracts on Aptos are immutable.**

For critical bugs, deploy a new contract version:

```bash
# Deploy new contract with different address
aptos move publish \
  --package-dir . \
  --network mainnet \
  --named-addresses OpusAI=0xNEWADDRESS \
  --assume-yes

# Update frontend to use new contract address
# Deploy updated frontend
vercel --prod --force
```

---

## Troubleshooting

### Issue: Frontend won't load

```bash
# Check build
npm run build

# Check environment variables
echo $NEXT_PUBLIC_APTOS_RPC

# Check server health
curl https://mcp.opus-ai.io/health

# View Vercel logs
vercel logs
```

### Issue: MCP Server unreachable

```bash
# Check server status
railway status  # Railway
# or
curl https://mcp.opus-ai.io/health

# View logs
railway logs -s mcp-server

# Restart server
railway redeploy
```

### Issue: Smart contract calls failing

```bash
# Check contract deployment
aptos move view \
  --function-id 0x...::agent_approval::get_approval \
  --args 0x...

# Check network
aptos config show

# Verify contract exists
curl https://indexer.mainnet.aptoslabs.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"query { move_modules(where: { address: {_eq: \"0x...\"} }) { address } }"}'
```

### Issue: High latency

```bash
# Check Aptos RPC response time
time curl https://fullnode.mainnet.aptoslabs.com/v1 \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"ledger_info","params":[],"id":1}'

# Consider using backup RPC:
# - https://aptos-rpc-1.allthatnode.com:8080 (AllThatNode)
# - https://rpc.ankr.com/http/aptos (Ankr)
```

### Issue: Database storage quota exceeded

```bash
# Clear old agent logs
rm ~/.opus/agents.log.*

# Archive logs
gzip ~/.opus/mcp.log

# Consider migrating to persistent storage:
# - MongoDB Atlas
# - PostgreSQL on Railway
# - Supabase
```

---

## Performance Optimization Checklist

- [ ] Enable CDN for static assets (Vercel does this automatically)
- [ ] Implement database query caching
- [ ] Use connection pooling for database
- [ ] Enable gzip compression on responses
- [ ] Lazy load components in frontend
- [ ] Optimize images and assets
- [ ] Monitor and optimize slow queries
- [ ] Scale horizontally if needed

---

## Disaster Recovery Plan

### Backup Strategy

```bash
# Daily backups of agent data
0 2 * * * cp ~/.opus/agents.json ~/.opus/backups/agents.$(date +%Y%m%d).json

# Weekly backups to cloud
0 3 * * 0 tar czf - ~/.opus | aws s3 cp - s3://opus-backups/weekly/$(date +%Y%m%d).tar.gz
```

### Recovery from Disaster

```bash
# 1. Identify affected service (frontend, backend, or contract)
# 2. Roll back to last known good version
# 3. Verify rollback succeeded
# 4. Investigate root cause
# 5. Deploy fix
# 6. Monitor closely for 24 hours
```

---

## Success Metrics

Track these metrics for production deployment:

- **Uptime**: > 99.9%
- **Response Time**: < 200ms p95
- **Error Rate**: < 0.1%
- **User Growth**: Track from day 1
- **Agent Performance**: Track win rate by agent
- **Transaction Volume**: Total APT swapped
- **Smart Contract Executions**: Total rules executed

---

## Support & Contact

For deployment issues:

- **Documentation**: https://docs.opus-ai.io
- **GitHub Issues**: https://github.com/mesayanroy/OPUS-ai-crypto-Trade-/issues
- **Email**: support@opus-ai.io
- **Discord**: https://discord.gg/opus-ai

---

**Last Updated**: December 19, 2024
**Version**: 1.0
