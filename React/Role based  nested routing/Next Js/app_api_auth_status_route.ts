import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const authCookie = cookies().get("auth")

  if (authCookie) {
    const { isAuthenticated, permissions } = JSON.parse(authCookie.value)
    return NextResponse.json({ isAuthenticated, permissions })
  }

  return NextResponse.json({ isAuthenticated: false, permissions: null })
}

