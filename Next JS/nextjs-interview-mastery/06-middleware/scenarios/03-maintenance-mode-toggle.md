# Scenario: Instant Maintenance Mode Without a Redeploy

Ops wants the ability to flip the entire site into "maintenance mode" — showing a static "back soon" page to all visitors — instantly, without a redeploy, and to be able to flip it back off just as fast. A hardcoded `if (MAINTENANCE) return <Maintenance />` in the root layout would require a redeploy for every toggle, which is too slow for an incident response tool.

**Approach:**

Middleware is well-suited here because it can check a fast, externally-toggleable flag (an environment variable read at the edge, or better, a tiny KV/edge-config read) on every request, before any page rendering starts — and because it can return a response directly without even routing to a page.

```js
// middleware.js
import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config'; // or any Edge-compatible KV store

export async function middleware(request) {
  const isMaintenanceMode = await get('maintenanceMode').catch(() => false);

  if (isMaintenanceMode) {
    // Allow the maintenance page itself and static assets through untouched.
    if (request.nextUrl.pathname === '/maintenance') {
      return NextResponse.next();
    }
    return NextResponse.rewrite(new URL('/maintenance', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

Points to raise:

1. **Rewrite, not redirect**, keeps every URL intact — search engines and bookmarks aren't disrupted, and toggling maintenance mode off doesn't require anyone to navigate anywhere new.
2. **External, fast-to-read flag source** (an edge-config/KV service designed for this) rather than a plain environment variable — env vars typically require a redeploy to change on most platforms, which defeats the "instant" requirement. This is one of the rare middleware cases where an external read is justified, because the entire feature's value proposition is "toggle instantly without redeploying," and the read is a purpose-built, low-latency edge KV lookup, not an arbitrary API call.
3. **Fail open, not closed** — the `.catch(() => false)` ensures that if the flag service itself is unreachable, the site stays *up* rather than accidentally showing maintenance mode to everyone because a dependency hiccupped. Whether "fail open" or "fail closed" is correct is worth discussing explicitly with stakeholders per use case (for a maintenance toggle, fail open is almost always right).
4. **Excluding `/maintenance` itself from the rewrite loop** — otherwise you get the exact same infinite-redirect-style bug as the auth-redirect-loop case, just with rewrites instead of redirects (a request for `/maintenance` would rewrite to `/maintenance`, which is at least not infinite since it's already the target, but still worth guarding explicitly for clarity and to avoid double rewriting overhead).
