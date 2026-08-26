# Scenario: Role-Based Protection Across Multiple Route Groups

The app has three protection tiers: `/dashboard/*` requires any logged-in user, `/admin/*` requires an `admin` role, and `/billing/*` requires the user's account to be on a paid plan. Product wants distinct redirect destinations for each failure: no session → `/login`, wrong role → `/403`, unpaid → `/upgrade`.

**Approach:**

Encode role/plan in a signed JWT stored in the session cookie so middleware can check it cheaply (decode + verify signature) without a database round trip on every request — the whole point of doing this in middleware is that it must stay fast across every matched navigation.

```js
// middleware.js
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose'; // Edge-compatible JWT library

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function getSession(request) {
  const token = request.cookies.get('session')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload; // { userId, role, plan }
  } catch {
    return null; // expired or tampered token
  }
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const session = await getSession(request);

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith('/admin') && session.role !== 'admin') {
    return NextResponse.redirect(new URL('/403', request.url));
  }

  if (pathname.startsWith('/billing') && session.plan === 'free') {
    return NextResponse.redirect(new URL('/upgrade', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/billing/:path*'],
};
```

Points to raise:

1. **JWT verification, not a DB lookup**, keeps this Edge-safe and fast — `jose` is a widely used JWT library that works in the Edge Runtime (unlike Node-only JWT libraries built on Node's `crypto` module).
2. **Layered checks, ordered by specificity**: no-session check first (applies to all three tiers), then role, then plan — falling through to `NextResponse.next()` only if every applicable check passes.
3. **Different redirect destinations per failure mode** is exactly the kind of UX detail middleware is well-positioned to own, since it's the first thing that sees the request and knows immediately why access was denied.
4. **Staleness tradeoff**: because the role/plan comes from the JWT payload (set at login/refresh time), a role change or downgrade won't take effect until the token is reissued. That's an acceptable tradeoff for most apps but worth stating explicitly — if instant revocation is a hard requirement, you'd need a short-lived token plus a lightweight refresh/blocklist check, accepting the added latency cost that comes with it.
