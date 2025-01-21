const rateLimit = require("express-rate-limit")
const config = require("config")

const limiter = rateLimit({
  windowMs: config.get("rateLimit.windowMs"),
  max: config.get("rateLimit.max"),
  message: "Too many requests from this IP, please try again later.",
})

module.exports = limiter

