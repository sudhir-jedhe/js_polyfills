# Scenario: Multi-Tenant App Routed by Subdomain

Your SaaS product gives each customer a subdomain — `acme.yourapp.com`, `globex.yourapp.com` — but internally the app only has one set of routes under `app/[tenant]/...`. You need incoming subdomain requests to transparently map onto that internal dynamic segment, without the user ever seeing `/acme/dashboard` in their URL bar.

**Approach:**

This is a textbook rewrite use case — the URL the user sees (`acme.yourapp.com/dashboard`) must stay exactly as-is, while the app internally serves it as if it were `/acme/dashboard`.

```js
// middleware.js
import { NextResponse } from 'next/server';

const ROOT_DOMAIN = 'yourapp.com';

export function middleware(request) {
  const host = request.headers.get('host') || '';
  const subdomain = host.replace(`.${ROOT_DOMAIN}`, '').replace(ROOT_DOMAIN, '');

  // No subdomain (marketing site) or "www" — don't rewrite.
  if (!subdomain || subdomain === 'www' || host === ROOT_DOMAIN) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${subdomain}${url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

Key points to raise:

1. **Rewrite, not redirect** — the whole point is the customer never sees `/acme/dashboard` in their address bar; they should only ever see `acme.yourapp.com/dashboard`.
2. **`request.headers.get('host')`**, not `request.nextUrl.hostname` alone, is the reliable source for the actual `Host` header sent — worth verifying behavior matches your hosting platform, since some proxy setups rewrite headers.
3. **Excluding `www` and the bare root domain** prevents the marketing site itself from being incorrectly treated as a tenant.
4. Downstream, `app/[tenant]/dashboard/page.jsx` reads `params.tenant` to scope all data fetching — middleware only handles the *routing* translation, not tenant data isolation, which still needs to be enforced in every query (never trust `params.tenant` alone without validating the requester actually belongs to that tenant, if there's any session-based access control layered on top).
5. This middleware runs on every request to any tenant subdomain, so the `host` parsing logic must stay trivial — no DB lookup to validate tenant existence here; that check belongs in the page/layout, which can 404 cleanly if the tenant slug doesn't exist.
