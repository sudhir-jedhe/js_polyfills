const Role = require("../models/Role")
const logger = require("../utils/logger")

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find().populate("permissions")
    res.json(roles)
  } catch (error) {
    logger.error("Error in getAllRoles:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body
    const role = new Role({ name, description, permissions })
    await role.save()
    res.status(201).json(role)
  } catch (error) {
    logger.error("Error in createRole:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate("permissions")
    if (!role) {
      return res.status(404).json({ message: "Role not found" })
    }
    res.json(role)
  } catch (error) {
    logger.error("Error in getRoleById:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Update role
exports.updateRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { name, description, permissions },
      { new: true },
    ).populate("permissions")
    if (!role) {
      return res.status(404).json({ message: "Role not found" })
    }
    res.json(role)
  } catch (error) {
    logger.error("Error in updateRole:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Delete role
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id)
    if (!role) {
      return res.status(404).json({ message: "Role not found" })
    }
    res.json({ message: "Role deleted successfully" })
  } catch (error) {
    logger.error("Error in deleteRole:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = exports

