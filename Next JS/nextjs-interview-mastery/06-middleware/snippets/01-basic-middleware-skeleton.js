// middleware.js — project root
import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log(`[middleware] ${request.method} ${request.nextUrl.pathname}`);
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
