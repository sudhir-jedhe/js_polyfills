module.exports = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL,
  logLevel: 'info',
  rateLimitWindow: 15 * 60 * 1000, // 15 minutes
  rateLimitMax: 100
};

