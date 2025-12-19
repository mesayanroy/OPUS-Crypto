"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const Trade_model_1 = __importDefault(require("../models/Trade.model"));
const AIProposal_model_1 = __importDefault(require("../models/AIProposal.model"));
const router = (0, express_1.Router)();
// Get trade history
router.get("/history", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { limit = 50, skip = 0 } = req.query;
        const trades = await Trade_model_1.default.find({ userId })
            .sort({ timestamp: -1 })
            .limit(Number(limit))
            .skip(Number(skip));
        const total = await Trade_model_1.default.countDocuments({ userId });
        res.json({
            success: true,
            trades,
            pagination: {
                total,
                limit: Number(limit),
                skip: Number(skip),
                hasMore: total > Number(skip) + Number(limit),
            },
        });
    }
    catch (error) {
        console.error("Get trade history error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
// Place trade order
router.post("/order", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { type, fromToken, toToken, amount, estimatedPrice, chain, isCrossChain } = req.body;
        if (!type || !fromToken || !toToken || !amount) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }
        const trade = await Trade_model_1.default.create({
            userId,
            type,
            fromToken,
            toToken,
            status: "pending",
            executedPrice: estimatedPrice,
            estimatedPrice,
            slippage: 0,
            gasFee: 0,
            total: amount * estimatedPrice,
            isAiGenerated: false,
            isCrossChain: isCrossChain || false,
            sourceChain: chain,
            timestamp: new Date(),
        });
        res.status(201).json({
            success: true,
            message: "Trade order placed",
            trade,
        });
    }
    catch (error) {
        console.error("Place order error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
// Get AI trade proposals
router.get("/proposals", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const proposals = await AIProposal_model_1.default.find({
            userId,
            status: "pending",
            expiresAt: { $gt: new Date() },
        }).sort({ createdAt: -1 });
        res.json({
            success: true,
            proposals,
        });
    }
    catch (error) {
        console.error("Get proposals error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
// Execute AI proposal
router.post("/proposals/:id/execute", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const proposal = await AIProposal_model_1.default.findOne({ _id: id, userId });
        if (!proposal) {
            return res.status(404).json({
                success: false,
                message: "Proposal not found",
            });
        }
        if (proposal.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Proposal already processed",
            });
        }
        // Create trade from proposal
        const trade = await Trade_model_1.default.create({
            userId,
            type: proposal.proposal.side === "buy" ? "buy" : "sell",
            fromToken: {
                symbol: proposal.proposal.fromToken,
                address: "",
                chain: "",
                amount: proposal.proposal.amount,
                decimals: 18,
            },
            toToken: {
                symbol: proposal.proposal.toToken,
                address: "",
                chain: "",
                amount: proposal.proposal.amount,
                decimals: 18,
            },
            status: "pending",
            estimatedPrice: proposal.proposal.estimatedPrice,
            isAiGenerated: true,
            proposalId: proposal._id.toString(),
            timestamp: new Date(),
        });
        proposal.status = "executed";
        proposal.executedTradeId = trade._id;
        proposal.executedAt = new Date();
        await proposal.save();
        res.json({
            success: true,
            message: "Proposal executed",
            trade,
        });
    }
    catch (error) {
        console.error("Execute proposal error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.default = router;
