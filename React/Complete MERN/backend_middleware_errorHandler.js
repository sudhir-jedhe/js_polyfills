const logger = require("../utils/logger")

module.exports = (err, req, res, next) => {
  logger.error(err.message, { stack: err.stack })

  // Check if the error is a mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((error) => error.message)
    return res.status(400).json({ errors })
  }

  // Check for duplicate key error (MongoDB)
  if (err.code === 11000) {
    return res.status(400).json({ msg: "Duplicate field value entered" })
  }

  // For all other errors, send a generic server error response
  res.status(500).json({ msg: "Server Error" })
}

