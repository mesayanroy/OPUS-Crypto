import mongoose, { Schema, Document } from "mongoose"

export interface IAIAgent extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  status: "active" | "inactive" | "paused" | "error"
  config: {
    strategy: "trend_following" | "mean_reversion" | "arbitrage" | "copy_trading"
    chains: string[]
    tokens: Array<{
      symbol: string
      address: string
      maxAllocation: number
      minBalance: number
    }>
    tradingRules: {
      maxTradesPerDay: number
      minROI: number
      maxRiskPerTrade: number
      riskStopLoss: number
      profitTakeProfit: number
    }
    execution: {
      autoExecute: boolean
      maxGasPrice: number
      slippageTolerance: number
    }
  }
  performance: {
    totalTrades: number
    winningTrades: number
    losingTrades: number
    totalPnl: number
    roi: number
    sharpeRatio: number
    maxDrawdown: number
  }
  lastExecutionTime?: Date
  nextScheduledExecution?: Date
  errorLog: Array<{
    timestamp: Date
    message: string
    traceId: string
  }>
  createdAt: Date
  updatedAt: Date
}

const AIAgentSchema = new Schema<IAIAgent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "paused", "error"],
      default: "inactive",
      index: true,
    },
    config: {
      strategy: {
        type: String,
        enum: ["trend_following", "mean_reversion", "arbitrage", "copy_trading"],
        required: true,
      },
      chains: [String],
      tokens: [
        {
          symbol: String,
          address: String,
          maxAllocation: Number,
          minBalance: Number,
        },
      ],
      tradingRules: {
        maxTradesPerDay: Number,
        minROI: Number,
        maxRiskPerTrade: Number,
        riskStopLoss: Number,
        profitTakeProfit: Number,
      },
      execution: {
        autoExecute: Boolean,
        maxGasPrice: Number,
        slippageTolerance: Number,
      },
    },
    performance: {
      totalTrades: { type: Number, default: 0 },
      winningTrades: { type: Number, default: 0 },
      losingTrades: { type: Number, default: 0 },
      totalPnl: { type: Number, default: 0 },
      roi: { type: Number, default: 0 },
      sharpeRatio: { type: Number, default: 0 },
      maxDrawdown: { type: Number, default: 0 },
    },
    lastExecutionTime: Date,
    nextScheduledExecution: Date,
    errorLog: [
      {
        timestamp: Date,
        message: String,
        traceId: String,
      },
    ],
  },
  {
    timestamps: true,
  },
)

AIAgentSchema.index({ userId: 1, status: 1 })
AIAgentSchema.index({ updatedAt: -1 })

export default mongoose.model<IAIAgent>("AIAgent", AIAgentSchema)
