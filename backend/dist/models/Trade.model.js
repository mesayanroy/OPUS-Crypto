"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const TradeSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    txHash: {
        type: String,
        unique: true,
        sparse: true,
    },
    type: {
        type: String,
        enum: ["buy", "sell", "swap"],
        required: true,
    },
    fromToken: {
        symbol: { type: String, required: true },
        address: { type: String, required: true },
        chain: { type: String, required: true },
        amount: { type: Number, required: true },
        decimals: { type: Number, required: true },
    },
    toToken: {
        symbol: { type: String, required: true },
        address: { type: String, required: true },
        chain: { type: String, required: true },
        amount: { type: Number, required: true },
        decimals: { type: Number, required: true },
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "failed", "cancelled"],
        default: "pending",
        index: true,
    },
    executedPrice: { type: Number, required: true },
    estimatedPrice: { type: Number, required: true },
    slippage: { type: Number, default: 0 },
    gasFee: { type: Number, default: 0 },
    total: { type: Number, required: true },
    pnl: Number,
    pnlPercent: Number,
    isAiGenerated: { type: Boolean, default: false, index: true },
    proposalId: String,
    isCrossChain: { type: Boolean, default: false },
    sourceChain: String,
    targetChain: String,
    timestamp: { type: Date, default: Date.now, index: true },
    executedAt: Date,
    failureReason: String,
});
TradeSchema.index({ userId: 1, timestamp: -1 });
TradeSchema.index({ userId: 1, status: 1 });
exports.default = mongoose_1.default.model("Trade", TradeSchema);
