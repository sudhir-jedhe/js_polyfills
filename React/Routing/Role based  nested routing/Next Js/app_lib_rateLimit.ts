import rateLimit from "express-rate-limit"
import type { NextApiResponse } from "next"

const ipRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  keyGenerator: (req) => req.ip || "unknown",
})

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  handler: (_, res: NextApiResponse) => {
    res.status(429).json({ success: false, error: "Too many requests, please try again later." })
  },
})

export function applyIpRateLimit(req: any, res: any) {
  return new Promise((resolve, reject) => {
    ipRateLimiter(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

