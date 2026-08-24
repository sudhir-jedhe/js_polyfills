## Why doesn't the page ever see this header?

```js
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  request.headers.set('x-user-tier', 'pro'); // trying to pass data downstream
  return NextResponse.next();
}
```

The team wants a Server Component to read `headers().get('x-user-tier')` and get `'pro'`, but it's always `null`.

**Answer:** Mutating `request.headers` directly does nothing useful — `request` here is effectively read-only/a snapshot for this purpose, and even where the mutation doesn't throw, it does not propagate to the request that Next.js actually forwards to the page/Route Handler. The downstream component never sees `x-user-tier`.

**Why:** To inject a header that downstream rendering can read, you must attach it to the **request headers passed into `NextResponse.next()`**, not mutate the inbound `request` object in place — the correct pattern rebuilds a `Headers` object and passes it explicitly:

```js
export function middleware(request) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-tier', 'pro');

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
```

This `{ request: { headers } }` option is specifically what tells Next.js "forward the request onward with these headers," as opposed to headers set directly on the `NextResponse` object (via `response.headers.set(...)`), which instead land on the **outgoing response to the browser** — useful for something like a CSP header, but invisible to server-side code rendering the page. Knowing this distinction — request headers (downstream server code) vs. response headers (the browser) — is exactly the kind of detail that separates "has read the docs once" from "has actually debugged this."
