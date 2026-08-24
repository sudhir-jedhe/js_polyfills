import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  ROUTES,
  absoluteUrl,
  sessionClearOptions,
} from "@portal/config";

// Never cache the logout endpoint — it must run (and clear the cookie) every hit.
export const dynamic = "force-dynamic";

/**
 * /auth/logout — clears the session cookie and returns to the login screen.
 *
 * We set the clearing cookie DIRECTLY on the NextResponse we return. Using
 * `cookies().set()` from next/headers is not reliably applied to a manually
 * constructed `NextResponse.redirect()` on Vercel's runtime, which would leave
 * the session intact and bounce the user back to the dashboard.
 *
 * Implemented as GET so the sidebar's "Log out" link works as a plain anchor.
 * Trade-off noted: a production app would prefer a POST form (+ CSRF token).
 */
export async function GET() {
  const res = NextResponse.redirect(absoluteUrl(ROUTES.login));
  res.cookies.set(SESSION_COOKIE, "", sessionClearOptions());
  return res;
}
