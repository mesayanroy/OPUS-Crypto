# OPUS AI Trading Platform - Quick Start Script
# Run this in PowerShell from the project root

Write-Host "🚀 OPUS AI Trading Platform - Quick Start" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if MongoDB is running
Write-Host "📊 Checking MongoDB status..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

if ($null -eq $mongoService) {
    Write-Host "⚠️  MongoDB service not found. Please install MongoDB first." -ForegroundColor Red
    Write-Host "   Download: https://www.mongodb.com/try/download/community" -ForegroundColor Yellow
    Write-Host ""
} elseif ($mongoService.Status -ne "Running") {
    Write-Host "⚠️  MongoDB is not running. Starting MongoDB..." -ForegroundColor Yellow
    try {
        Start-Service -Name MongoDB
        Write-Host "✅ MongoDB started successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to start MongoDB. Please start it manually:" -ForegroundColor Red
        Write-Host "   net start MongoDB" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ MongoDB is already running!" -ForegroundColor Green
}

Write-Host ""

# Check if .env exists
Write-Host "🔧 Checking environment configuration..." -ForegroundColor Yellow
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  Backend .env file not found. Creating from template..." -ForegroundColor Yellow
    if (Test-Path "backend\.env.example") {
        Copy-Item "backend\.env.example" "backend\.env"
        Write-Host "✅ Created backend\.env - Please update with your settings!" -ForegroundColor Green
        Write-Host "   Important: Set JWT_SECRET to a random string" -ForegroundColor Yellow
    } else {
        Write-Host "❌ .env.example not found. Please create backend\.env manually." -ForegroundColor Red
    }
} else {
    Write-Host "✅ Backend .env file exists!" -ForegroundColor Green
}

if (-not (Test-Path ".env.local")) {
    Write-Host "⚠️  Frontend .env.local not found. Creating..." -ForegroundColor Yellow
    "NEXT_PUBLIC_API_URL=http://localhost:3001/api" | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "✅ Created .env.local!" -ForegroundColor Green
} else {
    Write-Host "✅ Frontend .env.local exists!" -ForegroundColor Green
}

Write-Host ""

# Check Node.js
Write-Host "🔍 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion installed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Check pnpm
Write-Host "📦 Checking pnpm installation..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm v$pnpmVersion installed!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  pnpm not found. Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
    Write-Host "✅ pnpm installed!" -ForegroundColor Green
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🎯 Ready to start OPUS platform!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Choose how to run:" -ForegroundColor Yellow
Write-Host "1. Backend + Frontend (separate terminals) - Recommended for development" -ForegroundColor White
Write-Host "2. Backend only" -ForegroundColor White
Write-Host "3. Frontend only" -ForegroundColor White
Write-Host "4. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Starting Backend + Frontend..." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📝 Instructions:" -ForegroundColor Yellow
        Write-Host "  - Backend will start on http://localhost:3001" -ForegroundColor White
        Write-Host "  - Frontend will start on http://localhost:3000" -ForegroundColor White
        Write-Host "  - Press Ctrl+C in each terminal to stop" -ForegroundColor White
        Write-Host ""
        
        # Start backend in new terminal
        Write-Host "Starting backend in new terminal..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host '🔧 Backend Server' -ForegroundColor Cyan; cd backend; `$env:NODE_ENV='development'; ts-node server.ts"
        
        Start-Sleep -Seconds 2
        
        # Start frontend in new terminal
        Write-Host "Starting frontend in new terminal..." -ForegroundColor Yellow
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host '🎨 Frontend Server' -ForegroundColor Cyan; pnpm dev"
        
        Write-Host ""
        Write-Host "✅ Both servers starting in separate terminals!" -ForegroundColor Green
        Write-Host "   Backend: http://localhost:3001/api" -ForegroundColor Cyan
        Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "   Health Check: http://localhost:3001/health" -ForegroundColor Cyan
    }
    
    "2" {
        Write-Host ""
        Write-Host "🔧 Starting Backend only..." -ForegroundColor Cyan
        Write-Host ""
        cd backend
        $env:NODE_ENV = "development"
        ts-node server.ts
    }
    
    "3" {
        Write-Host ""
        Write-Host "🎨 Starting Frontend only..." -ForegroundColor Cyan
        Write-Host ""
        pnpm dev
    }
    
    "4" {
        Write-Host ""
        Write-Host "👋 Exiting..." -ForegroundColor Yellow
        exit 0
    }
    
    default {
        Write-Host ""
        Write-Host "❌ Invalid choice. Exiting..." -ForegroundColor Red
        exit 1
    }
}
