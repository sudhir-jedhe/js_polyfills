// middleware.js — composing several independent checks in one function,
// since Next.js only recognizes a single middleware entry point.
import { NextResponse } from 'next/server';

function withSecurityHeaders(response) {
  response.headers.set('X-Content-Type-Options', 'nosniff');
  return response;
}

function requireAuthForDashboard(request) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/dashboard')) return null;

  const session = request.cookies.get('session')?.value;
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return null;
}

export function middleware(request) {
  const authRedirect = requireAuthForDashboard(request);
  if (authRedirect) return authRedirect;

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
