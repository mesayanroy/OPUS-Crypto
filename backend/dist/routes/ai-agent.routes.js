"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const AIAgent_model_1 = __importDefault(require("../models/AIAgent.model"));
const router = (0, express_1.Router)();
// Get user's AI agents
router.get("/", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const agents = await AIAgent_model_1.default.find({ userId }).sort({ updatedAt: -1 });
        res.json({
            success: true,
            agents,
        });
    }
    catch (error) {
        console.error("Get agents error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
// Create AI agent
router.post("/", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { name, config } = req.body;
        if (!name || !config) {
            return res.status(400).json({
                success: false,
                message: "Name and config are required",
            });
        }
        const agent = await AIAgent_model_1.default.create({
            userId,
            name,
            status: "inactive",
            config,
            performance: {
                totalTrades: 0,
                winningTrades: 0,
                losingTrades: 0,
                totalPnl: 0,
                roi: 0,
                sharpeRatio: 0,
                maxDrawdown: 0,
            },
            errorLog: [],
        });
        res.status(201).json({
            success: true,
            message: "AI agent created",
            agent,
        });
    }
    catch (error) {
        console.error("Create agent error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
// Update AI agent
router.put("/:id", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const updates = req.body;
        const agent = await AIAgent_model_1.default.findOneAndUpdate({ _id: id, userId }, { $set: updates, updatedAt: new Date() }, { new: true });
        if (!agent) {
            return res.status(404).json({
                success: false,
                message: "Agent not found",
            });
        }
        res.json({
            success: true,
            message: "Agent updated",
            agent,
        });
    }
    catch (error) {
        console.error("Update agent error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
// Delete AI agent
router.delete("/:id", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const agent = await AIAgent_model_1.default.findOneAndDelete({ _id: id, userId });
        if (!agent) {
            return res.status(404).json({
                success: false,
                message: "Agent not found",
            });
        }
        res.json({
            success: true,
            message: "Agent deleted",
        });
    }
    catch (error) {
        console.error("Delete agent error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
// Start/Stop agent
router.post("/:id/toggle", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const agent = await AIAgent_model_1.default.findOne({ _id: id, userId });
        if (!agent) {
            return res.status(404).json({
                success: false,
                message: "Agent not found",
            });
        }
        agent.status = agent.status === "active" ? "inactive" : "active";
        agent.updatedAt = new Date();
        await agent.save();
        res.json({
            success: true,
            message: `Agent ${agent.status}`,
            agent,
        });
    }
    catch (error) {
        console.error("Toggle agent error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.default = router;
