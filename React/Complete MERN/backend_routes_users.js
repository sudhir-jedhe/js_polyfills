const express = require("express")
const { body } = require("express-validator")
const userController = require("../controllers/userController")
const auth = require("../middleware/auth")
const validateRequest = require("../middleware/validateRequest")

const router = express.Router()

// GET /api/users
router.get("/", auth, userController.getAllUsers)

// GET /api/users/:id
router.get("/:id", auth, userController.getUserById)

// PUT /api/users/:id
router.put(
  "/:id",
  auth,
  [
    body("username").optional().notEmpty().withMessage("Username cannot be empty"),
    body("email").optional().isEmail().withMessage("Please include a valid email"),
    body("role").optional().isIn(["user", "admin"]).withMessage("Invalid role"),
  ],
  validateRequest,
  userController.updateUser,
)

// DELETE /api/users/:id
router.delete("/:id", auth, userController.deleteUser)

module.exports = router

