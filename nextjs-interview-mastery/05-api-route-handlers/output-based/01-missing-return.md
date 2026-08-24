## What happens when this route handler runs?

```js
// app/api/log/route.js
export async function POST(request) {
  const body = await request.json();
  console.log('Received:', body);
  // no return statement
}
```

**Answer:** The request hangs, then the client eventually receives a `500 Internal Server Error` (Next.js logs something like "No response is returned from route handler"). The response is never sent successfully — it is not a silent `200` with an empty body.

**Why:** Every exported HTTP method function in a `route.js` file is a contract: it must return a `Response` (or `NextResponse`, or a plain object via `Response.json`-style helpers) — undefined is not a valid return value. Unlike Express, where forgetting `res.end()` just leaves the connection open until timeout with no explicit error, Next.js's Route Handler runtime actively detects a missing/invalid return value and surfaces a server error, because it needs *something* Response-shaped to serialize back over HTTP. The fix is trivial but easy to forget when a handler is "just logging and doing a side effect" — you still need `return new Response(null, { status: 204 })` or similar.
