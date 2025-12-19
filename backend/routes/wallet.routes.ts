import { Router, Request, Response } from "express"
import { authMiddleware } from "../middleware/auth.middleware"
import User from "../models/User.model"

const router = Router()

// Connect wallet
router.post("/connect", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { address, chain, walletType } = req.body
    const userId = (req as any).user.userId

    if (!address || !chain) {
      return res.status(400).json({
        success: false,
        message: "Address and chain are required",
      })
    }

    // Find user and add wallet
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    // Check if wallet already connected
    const existingWallet = user.walletAddresses.find(w => w.address === address)
    if (existingWallet) {
      return res.status(409).json({
        success: false,
        message: "Wallet already connected",
      })
    }

    // Add wallet
    user.walletAddresses.push({
      address,
      chain,
      label: walletType || chain,
      isPrimary: user.walletAddresses.length === 0,
      verified: true,
    })

    await user.save()

    res.json({
      success: true,
      message: "Wallet connected successfully",
      wallet: user.walletAddresses[user.walletAddresses.length - 1],
    })
  } catch (error) {
    console.error("Connect wallet error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

// Get connected wallets
router.get("/list", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId

    const user = await User.findById(userId).select("walletAddresses")
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      wallets: user.walletAddresses,
    })
  } catch (error) {
    console.error("Get wallets error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

// Disconnect wallet
router.delete("/disconnect/:address", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { address } = req.params
    const userId = (req as any).user.userId

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    user.walletAddresses = user.walletAddresses.filter(w => w.address !== address)
    await user.save()

    res.json({
      success: true,
      message: "Wallet disconnected successfully",
    })
  } catch (error) {
    console.error("Disconnect wallet error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

export default router
