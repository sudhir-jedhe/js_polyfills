const Permission = require("../models/Permission")
const logger = require("../utils/logger")

// Get all permissions
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find()
    res.json(permissions)
  } catch (error) {
    logger.error("Error in getAllPermissions:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Create a new permission
exports.createPermission = async (req, res) => {
  try {
    const { name, description, resource, action } = req.body
    const permission = new Permission({ name, description, resource, action })
    await permission.save()
    res.status(201).json(permission)
  } catch (error) {
    logger.error("Error in createPermission:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get permission by ID
exports.getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id)
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" })
    }
    res.json(permission)
  } catch (error) {
    logger.error("Error in getPermissionById:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Update permission
exports.updatePermission = async (req, res) => {
  try {
    const { name, description, resource, action } = req.body
    const permission = await Permission.findByIdAndUpdate(
      req.params.id,
      { name, description, resource, action },
      { new: true },
    )
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" })
    }
    res.json(permission)
  } catch (error) {
    logger.error("Error in updatePermission:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Delete permission
exports.deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id)
    if (!permission) {
      return res.status(404).json({ message: "Permission not found" })
    }
    res.json({ message: "Permission deleted successfully" })
  } catch (error) {
    logger.error("Error in deletePermission:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = exports

