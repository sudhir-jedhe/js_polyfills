// Middleware kept lightweight (auth gate + redirect only); business
// logic moved to a Route Handler where it belongs.

// ============ middleware.ts ============
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthed = Boolean(request.cookies.get('session'));

  if (!isAuthed && request.nextUrl.pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // scoped narrowly, not run on every request
};

// ============ app/api/orders/route.ts ============
// Real business logic lives here, on the Node.js runtime by default,
// with full access to database drivers and third-party SDKs.
export async function POST(request: Request) {
  const body = await request.json();

  const order = await db.orders.create(body);
  await sendConfirmationEmail(order.customerEmail, order.id);

  return Response.json(order, { status: 201 });
}

// Mock helpers referenced above.
declare const db: { orders: { create: (data: unknown) => Promise<{ id: string; customerEmail: string }> } };
declare function sendConfirmationEmail(email: string, orderId: string): Promise<void>;
