# Reading Query Params, Body, Headers, and Cookies

A Route Handler has four common inputs, and each has its own idiom in the App Router. Knowing all four cold is table stakes for an interview.

**Query params** come off `request.nextUrl.searchParams` (a `URLSearchParams` instance), not off a `req.query` object:

```js
// GET /api/notes?tag=work&limit=10
export async function GET(request) {
  const { searchParams } = request.nextUrl;
  const tag = searchParams.get('tag');       // "work"
  const limit = Number(searchParams.get('limit') ?? 20);
  return Response.json({ tag, limit });
}
```

Reading `searchParams` at all is what flips the route from "potentially static" to "always dynamic" — Next.js can't cache a response that depends on query input it hasn't seen yet.

**Body** parsing depends on content type, and you pick the matching consumer method:

```js
export async function POST(request) {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const data = await request.json();
    return Response.json({ mode: 'json', data });
  }

  if (contentType.includes('form')) {
    const form = await request.formData();
    return Response.json({ mode: 'form', name: form.get('name') });
  }

  return new Response('Unsupported content type', { status: 415 });
}
```

**Headers** are read via the standard `Headers` interface on `request.headers`, which is case-insensitive by spec (`request.headers.get('Content-Type')` and `.get('content-type')` are equivalent). There is also a `headers()` function importable from `next/headers` for use in Server Components — but inside a Route Handler you almost always just read `request.headers` directly, since the request object is right there.

**Cookies** have two equally valid access points inside a Route Handler. You can read them off the request:

```js
export async function GET(request) {
  const token = request.cookies.get('session')?.value;
  if (!token) {
    return new Response('Unauthorized', { status: 401 });
  }
  return Response.json({ authed: true });
}
```

Or, using the `cookies()` helper from `next/headers` (works the same inside Route Handlers, Server Components, and Server Actions):

```js
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value;
  if (!token) return new Response('Unauthorized', { status: 401 });
  return Response.json({ authed: true });
}
```

Both are fine to read with; the difference matters for *writing*. Inside a Route Handler you can freely set cookies on the outgoing response — `NextResponse.json(data)` then `.cookies.set('session', token, { httpOnly: true })` — because a Route Handler always produces a real HTTP response that can carry `Set-Cookie`. Server Components, by contrast, are read-only with respect to cookies — you can't call `cookies().set(...)` inside a Server Component render, only inside a Route Handler or a Server Action, because only those have an actual outgoing response/mutation context. This read-vs-write asymmetry is a favorite gotcha in interviews.

Dynamic route segments round out the inputs: `params` arrives as the second argument to every handler function, already parsed from the file path (`app/api/notes/[id]/route.js` → `{ params: { id: '42' } }`), no manual URL parsing required.
