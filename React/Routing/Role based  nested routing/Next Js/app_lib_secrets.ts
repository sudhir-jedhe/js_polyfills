import crypto from "crypto"

let jwtSecret = process.env.JWT_SECRET || crypto.randomBytes(32).toString("hex")
let csrfSecret = process.env.CSRF_SECRET || crypto.randomBytes(32).toString("hex")

export function getJwtSecret(): string {
  return jwtSecret
}

export function getCsrfSecret(): string {
  return csrfSecret
}

export function rotateSecrets(): void {
  jwtSecret = crypto.randomBytes(32).toString("hex")
  csrfSecret = crypto.randomBytes(32).toString("hex")
  console.log("Secrets rotated at:", new Date().toISOString())
}

// Rotate secrets every 24 hours
setInterval(rotateSecrets, 24 * 60 * 60 * 1000)

