"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const Portfolio_model_1 = __importDefault(require("../models/Portfolio.model"));
const router = (0, express_1.Router)();
// Get user portfolio
router.get("/", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { chain } = req.query;
        const query = { userId };
        if (chain) {
            query.chain = chain;
        }
        const portfolios = await Portfolio_model_1.default.find(query).sort({ lastUpdated: -1 });
        res.json({
            success: true,
            portfolios,
        });
    }
    catch (error) {
        console.error("Get portfolio error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
// Update portfolio
router.post("/update", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { chain, assets, metrics } = req.body;
        if (!chain || !assets) {
            return res.status(400).json({
                success: false,
                message: "Chain and assets are required",
            });
        }
        let portfolio = await Portfolio_model_1.default.findOne({ userId, chain });
        if (portfolio) {
            // Update existing
            portfolio.assets = assets;
            portfolio.metrics = metrics;
            portfolio.history.push({
                timestamp: new Date(),
                totalValue: metrics.totalValue,
                pnl: metrics.pnl,
            });
            portfolio.lastUpdated = new Date();
        }
        else {
            // Create new
            portfolio = await Portfolio_model_1.default.create({
                userId,
                chain,
                assets,
                metrics,
                history: [{
                        timestamp: new Date(),
                        totalValue: metrics.totalValue,
                        pnl: metrics.pnl,
                    }],
                lastUpdated: new Date(),
            });
        }
        await portfolio.save();
        res.json({
            success: true,
            message: "Portfolio updated",
            portfolio,
        });
    }
    catch (error) {
        console.error("Update portfolio error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.default = router;
