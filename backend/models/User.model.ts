import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  email: string
  passwordHash: string
  fullName: string
  walletAddresses: Array<{
    address: string
    chain: string
    label?: string
    isPrimary: boolean
    verified: boolean
  }>
  preferences: {
    riskTolerance: "low" | "medium" | "high"
    tradingStyle: "conservative" | "balanced" | "aggressive"
    notificationsEnabled: boolean
    theme: "light" | "dark"
    twoFactorEnabled: boolean
  }
  subscription: {
    tier: "free" | "premium" | "pro"
    status: "active" | "inactive" | "cancelled"
    expiresAt?: Date
  }
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
}

const UserSchema = new Schema<IUser>(
  {
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
  },
  {
    timestamps: true,
  },
)

export default mongoose.model<IUser>("User", UserSchema)
