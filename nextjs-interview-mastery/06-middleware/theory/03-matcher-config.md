# Scoping Middleware With `matcher`

By default, if you export a `middleware` function with no configuration, it runs on **every single request** to your app — every page, every Route Handler, every static asset request that reaches the server. That's rarely what you want: running your auth-check logic against a request for `/favicon.ico` or `/_next/static/chunk.js` is wasted work on every page load.

The `config.matcher` export scopes which paths trigger middleware:

```js
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // ... auth check
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*'],
};
```

`matcher` accepts an array of path patterns using Next's simplified matcher syntax (a subset of path-to-regexp): `:path*` matches any number of segments (including zero), `:path+` requires at least one segment, and you can also supply a full regex string directly for more control. `/dashboard/:path*` matches `/dashboard`, `/dashboard/settings`, and `/dashboard/settings/billing` — but not `/dashboard-public` (it's segment-aware, not a naive string prefix).

A very common pattern is the inverse: run middleware on almost everything **except** static assets and API internals, using a negative-lookahead regex:

```js
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
```

This says: match any path that does *not* start with `_next/static`, `_next/image`, isn't `favicon.ico`, and doesn't end in a common image extension. This is the recommended baseline when middleware needs to see "basically every navigable page" (e.g., for a global auth check or global header injection) without wasting cycles reprocessing every JS chunk and image request the browser fires.

You can also combine matcher-level scoping with in-function conditionals for finer-grained logic — matcher decides "does middleware run at all for this path," and the function body decides "given that it ran, what should happen":

```js
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') && !isAdmin(request)) {
    return NextResponse.redirect(new URL('/403', request.url));
  }
  if (pathname.startsWith('/dashboard') && !isAuthed(request)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

Skipping `matcher` entirely and relying purely on in-function `pathname.startsWith(...)` checks *works*, but it means middleware still executes (and pays whatever fixed overhead it has) on every request, including ones it immediately no-ops on. For anything beyond a trivial app, an explicit `matcher` is the correct default — it's both a performance optimization and documentation of intent, since a reviewer can see at a glance which routes are actually gated without reading the function body.
