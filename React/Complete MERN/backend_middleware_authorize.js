const Role = require("../models/Role")
const logger = require("../utils/logger")

module.exports = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const user = req.user
      const userRoles = await Role.find({ _id: { $in: user.roles } })

      const hasRequiredRole = userRoles.some((role) => role.name === requiredRole)

      if (!hasRequiredRole) {
        logger.warn(
          `Unauthorized access attempt: User ${user._id} tried to access a resource requiring role ${requiredRole}`,
        )
        return res.status(403).json({ message: "Access denied. Insufficient permissions." })
      }

      next()
    } catch (error) {
      logger.error("Error in authorization middleware:", error)
      res.status(500).json({ message: "Server error" })
    }
  }
}

