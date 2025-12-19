"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
// Load environment variables
dotenv_1.default.config();
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const wallet_routes_1 = __importDefault(require("./routes/wallet.routes"));
const trading_routes_1 = __importDefault(require("./routes/trading.routes"));
const portfolio_routes_1 = __importDefault(require("./routes/portfolio.routes"));
const ai_agent_routes_1 = __importDefault(require("./routes/ai-agent.routes"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
});
// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});
// API Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/wallet", wallet_routes_1.default);
app.use("/api/trading", trading_routes_1.default);
app.use("/api/portfolio", portfolio_routes_1.default);
app.use("/api/ai-agents", ai_agent_routes_1.default);
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
});
// MongoDB connection
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/opus-trading");
        console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error("✗ MongoDB connection error:", error);
        process.exit(1);
    }
};
// Start server
const startServer = async () => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`\n🚀 OPUS Backend API Server`);
        console.log(`📍 Running on: http://localhost:${PORT}`);
        console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
        console.log(`⏰ Started at: ${new Date().toLocaleString()}\n`);
    });
};
startServer().catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
});
exports.default = app;
