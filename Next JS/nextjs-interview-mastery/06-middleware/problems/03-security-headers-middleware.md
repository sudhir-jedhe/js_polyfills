# Problem 3: Global Security Header Middleware

## Task

Implement `middleware.js` that adds the following headers to every response for every page (not API routes, which may need different CSP rules — exclude `/api/*` from this middleware's matcher):

- `Content-Security-Policy`: allow scripts/styles/images only from `'self'`, plus inline styles (many CSS-in-JS setups need `'unsafe-inline'` for `style-src`), and images additionally from `https:` and `data:` URIs.
- `X-Frame-Options: DENY` (prevent clickjacking via iframe embedding).
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy` disabling `camera`, `microphone`, and `geolocation` by default.

## Constraints

- Headers go on the outgoing **response**, not the request.
- Must still allow the app to function normally — don't lock down `script-src` so tightly that Next.js's own inline hydration script breaks (allow `'unsafe-inline'` for scripts here for simplicity, and note in a comment that a production-grade CSP would use a nonce instead).

## Solution

```js
// middleware.js
import { NextResponse } from 'next/server';

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'", // production: replace with a per-request nonce
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https: data:",
  "font-src 'self'",
  "connect-src 'self'",
].join('; ');

export function middleware(request) {
  const response = NextResponse.next();

  response.headers.set('Content-Security-Policy', CSP);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=()'
  );

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

Notes worth stating out loud in an interview:

- `'unsafe-inline'` on `script-src` is a real tradeoff being made explicitly for simplicity — a production app serving sensitive data would generate a per-request nonce (readable via `crypto.randomUUID()`, Edge-safe), inject it into both the CSP header and the app's inline scripts, and drop `'unsafe-inline'` entirely.
- Excluding `/api` from the matcher acknowledges that API responses (often consumed by non-browser clients or via `fetch` from your own frontend, not rendered as HTML) don't need a CSP at all, and applying one there is at best inert and at worst confusing to debug.
- Setting headers via `response.headers.set(...)` on the object returned from `NextResponse.next()` is what makes them apply to the actual page response the browser receives — this is the response-header path, distinct from (and simpler than) the request-header-forwarding pattern needed when you want a *downstream Server Component* to read a header, which requires the `NextResponse.next({ request: { headers } })` form instead.
