const jwt = require("jsonwebtoken")
const config = require("config")
const User = require("../models/User")

module.exports = async (req, res, next) => {
  // Get token from header
  const token = req.header("Authorization")?.split(" ")[1]

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" })
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.get("jwt.secret"))

    // Add user from payload
    const user = await User.findById(decoded.userId).select("-password")
    if (!user) {
      return res.status(401).json({ msg: "Token is not valid" })
    }

    req.user = user
    next()
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" })
  }
}

