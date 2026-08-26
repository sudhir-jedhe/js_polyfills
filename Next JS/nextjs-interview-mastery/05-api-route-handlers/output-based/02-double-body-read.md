## What's the bug here?

```js
export async function POST(request) {
  const json = await request.json();

  if (!json.title) {
    const text = await request.text(); // for a debug log
    console.log('raw body was:', text);
    return Response.json({ error: 'title required' }, { status: 400 });
  }

  return Response.json({ ok: true });
}
```

**Answer:** This throws a `TypeError: Body is unusable` (or `body stream already read`) whenever `json.title` is falsy — it never reaches the `400` response cleanly, it 500s instead.

**Why:** The `Request` body is a single-use stream. `request.json()` reads and fully consumes it. Any later call to `.text()`, `.formData()`, or `.arrayBuffer()` on the *same* request object finds the stream already drained and throws. This is a common trap when someone tries to "peek" at the raw body for logging after already parsing it as JSON. The fix is to read the body exactly once — either clone the request first (`request.clone().text()`, mirroring the standard Fetch API's `Request.clone()`), or restructure so you only ever call one body-reading method per incoming request.
