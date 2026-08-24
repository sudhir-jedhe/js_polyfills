# Why Middleware Must Stay Fast — and What It's Good For

Middleware runs on **every single request that matches its `matcher`** — not once per session, not once per user, but on every navigation, every prefetch, every asset request that isn't excluded. A dashboard app with an auth-gated `/dashboard/:path*` matcher runs its middleware function on every page transition within the dashboard, every client-side navigation prefetch, and every hard reload. That volume is the whole reason the "no heavy computation, no unbounded DB calls" rule exists — it's not a style preference, it's a latency and cost multiplier.

Concretely, avoid inside middleware:

- **Direct, unbounded database queries** on every request (e.g., a full user lookup with joins) — this adds real latency to *every* navigation in the matched scope, compounding across a session. Prefer reading a signed/encrypted cookie or JWT that already encodes what you need (role, auth status), validated cheaply (signature check), reserving any real DB hit for the actual page/Route Handler that needs fresh data.
- **External API calls without a timeout or fallback** — a slow third-party service now determines your entire app's perceived responsiveness, since middleware sits in front of every response.
- **Large synchronous computation** — Edge functions are billed and time-limited; expensive work blocks the response for that user and, in aggregate, can affect cold-start/scaling behavior at the edge.

What middleware *is* well-suited for, precisely because each check is meant to be cheap and stateless-ish:

**Auth gating** — check for a session cookie's presence (and maybe verify a JWT signature, which is fast/local, not a DB round trip) and redirect to `/login` if missing:

```js
export function middleware(request) {
  const token = request.cookies.get('session')?.value;
  if (!token && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}
```

**A/B testing via rewrites** — bucket a visitor (often via a cookie set once, read cheaply thereafter) and rewrite to a variant route.

**Geo/locale-based routing** — `request.geo` (on supporting platforms) or the `Accept-Language` header lets you rewrite `/` to `/en` or `/fr` without a client-side redirect flash.

**Adding response headers globally** — security headers (CSP, `X-Frame-Options`), request-id tracing headers, or `Server-Timing` — cheap, synchronous, and naturally global.

**Bot/rate-limit pre-checks** — a lightweight check (e.g., against an Edge-compatible rate limiter backed by a fast key-value store) to reject abusive traffic before it reaches your main compute — this is one of the few cases where an external call in middleware is justified, because rejecting early is exactly the point.

The unifying theme: middleware should make a **fast, mostly-synchronous or single-cheap-lookup decision** about routing/headers, then get out of the way. Anything requiring real business logic, multiple sequential data dependencies, or heavier computation belongs in the page, layout, or Route Handler that actually owns that concern — middleware is a gate, not a controller.
