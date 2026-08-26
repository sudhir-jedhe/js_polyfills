# Why did every route on the site get slower after this middleware was added, including public pages?

```ts
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Log every request for analytics
  await fetch('https://analytics.example.com/log', {
    method: 'POST',
    body: JSON.stringify({ path: request.nextUrl.pathname, ts: Date.now() }),
  });

  const isAuthed = Boolean(request.cookies.get('session'));
  if (!isAuthed && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// no `matcher` export -- runs on every request by default
```

After deployment, even the public marketing homepage (`/`) feels slower, despite the auth check only being relevant to `/dashboard/*`.

**Answer:** Two compounding problems. First, there's no `config.matcher` export, so this middleware runs on **every single request** to the app — including static assets, the public homepage, and any route that has nothing to do with auth — not just the `/dashboard/*` paths the auth logic actually cares about. Second, the `await fetch(...)` analytics call **blocks the middleware's response** until that external request completes — every single page load now pays the latency cost of a round trip to `analytics.example.com` before Next.js even starts resolving the actual route, regardless of whether that page needs the auth check or not.

**Why:** Middleware executes before routing resolves, on every matching request, which makes any blocking or slow operation inside it a tax paid by the entire site, not just the route it's logically meant to protect. Two fixes: (1) add a `matcher` config to scope the middleware to only the paths that actually need the auth check — `export const config = { matcher: ['/dashboard/:path*'] }` — so public pages skip this middleware invocation entirely; (2) don't block the response on a non-critical side effect like analytics logging — either fire it without awaiting (accepting it may not reliably complete before the edge function terminates, which is itself a reason to move it elsewhere), or better, move analytics logging out of middleware entirely into something that doesn't sit on the critical path of every request, such as a client-side beacon or an async log write in the actual page/Route Handler that's already running for that request.
