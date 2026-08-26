# Middleware Runs on the Edge Runtime, Not Node.js

This is the single most important fact about Next.js middleware, and the one interviewers probe hardest: **middleware executes on the Edge Runtime by default**, not the Node.js runtime that your Server Components and (by default) your Route Handlers use.

The Edge Runtime is a deliberately minimal JavaScript environment, closer to what runs in a browser or a service worker than to full Node.js. It's designed to run at CDN edge locations, geographically close to the requesting user, so middleware can make routing decisions with very low latency before the request even reaches your main server region.

The practical consequence: **a large chunk of Node.js's standard library simply does not exist in middleware.** No `fs` (no filesystem access — you can't read a local file to check something). No native TCP/`net` — meaning most traditional database drivers (e.g., `pg`, `mysql2`, Prisma's default engine) won't work directly. No `crypto` module in the Node sense (Edge has the Web Crypto API instead, which has a different, more limited surface). No arbitrary native Node addons.

```js
// middleware.js — this will NOT work
import fs from 'fs'; // ❌ 'fs' has no Edge Runtime equivalent

export function middleware(request) {
  const config = fs.readFileSync('./config.json'); // throws / build error
  return NextResponse.next();
}
```

```js
// middleware.js — this works: Web APIs, fetch, and Next's own helpers
export async function middleware(request) {
  const res = await fetch('https://api.example.com/feature-flags'); // ✅ fetch is a Web API
  const flags = await res.json();

  if (flags.newCheckout) {
    return NextResponse.rewrite(new URL('/checkout-v2', request.url));
  }
  return NextResponse.next();
}
```

What *does* work: `fetch`, the Web Crypto API (`crypto.subtle`), `URL`/`URLSearchParams`, standard JS globals, and Next's own `NextRequest`/`NextResponse` helpers. If you need a database lookup in middleware (say, to validate a session token against a real session store rather than just checking a cookie's presence), you either call an HTTP API (Edge-safe, since `fetch` works) or use an Edge-compatible database client specifically built for this environment (several serverless-first DB providers ship Edge-compatible drivers over HTTP).

You *can* opt a specific middleware into the Node.js runtime in recent Next.js versions via `export const config = { runtime: 'nodejs' }`, but this is the exception, not the rule, and comes with its own deployment-target caveats (not all hosting platforms support Node-runtime middleware the same way they support Edge middleware). The default assumption an interviewer wants to hear you state plainly: **middleware code must be written as if it's running in a constrained, Node-API-free environment**, because on most deployments, it is.

This is also why middleware is a poor place for "heavy" work — not just because of API availability, but because Edge functions are billed and rate-limited differently than your main compute, and they run on every single matched request (the next theory file covers why that changes how you should think about performance here).
