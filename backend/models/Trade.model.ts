import mongoose, { Schema, Document } from "mongoose"

export interface ITrade extends Document {
  userId: mongoose.Types.ObjectId
  txHash?: string
  type: "buy" | "sell" | "swap"
  fromToken: {
    symbol: string
    address: string
    chain: string
    amount: number
    decimals: number
  }
  toToken: {
    symbol: string
    address: string
    chain: string
    amount: number
    decimals: number
  }
  status: "pending" | "confirmed" | "failed" | "cancelled"
  executedPrice: number
  estimatedPrice: number
  slippage: number
  gasFee: number
  total: number
  pnl?: number
  pnlPercent?: number
  isAiGenerated: boolean
  proposalId?: string
  isCrossChain: boolean
  sourceChain?: string
  targetChain?: string
  timestamp: Date
  executedAt?: Date
  failureReason?: string
}

const TradeSchema = new Schema<ITrade>({
  userId: {
    type: Schema.Types.ObjectId,
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
})

TradeSchema.index({ userId: 1, timestamp: -1 })
TradeSchema.index({ userId: 1, status: 1 })

export default mongoose.model<ITrade>("Trade", TradeSchema)
