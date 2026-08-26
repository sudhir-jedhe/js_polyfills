// middleware.js — redirect unauthenticated users away from /dashboard
import { NextResponse } from 'next/server';

export function middleware(request) {
  const session = request.cookies.get('session')?.value;

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
