import { Router, Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt, { SignOptions, Secret } from "jsonwebtoken"
import User from "../models/User.model"
import { authMiddleware } from "../middleware/auth.middleware"

const router = Router()

// Register user
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      email,
      passwordHash,
      fullName: fullName || "User",
      walletAddresses: [],
      preferences: {
        riskTolerance: "medium",
        tradingStyle: "balanced",
        notificationsEnabled: true,
        theme: "dark",
        twoFactorEnabled: false,
      },
      subscription: {
        tier: "free",
        status: "active",
      },
    })

    // Generate JWT (use numeric expiration to satisfy TypeScript types)
    const jwtSecret: Secret = (process.env.JWT_SECRET || "your-secret-key") as Secret
    const expiresInSeconds = Number.parseInt(process.env.JWT_EXPIRATION || "7200", 10)
    const signOptions: SignOptions = { expiresIn: expiresInSeconds }
    const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecret, signOptions)

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

// Login user
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      })
    }

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Generate JWT (use numeric expiration to satisfy TypeScript types)
    const jwtSecret: Secret = (process.env.JWT_SECRET || "your-secret-key") as Secret
    const expiresInSeconds = Number.parseInt(process.env.JWT_EXPIRATION || "7200", 10)
    const signOptions: SignOptions = { expiresIn: expiresInSeconds }
    const token = jwt.sign({ userId: user._id, email: user.email }, jwtSecret, signOptions)

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        subscription: user.subscription,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

// Get current user (protected)
router.get("/me", authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = await User.findById((req as any).user.userId).select("-passwordHash")
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }

    res.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Get user error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

export default router
