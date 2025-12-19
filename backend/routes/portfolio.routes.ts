import { Router, Request, Response } from "express"
import { authMiddleware } from "../middleware/auth.middleware"
import Portfolio from "../models/Portfolio.model"

const router = Router()

// Get user portfolio
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId
    const { chain } = req.query

    const query: any = { userId }
    if (chain) {
      query.chain = chain
    }

    const portfolios = await Portfolio.find(query).sort({ lastUpdated: -1 })

    res.json({
      success: true,
      portfolios,
    })
  } catch (error) {
    console.error("Get portfolio error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

// Update portfolio
router.post("/update", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId
    const { chain, assets, metrics } = req.body

    if (!chain || !assets) {
      return res.status(400).json({
        success: false,
        message: "Chain and assets are required",
      })
    }

    let portfolio = await Portfolio.findOne({ userId, chain })

    if (portfolio) {
      // Update existing
      portfolio.assets = assets
      portfolio.metrics = metrics
      portfolio.history.push({
        timestamp: new Date(),
        totalValue: metrics.totalValue,
        pnl: metrics.pnl,
      })
      portfolio.lastUpdated = new Date()
    } else {
      // Create new
      portfolio = await Portfolio.create({
        userId,
        chain,
        assets,
        metrics,
        history: [{
          timestamp: new Date(),
          totalValue: metrics.totalValue,
          pnl: metrics.pnl,
        }],
        lastUpdated: new Date(),
      })
    }

    await portfolio.save()

    res.json({
      success: true,
      message: "Portfolio updated",
      portfolio,
    })
  } catch (error) {
    console.error("Update portfolio error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

export default router
