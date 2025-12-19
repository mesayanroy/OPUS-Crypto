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
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    walletAddresses: [
        {
            address: { type: String, required: true },
            chain: { type: String, required: true },
            label: String,
            isPrimary: { type: Boolean, default: false },
            verified: { type: Boolean, default: false },
        },
    ],
    preferences: {
        riskTolerance: {
            type: String,
            enum: ["low", "medium", "high"],
            default: "medium",
        },
        tradingStyle: {
            type: String,
            enum: ["conservative", "balanced", "aggressive"],
            default: "balanced",
        },
        notificationsEnabled: { type: Boolean, default: true },
        theme: { type: String, enum: ["light", "dark"], default: "dark" },
        twoFactorEnabled: { type: Boolean, default: false },
    },
    subscription: {
        tier: {
            type: String,
            enum: ["free", "premium", "pro"],
            default: "free",
        },
        status: {
            type: String,
            enum: ["active", "inactive", "cancelled"],
            default: "active",
        },
        expiresAt: Date,
    },
    lastLogin: Date,
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model("User", UserSchema);
