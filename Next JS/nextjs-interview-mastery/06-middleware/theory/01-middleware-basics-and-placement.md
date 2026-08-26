# Middleware: What It Is and Where It Runs

Next.js middleware is a single file — `middleware.js` (or `.ts`) — placed at the **project root** (same level as `app/`, or inside `src/` if you use a `src` directory). It exports one function, conventionally named `middleware`, that runs **before a request is completed**: before Next.js resolves which route/page/Route Handler will actually handle it.

```js
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  console.log('Incoming request to:', request.nextUrl.pathname);
  return NextResponse.next();
}
```

This positioning — ahead of routing — is what makes middleware useful for cross-cutting concerns: authentication gates, redirects, rewrites, header injection, A/B test bucketing, and locale detection. Whatever middleware decides happens *before* any page component, layout, or Route Handler even starts executing for that request.

There is exactly one `middleware.js` per project (you can't have multiple middleware files scattered around like you can with `route.js`). If you need different logic for different route groups, you branch inside that single function using `request.nextUrl.pathname`:

```js
export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    // auth check
  }

  if (pathname.startsWith('/api/')) {
    // rate limiting, API-specific headers
  }

  return NextResponse.next();
}
```

Every middleware function must return one of three things: `NextResponse.next()` (continue to the normally resolved route, optionally with modified headers/cookies attached), `NextResponse.redirect(url)` (send the browser elsewhere with a 3xx), or `NextResponse.rewrite(url)` (serve different content for the same visible URL, transparently to the client). Returning nothing/`undefined` is treated the same as `NextResponse.next()` in most versions, but explicit is better — always return a `NextResponse`.

A structural point that trips people up: middleware does **not** wrap around Route Handlers or pages the way Express middleware wraps a request/response lifecycle with multiple chained functions calling `next()`. There's no middleware "stack" you register — it's one function, one pass, and then routing proceeds normally (or is redirected/rewritten). If you need composable middleware-like logic, you build that composition yourself inside the single `middleware` function (e.g., an array of check functions you loop through), because Next.js only recognizes the one exported entry point.

Where middleware physically executes matters just as much as when — that's covered next, because it's not the same runtime your pages and Route Handlers use by default, and that distinction has real consequences for what code you can write inside it.
