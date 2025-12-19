import mongoose, { Schema, Document } from "mongoose"

export interface IPortfolio extends Document {
  userId: mongoose.Types.ObjectId
  chain: string
  assets: Array<{
    symbol: string
    address: string
    balance: number
    value: number
    price: number
    change24h: number
    allocation: number
  }>
  metrics: {
    totalValue: number
    totalInvested: number
    pnl: number
    pnlPercent: number
    riskScore: number
    sharpeRatio: number
    maxDrawdown: number
  }
  history: Array<{
    timestamp: Date
    totalValue: number
    pnl: number
  }>
  lastUpdated: Date
}

const PortfolioSchema = new Schema<IPortfolio>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  chain: {
    type: String,
    required: true,
  },
  assets: [
    {
      symbol: { type: String, required: true },
      address: { type: String, required: true },
      balance: { type: Number, required: true },
      value: { type: Number, required: true },
      price: { type: Number, required: true },
      change24h: { type: Number, default: 0 },
      allocation: { type: Number, default: 0 },
    },
  ],
  metrics: {
    totalValue: { type: Number, default: 0 },
    totalInvested: { type: Number, default: 0 },
    pnl: { type: Number, default: 0 },
    pnlPercent: { type: Number, default: 0 },
    riskScore: { type: Number, default: 0 },
    sharpeRatio: { type: Number, default: 0 },
    maxDrawdown: { type: Number, default: 0 },
  },
  history: [
    {
      timestamp: { type: Date, required: true },
      totalValue: { type: Number, required: true },
      pnl: { type: Number, required: true },
    },
  ],
  lastUpdated: { type: Date, default: Date.now, index: true },
})

PortfolioSchema.index({ userId: 1, chain: 1 }, { unique: true })

export default mongoose.model<IPortfolio>("Portfolio", PortfolioSchema)
