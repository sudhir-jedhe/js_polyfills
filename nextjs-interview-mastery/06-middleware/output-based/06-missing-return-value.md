## What's the effective behavior of this middleware?

```js
// middleware.js
export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const isAdmin = request.cookies.get('role')?.value === 'admin';
    if (!isAdmin) {
      console.log('Blocking non-admin access');
      // forgot to return a redirect/response here
    }
  }
  // falls through with no explicit return in the blocking branch
}
```

**Answer:** Despite the `console.log`, non-admin users are **not actually blocked** — they proceed to `/admin` normally. The function implicitly returns `undefined`, which Next.js treats as equivalent to allowing the request through (same as `NextResponse.next()`), so the "block" branch has no real effect beyond the log line.

**Why:** Unlike a Route Handler (which errors loudly on a missing return), middleware silently continuing on an implicit `undefined` return is a subtler failure mode — there's no crash, no error page, nothing that surfaces during casual testing unless you specifically check that the redirect happens. This is a real-world class of security bug: an "auth check" that logs correctly but never enforces anything, because the developer trusted the log statement as proof the branch worked without checking the actual returned value. The fix is to always explicitly return a `NextResponse` from every code path, and ideally add a lint rule or code review checklist item requiring explicit returns in every branch of security-relevant middleware:

```js
if (!isAdmin) {
  return NextResponse.redirect(new URL('/403', request.url));
}
```
