import express, { Express, Request, Response, NextFunction } from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"

// Load environment variables
dotenv.config()

// Import routes
import authRoutes from "./routes/auth.routes"
import walletRoutes from "./routes/wallet.routes"
import tradingRoutes from "./routes/trading.routes"
import portfolioRoutes from "./routes/portfolio.routes"
import aiAgentRoutes from "./routes/ai-agent.routes"

const app: Express = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  })
})

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/wallet", walletRoutes)
app.use("/api/trading", tradingRoutes)
app.use("/api/portfolio", portfolioRoutes)
app.use("/api/ai-agents", aiAgentRoutes)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  })
})

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err)
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/opus-trading")
    console.log(`✓ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("✗ MongoDB connection error:", error)
    process.exit(1)
  }
}

// Start server
const startServer = async () => {
  await connectDB()
  
  app.listen(PORT, () => {
    console.log(`\n🚀 OPUS Backend API Server`)
    console.log(`📍 Running on: http://localhost:${PORT}`)
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`)
    console.log(`⏰ Started at: ${new Date().toLocaleString()}\n`)
  })
}

startServer().catch((error) => {
  console.error("Failed to start server:", error)
  process.exit(1)
})

export default app
