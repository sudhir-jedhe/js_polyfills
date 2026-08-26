import { NextResponse } from "next/server"
import { getUserByCredentials, verifyTwoFactor } from "../../../lib/auth"
import { generateToken } from "../../../lib/jwt"
import { limiter, applyIpRateLimit } from "../../../lib/rateLimit"
import { logAuthAttempt } from "../../../lib/logger"
import { validateCsrfToken } from "../../../lib/csrf"
import { logSecurityEvent, recordFailedLogin } from "../../../lib/securityMonitoring"
import { loginSchema, type LoginInput } from "../../../lib/validation"

export async function POST(request: Request) {
  try {
    await applyIpRateLimit(request, NextResponse.next())
  } catch (error) {
    return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 })
  }

  let loginInput: LoginInput

  try {
    const body = await request.json()
    loginInput = loginSchema.parse(body)
  } catch (error) {
    logSecurityEvent("Invalid Input", { error })
    return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 })
  }

  const { username, password, csrfToken, twoFactorToken } = loginInput

  // Validate CSRF token
  if (!validateCsrfToken(csrfToken)) {
    logSecurityEvent("Invalid CSRF Token", { username })
    return NextResponse.json({ success: false, error: "Invalid CSRF token" }, { status: 403 })
  }

  try {
    const user = await getUserByCredentials(username, password)

    if (user) {
      if (user.twoFactorEnabled) {
        if (!twoFactorToken) {
          return NextResponse.json({ success: false, requireTwoFactor: true }, { status: 200 })
        }
        if (!(await verifyTwoFactor(username, twoFactorToken))) {
          logAuthAttempt(username, false)
          recordFailedLogin(request.ip || "unknown")
          logSecurityEvent("Failed 2FA", { username })
          return NextResponse.json({ success: false, error: "Invalid 2FA token" }, { status: 401 })
        }
      }

      const token = generateToken({
        username: user.username,
        permissions: user.permissions,
      })

      // Set JWT as an HTTP-only cookie
      const response = NextResponse.json({ success: true })
      response.cookies.set("auth_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3600, // 1 hour
        path: "/",
      })

      logAuthAttempt(username, true)
      logSecurityEvent("Successful Login", { username })
      return response
    } else {
      logAuthAttempt(username, false)
      recordFailedLogin(request.ip || "unknown")
      logSecurityEvent("Failed Login", { username })
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 })
    }
  } catch (error) {
    console.error("Login error:", error)
    logAuthAttempt(username, false)
    logSecurityEvent("Login Error", { username, error: (error as Error).message })
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}

