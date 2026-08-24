## Does this correctly persist the cookie?

```js
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const response = NextResponse.next();

  if (!request.cookies.get('visitor-id')) {
    response.cookies.set('visitor-id', crypto.randomUUID(), {
      maxAge: 60 * 60 * 24 * 365,
    });
  }

  return response;
}
```

**Answer:** Yes — this is correct and idiomatic. The cookie is set on the `NextResponse` object that middleware returns, so it goes out as a `Set-Cookie` header on the actual HTTP response, and the browser stores it for future requests.

**Why:** This is worth including precisely because it's the *correct* pattern, to contrast against the common mistake of trying to set cookies on `request.cookies` (which, like mutating `request.headers` directly, doesn't propagate to the client — `request.cookies` reflects what the browser sent, it's not a channel for sending cookies back). `response.cookies.set(...)` is the API specifically designed for outbound cookie writes in middleware, mirroring the same `.cookies.set()`/`.cookies.get()` sugar available on `NextResponse` in Route Handlers. The `crypto.randomUUID()` call is also worth noting as Edge-Runtime-safe — it's part of the Web Crypto API, not Node's `crypto` module, so it works here without any runtime-compatibility issue.
