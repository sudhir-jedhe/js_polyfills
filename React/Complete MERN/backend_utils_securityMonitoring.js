const logger = require("./logger")

const securityMonitoring = (req, res, next) => {
  // Log all requests
  logger.info(`${req.method} ${req.originalUrl}`)

  // Check for suspicious headers
  const suspiciousHeaders = ["x-forwarded-for", "x-real-ip"]
  suspiciousHeaders.forEach((header) => {
    if (req.headers[header]) {
      logger.warn(`Suspicious header detected: ${header}`)
    }
  })

  // Check for SQL injection attempts
  const sqlKeywords = ["SELECT", "INSERT", "UPDATE", "DELETE", "DROP", "UNION"]
  const reqBody = JSON.stringify(req.body).toUpperCase()
  sqlKeywords.forEach((keyword) => {
    if (reqBody.includes(keyword)) {
      logger.warn(`Potential SQL injection attempt detected: ${keyword}`)
    }
  })

  // Check for XSS attempts
  const xssPatterns = [/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, /on\w+\s*=/gi]
  xssPatterns.forEach((pattern) => {
    if (pattern.test(reqBody)) {
      logger.warn("Potential XSS attempt detected")
    }
  })

  next()
}

module.exports = securityMonitoring

