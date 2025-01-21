const express = require("express")
const { body } = require("express-validator")
const permissionController = require("../controllers/permissionController")
const auth = require("../middleware/auth")
const authorize = require("../middleware/authorize")
const validateRequest = require("../middleware/validateRequest")

const router = express.Router()

// GET /api/permissions
// Description: Get all permissions
// Access: Private (Admin only)
router.get("/", [auth, authorize("admin")], permissionController.getAllPermissions)

// POST /api/permissions
// Description: Create a new permission
// Access: Private (Admin only)
router.post(
  "/",
  [
    auth,
    authorize("admin"),
    body("name").notEmpty().withMessage("Permission name is required"),
    body("description").optional(),
    body("resource").notEmpty().withMessage("Resource is required"),
    body("action").isIn(["create", "read", "update", "delete"]).withMessage("Invalid action"),
    validateRequest,
  ],
  permissionController.createPermission,
)

// GET /api/permissions/:id
// Description: Get a permission by ID
// Access: Private (Admin only)
router.get("/:id", [auth, authorize("admin")], permissionController.getPermissionById)

// PUT /api/permissions/:id
// Description: Update a permission
// Access: Private (Admin only)
router.put(
  "/:id",
  [
    auth,
    authorize("admin"),
    body("name").optional().notEmpty().withMessage("Permission name cannot be empty"),
    body("description").optional(),
    body("resource").optional().notEmpty().withMessage("Resource cannot be empty"),
    body("action").optional().isIn(["create", "read", "update", "delete"]).withMessage("Invalid action"),
    validateRequest,
  ],
  permissionController.updatePermission,
)

// DELETE /api/permissions/:id
// Description: Delete a permission
// Access: Private (Admin only)
router.delete("/:id", [auth, authorize("admin")], permissionController.deletePermission)

module.exports = router

