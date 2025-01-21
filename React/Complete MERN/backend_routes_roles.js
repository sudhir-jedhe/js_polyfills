const express = require("express")
const { body } = require("express-validator")
const roleController = require("../controllers/roleController")
const auth = require("../middleware/auth")
const authorize = require("../middleware/authorize")
const validateRequest = require("../middleware/validateRequest")

const router = express.Router()

// GET /api/roles
// Description: Get all roles
// Access: Private (Admin only)
router.get("/", [auth, authorize("admin")], roleController.getAllRoles)

// POST /api/roles
// Description: Create a new role
// Access: Private (Admin only)
router.post(
  "/",
  [
    auth,
    authorize("admin"),
    body("name").notEmpty().withMessage("Role name is required"),
    body("description").optional(),
    body("permissions").isArray().withMessage("Permissions must be an array of permission IDs"),
    validateRequest,
  ],
  roleController.createRole,
)

// GET /api/roles/:id
// Description: Get a role by ID
// Access: Private (Admin only)
router.get("/:id", [auth, authorize("admin")], roleController.getRoleById)

// PUT /api/roles/:id
// Description: Update a role
// Access: Private (Admin only)
router.put(
  "/:id",
  [
    auth,
    authorize("admin"),
    body("name").optional().notEmpty().withMessage("Role name cannot be empty"),
    body("description").optional(),
    body("permissions").optional().isArray().withMessage("Permissions must be an array of permission IDs"),
    validateRequest,
  ],
  roleController.updateRole,
)

// DELETE /api/roles/:id
// Description: Delete a role
// Access: Private (Admin only)
router.delete("/:id", [auth, authorize("admin")], roleController.deleteRole)

module.exports = router

