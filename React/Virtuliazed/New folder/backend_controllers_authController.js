const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const config = require("config")
const User = require("../models/User")
const twoFactor = require("../utils/twoFactor")
const logger = require("../utils/logger")
const sendEmail = require("../utils/sendEmail")

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] })
    if (user) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    user = new User({ username, email, password })
    await user.save()

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, config.get("jwt.secret"), { expiresIn: config.get("jwt.expiresIn") })

    res.status(201).json({ token, userId: user._id })
  } catch (error) {
    logger.error("Error in register:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password, twoFactorToken } = req.body

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check two-factor authentication
    if (user.twoFactorEnabled) {
      if (!twoFactorToken) {
        return res.status(200).json({ requireTwoFactor: true })
      }
      if (!twoFactor.verifyToken(user.twoFactorSecret, twoFactorToken)) {
        return res.status(400).json({ message: "Invalid 2FA token" })
      }
    }

    // Generate JWT
    const token = jwt.sign({ userId: user._id }, config.get("jwt.secret"), { expiresIn: config.get("jwt.expiresIn") })

    res.json({ token, userId: user._id })
  } catch (error) {
    logger.error("Error in login:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Logout user
exports.logout = (req, res) => {
  // In a real-world scenario, you might want to invalidate the token on the server-side
  // For now, we'll just send a success response
  res.json({ message: "Logged out successfully" })
}

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" })
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, config.get("refreshToken.secret"))
    const user = await User.findById(decoded.userId)

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" })
    }

    // Generate new access token
    const accessToken = jwt.sign({ userId: user._id }, config.get("jwt.secret"), {
      expiresIn: config.get("jwt.expiresIn"),
    })

    res.json({ accessToken })
  } catch (error) {
    logger.error("Error in refreshToken:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Enable two-factor authentication
exports.enableTwoFactor = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const secret = twoFactor.generateSecret(user.username)
    user.twoFactorSecret = secret.ascii
    user.twoFactorEnabled = true
    await user.save()

    const qrCode = await twoFactor.generateQRCode(secret)
    res.json({ qrCode })
  } catch (error) {
    logger.error("Error in enableTwoFactor:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Disable two-factor authentication
exports.disableTwoFactor = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    user.twoFactorSecret = undefined
    user.twoFactorEnabled = false
    await user.save()

    res.json({ message: "Two-factor authentication disabled" })
  } catch (error) {
    logger.error("Error in disableTwoFactor:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex")
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000 // 10 minutes

    await user.save()

    // Create reset url
    const resetUrl = `${config.get("frontendUrl")}/reset-password/${resetToken}`

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

    try {
      await sendEmail({
        email: user.email,
        subject: "Password reset token",
        message,
      })

      res.json({ message: "Email sent" })
    } catch (err) {
      logger.error("Error sending email:", err)
      user.resetPasswordToken = undefined
      user.resetPasswordExpire = undefined

      await user.save()

      return res.status(500).json({ message: "Email could not be sent" })
    }
  } catch (error) {
    logger.error("Error in forgotPassword:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex")

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    })

    if (!user) {
      return res.status(400).json({ message: "Invalid token" })
    }

    // Set new password
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    res.json({ message: "Password reset successful" })
  } catch (error) {
    logger.error("Error in resetPassword:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = exports

