import { NextResponse } from "next/server"
import { getUserByEmail, updateUserPassword } from "../../../lib/auth"
import { generateToken, verifyToken } from "../../../lib/jwt"
import { sendEmail } from "../../../lib/email"
import { logSecurityEvent } from "../../../lib/securityMonitoring"

export async function POST(request: Request) {
  const { email } = await request.json()

  const user = await getUserByEmail(email)
  if (!user) {
    // Don't reveal whether the email exists or not
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    })
  }

  const resetToken = generateToken({ userId: user.id }, "15m")
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`

  try {
    await sendEmail({
      to: email,
      subject: "Password Reset",
      text: `Click this link to reset your password: ${resetLink}`,
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    })

    logSecurityEvent("Password Reset Requested", { userId: user.id })
    return NextResponse.json({
      success: true,
      message: "If an account with that email exists, a password reset link has been sent.",
    })
  } catch (error) {
    console.error("Failed to send password reset email:", error)
    logSecurityEvent("Password Reset Email Failed", { userId: user.id, error: (error as Error).message })
    return NextResponse.json({ success: false, error: "Failed to send password reset email" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const { token, newPassword } = await request.json()

  try {
    const payload = verifyToken(token)
    if (!payload || typeof payload === "string" || !payload.userId) {
      return NextResponse.json({ success: false, error: "Invalid or expired token" }, { status: 400 })
    }

    await updateUserPassword(payload.userId, newPassword)

    logSecurityEvent("Password Reset Successful", { userId: payload.userId })
    return NextResponse.json({ success: true, message: "Password has been reset successfully" })
  } catch (error) {
    console.error("Failed to reset password:", error)
    logSecurityEvent("Password Reset Failed", { error: (error as Error).message })
    return NextResponse.json({ success: false, error: "Failed to reset password" }, { status: 500 })
  }
}

