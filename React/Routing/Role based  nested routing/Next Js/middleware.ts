import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifyToken } from "./app/lib/jwt"
import { applySecurityHeaders } from "./app/lib/securityHeaders"

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value

  let response = NextResponse.next()

  if (!token || !verifyToken(token)) {
    if (!request.nextUrl.pathname.startsWith("/login")) {
      response = NextResponse.redirect(new URL("/login", request.url))
    }
  } else if (request.nextUrl.pathname === "/login") {
    response = NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Apply security headers
  return applySecurityHeaders(request, response)
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

