# Problem 1: Auth-Gate Middleware for `/dashboard`

## Task

Implement `middleware.js` that:

- Protects every route under `/dashboard` (including nested routes like `/dashboard/settings/billing`).
- Checks for a `session` cookie; if missing, redirects to `/login`.
- Preserves the originally requested path as a `?from=` query param on the `/login` redirect, so the login page can redirect back after successful login.
- Does **not** run its check against `/login` itself, or any route outside `/dashboard` (use `matcher` to scope this correctly, not just an in-function check).
- Lets authenticated requests through unmodified.

## Constraints

- Cookie presence check only (no real JWT verification needed for this exercise, but structure the code so swapping in real verification later is a small change).
- Must not create a redirect loop.

## Solution

```js
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const session = request.cookies.get('session')?.value;

  if (!session) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
```

The `matcher` alone guarantees this never runs for `/login` (avoiding the redirect-loop class of bug), and `/dashboard/:path*` covers both `/dashboard` itself and any depth of nested route beneath it. The `from` query param round-trips through to the login page's own logic:

```jsx
// app/login/page.jsx (conceptual — the login form would read searchParams.from
// and redirect there after a successful Server Action login call)
export default function LoginPage({ searchParams }) {
  const from = searchParams.from ?? '/dashboard';
  return <LoginForm redirectTo={from} />;
}
```
