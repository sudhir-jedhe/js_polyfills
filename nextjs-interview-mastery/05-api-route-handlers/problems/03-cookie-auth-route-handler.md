# Problem 3: Route Handler That Reads a Cookie for Auth

## Task

Implement `app/api/account/route.js` with a `GET` handler that:

- Reads a `session` cookie.
- Returns `401` with `{ error: 'Not authenticated' }` if the cookie is missing.
- "Validates" the cookie against a fake session store (an in-memory `Map` of `token -> user`); if the token isn't found (invalid/expired), also return `401`, with a distinct message (`{ error: 'Session expired or invalid' }`) so the client can tell the two 401 cases apart if it wants to.
- On success, returns `{ user }` with `200`.
- Bonus: add a `POST /api/account/login` handler that accepts `{ username }` in the body, creates a fake session, and sets the `session` cookie as `httpOnly`, `secure`, `sameSite: 'lax'` on the response.

## Constraints

- Use `request.cookies` or `cookies()` from `next/headers` — either is acceptable, but be able to explain the difference.
- The login route must actually set a cookie that the account route can then read (demonstrating the full loop).

## Solution

```js
// lib/session-store.js
const sessions = new Map();

export function createSession(user) {
  const token = crypto.randomUUID();
  sessions.set(token, user);
  return token;
}

export function getSessionUser(token) {
  return sessions.get(token) ?? null;
}
```

```js
// app/api/account/route.js
import { getSessionUser } from '@/lib/session-store';

export async function GET(request) {
  const token = request.cookies.get('session')?.value;

  if (!token) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = getSessionUser(token);
  if (!user) {
    return Response.json({ error: 'Session expired or invalid' }, { status: 401 });
  }

  return Response.json({ user }, { status: 200 });
}

export const dynamic = 'force-dynamic';
```

```js
// app/api/account/login/route.js
import { NextResponse } from 'next/server';
import { createSession } from '@/lib/session-store';

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body?.username || typeof body.username !== 'string') {
    return NextResponse.json({ error: 'username is required' }, { status: 400 });
  }

  const user = { username: body.username };
  const token = createSession(user);

  const response = NextResponse.json({ user }, { status: 200 });
  response.cookies.set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/',
  });

  return response;
}
```

Note the asymmetry: `GET /api/account` only *reads* the cookie via `request.cookies.get(...)`, while `POST /api/account/login` needs to *write* one — which is why it builds a `NextResponse` explicitly and calls `.cookies.set(...)` on it, rather than using the plain `Response.json()` shorthand that has no cookie-writing sugar.
