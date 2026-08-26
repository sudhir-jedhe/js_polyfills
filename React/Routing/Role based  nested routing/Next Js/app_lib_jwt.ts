import jwt from "jsonwebtoken"
import { getJwtSecret } from "./secrets"

export function generateToken(payload: object): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "1h" })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, getJwtSecret())
  } catch (error) {
    return null
  }
}

