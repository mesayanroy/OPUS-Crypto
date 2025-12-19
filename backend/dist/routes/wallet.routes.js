"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const User_model_1 = __importDefault(require("../models/User.model"));
const router = (0, express_1.Router)();
// Connect wallet
router.post("/connect", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const { address, chain, walletType } = req.body;
        const userId = req.user.userId;
        if (!address || !chain) {
            return res.status(400).json({
                success: false,
                message: "Address and chain are required",
            });
        }
        // Find user and add wallet
        const user = await User_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        // Check if wallet already connected
        const existingWallet = user.walletAddresses.find(w => w.address === address);
        if (existingWallet) {
            return res.status(409).json({
                success: false,
                message: "Wallet already connected",
            });
        }
        // Add wallet
        user.walletAddresses.push({
            address,
            chain,
            label: walletType || chain,
            isPrimary: user.walletAddresses.length === 0,
            verified: true,
        });
        await user.save();
        res.json({
            success: true,
            message: "Wallet connected successfully",
            wallet: user.walletAddresses[user.walletAddresses.length - 1],
        });
    }
    catch (error) {
        console.error("Connect wallet error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
// Get connected wallets
router.get("/list", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User_model_1.default.findById(userId).select("walletAddresses");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.json({
            success: true,
            wallets: user.walletAddresses,
        });
    }
    catch (error) {
        console.error("Get wallets error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
// Disconnect wallet
router.delete("/disconnect/:address", auth_middleware_1.authMiddleware, async (req, res) => {
    try {
        const { address } = req.params;
        const userId = req.user.userId;
        const user = await User_model_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        user.walletAddresses = user.walletAddresses.filter(w => w.address !== address);
        await user.save();
        res.json({
            success: true,
            message: "Wallet disconnected successfully",
        });
    }
    catch (error) {
        console.error("Disconnect wallet error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
});
exports.default = router;
