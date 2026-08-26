## Why does the browser show "too many redirects"?

```js
// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const session = request.cookies.get('session')?.value;

  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|favicon.ico).*)'],
};
```

**Answer:** Visiting the app at all — including the `/login` page itself — triggers an infinite redirect loop, and the browser errors with `ERR_TOO_MANY_REDIRECTS`.

**Why:** The `matcher` matches essentially every path, including `/login`. An unauthenticated visitor requests `/login`, middleware sees no `session` cookie, and redirects them to... `/login` again — which re-triggers the exact same check, forever. This is one of the most common real-world middleware bugs: the matcher (or an in-function `pathname` check) doesn't exclude the destination of the redirect itself. The fix is to explicitly exclude `/login` (and any other public routes like `/signup`, `/reset-password`) either in the matcher or with an early-return guard:

```js
export function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname === '/login') {
    return NextResponse.next();
  }

  const session = request.cookies.get('session')?.value;
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}
```

Better still, scope the `matcher` to only the routes that actually need protection (`/dashboard/:path*`) rather than "everything except a growing exclusion list."
