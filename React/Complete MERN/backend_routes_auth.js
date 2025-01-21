const express = require("express")
const { body } = require("express-validator")
const authController = require("../controllers/authController")
const validateRequest = require("../middleware/validateRequest")
const rateLimiter = require("../middleware/rateLimiter")

const router = express.Router()

// POST /api/auth/register
router.post(
  "/register",
  [
    // Validation middleware
    body("username")
      .notEmpty()
      .withMessage("Username is required"),
    body("email").isEmail().withMessage("Please include a valid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  ],
  validateRequest,
  authController.register,
)

// POST /api/auth/login
router.post(
  "/login",
  rateLimiter,
  [
    // Validation middleware
    body("email")
      .isEmail()
      .withMessage("Please include a valid email"),
    body("password").exists().withMessage("Password is required"),
  ],
  validateRequest,
  authController.login,
)

// POST /api/auth/logout
router.post("/logout", authController.logout)

// POST /api/auth/refresh-token
router.post("/refresh-token", authController.refreshToken)

module.exports = router

