import mongoose, { Schema, Document } from "mongoose"

export interface IAIProposal extends Document {
  userId: mongoose.Types.ObjectId
  proposal: {
    fromToken: string
    toToken: string
    side: "buy" | "sell"
    amount: number
    estimatedPrice: number
    slippage: number
    riskLevel: "low" | "medium" | "high"
    expectedReturn: number
    confidence: number
    reasoning: string
    timeframe: "5min" | "15min" | "1h" | "1d"
  }
  status: "pending" | "executed" | "rejected" | "expired"
  executedTradeId?: mongoose.Types.ObjectId
  createdAt: Date
  expiresAt: Date
  executedAt?: Date
}

const AIProposalSchema = new Schema<IAIProposal>({
  userId: {
    type: Schema.Types.ObjectId,
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
    type: Schema.Types.ObjectId,
    ref: "Trade",
  },
  createdAt: { type: Date, default: Date.now, index: true },
  expiresAt: { type: Date, required: true, index: true },
  executedAt: Date,
})

AIProposalSchema.index({ userId: 1, createdAt: -1 })
AIProposalSchema.index({ status: 1, expiresAt: 1 })

export default mongoose.model<IAIProposal>("AIProposal", AIProposalSchema)
