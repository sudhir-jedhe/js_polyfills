# Request/Response Are Web APIs, Not Express Objects

The single biggest mental shift moving from the Pages Router's `pages/api` to App Router Route Handlers is that you're no longer working with Express-style `req`/`res` objects. You're working with the standard **Web `Request` and `Response`** objects — the same interfaces available in browsers, Cloudflare Workers, Deno, and the Edge Runtime generally. Next.js extends `Request` with a convenience wrapper called `NextRequest`, and gives you `NextResponse` as an extended `Response`, but you rarely *need* the extended versions for simple handlers.

```js
// app/api/echo/route.js
export async function POST(request) {
  // `request` is a standard Web API Request
  const contentType = request.headers.get('content-type');
  const body = await request.json();

  return new Response(JSON.stringify({ received: body }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
```

This has real consequences. There's no `res.status(200).json(...)` chaining — you construct a `Response` (or use the `Response.json()` shorthand, or Next's `NextResponse.json()`) and return it. There's no `res.send()`, no implicit response — if your function doesn't return a `Response`, Next.js throws.

Reading the body is also different: Express gives you `req.body` already parsed (if you wired up `body-parser`). Here, `request.json()`, `request.text()`, `request.formData()`, and `request.arrayBuffer()` are all **async methods you must await**, and each can only be called once per request because the body stream is consumed on read.

```js
export async function POST(request) {
  const form = await request.formData();
  const email = form.get('email');
  // request.json() here would throw — body already consumed
}
```

`NextRequest` (the type you get automatically in `middleware.js`, and optionally in Route Handlers) adds a few Next-specific conveniences on top of the standard `Request`:

```js
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams; // parsed URL object
  const tag = searchParams.get('tag');
  return NextResponse.json({ tag });
}
```

`request.nextUrl` gives you a pre-parsed `URL` object (so no manual `new URL(request.url)`), and it's what you use to read query strings. `NextResponse` adds static helpers like `NextResponse.redirect()`, `NextResponse.rewrite()`, and cookie-setting sugar (`response.cookies.set(...)`) that plain `Response` doesn't have.

Why does this matter for interviews? Because it signals whether you understand that Route Handlers can run on either the Node.js runtime or the **Edge Runtime** (`export const runtime = 'edge'`), and Edge doesn't have Node's `http` module — it only has Web APIs. Code written against `Request`/`Response` runs unchanged on both runtimes; code written assuming Node's `IncomingMessage` does not exist here at all, because there is no such object to assume.
