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
const AIProposalSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    proposal: {
        fromToken: { type: String, required: true },
        toToken: { type: String, required: true },
        side: { type: String, enum: ["buy", "sell"], required: true },
        amount: { type: Number, required: true },
        estimatedPrice: { type: Number, required: true },
        slippage: { type: Number, required: true },
        riskLevel: { type: String, enum: ["low", "medium", "high"], required: true },
        expectedReturn: { type: Number, required: true },
        confidence: { type: Number, required: true },
        reasoning: { type: String, required: true },
        timeframe: { type: String, enum: ["5min", "15min", "1h", "1d"], required: true },
    },
    status: {
        type: String,
        enum: ["pending", "executed", "rejected", "expired"],
        default: "pending",
        index: true,
    },
    executedTradeId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Trade",
    },
    createdAt: { type: Date, default: Date.now, index: true },
    expiresAt: { type: Date, required: true, index: true },
    executedAt: Date,
});
AIProposalSchema.index({ userId: 1, createdAt: -1 });
AIProposalSchema.index({ status: 1, expiresAt: 1 });
exports.default = mongoose_1.default.model("AIProposal", AIProposalSchema);
