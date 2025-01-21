const express = require("express")
const config = require("config")
const connectDB = require("./config/db")
const cors = require("cors")
const helmet = require("helmet")
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")
const errorHandler = require("./middleware/errorHandler")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const roleRoutes = require("./routes/roles")
const permissionRoutes = require("./routes/permissions")
const logger = require("./utils/logger")
const securityMonitoring = require("./utils/securityMonitoring")

// Load environment variables
require("dotenv").config()

// Create Express app
const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors()) // Enable Cross-Origin Resource Sharing
app.use(helmet()) // Set security HTTP headers
app.use(express.json()) // Parse JSON request bodies
app.use(morgan("combined", { stream: logger.stream })) // HTTP request logger

// Rate limiting
const limiter = rateLimit({
  windowMs: config.get("rateLimit.windowMs"),
  max: config.get("rateLimit.max"),
})
app.use(limiter)

// Security monitoring
app.use(securityMonitoring)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/roles", roleRoutes)
app.use("/api/permissions", permissionRoutes)

// Error handling middleware
app.use(errorHandler)

// Start server
const PORT = config.get("server.port") || 5000
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`))

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received: closing HTTP server")
  app.close(() => {
    logger.info("HTTP server closed")
  })
})

