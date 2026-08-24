## Why does auth protection not apply to `/dashboard/settings`?

```js
export const config = {
  matcher: ['/dashboard'],
};

export function middleware(request) {
  const session = request.cookies.get('session')?.value;
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}
```

A user with no session cookie can freely browse to `/dashboard/settings` and `/dashboard/billing` — only the exact `/dashboard` path redirects them.

**Answer:** `matcher: ['/dashboard']` matches only the literal path `/dashboard`. It does not match any nested paths like `/dashboard/settings` — there's no wildcard, so those requests never trigger the middleware function at all and sail through unprotected.

**Why:** Next's matcher syntax requires an explicit wildcard to match nested segments — a bare string like `/dashboard` is an exact match, not a prefix match. The fix is `:path*` (zero or more nested segments) or `:path+` (one or more) to cover the whole subtree, and to also decide whether `/dashboard` itself should be included:

```js
export const config = {
  matcher: ['/dashboard', '/dashboard/:path*'],
};
```

or more simply, since `:path*` already allows zero segments in most Next.js versions' interpretation when applied correctly:

```js
export const config = {
  matcher: ['/dashboard/:path*'],
};
```

This is a good reminder to always test matcher patterns against every real nested route the app has, not just the top-level path — a matcher that "looks right" for the parent segment silently leaves children unprotected.
