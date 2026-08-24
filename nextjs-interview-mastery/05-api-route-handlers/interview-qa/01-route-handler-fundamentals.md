# Interview Q&A: Route Handler Fundamentals

**Q: How does a Route Handler know which function to call for a given request?**
A: By HTTP method name. Next.js inspects the named exports in `route.js` — `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS` — and dispatches the incoming request to whichever export matches its method. There's no manual routing/switch statement; if a method has no matching export, Next.js auto-responds with `405 Method Not Allowed` and a correct `Allow` header.

**Q: Can `page.js` and `route.js` exist in the same folder?**
A: No, not for the same route segment — both would try to handle `GET` requests to the same URL, which Next.js treats as a build-time conflict. If you need a page and an API endpoint at conceptually related paths, put the API route under a distinct segment, most commonly nesting API routes under `app/api/...` by convention.

**Q: Why does `request.json()` sometimes throw when the client didn't send a body at all?**
A: `request.json()` calls the underlying JSON parser on the body stream; if the body is empty, parsing `''` as JSON throws a `SyntaxError`. This is a real production bug source — always wrap body parsing in try/catch, or check `request.headers.get('content-length')`/`content-type` before assuming a JSON body exists, especially for methods like `DELETE` where clients often send no body at all.

**Q: What's the difference between `Response.json(data)` and `NextResponse.json(data)`?**
A: `Response.json()` is a standard Web API static method (available in any modern JS runtime) that builds a `Response` with `Content-Type: application/json` and a JSON-stringified body. `NextResponse.json()` does the same but returns a `NextResponse` — a `Response` subclass with extra Next-specific features like `.cookies.set()`/`.cookies.delete()` sugar and awareness of Next's rewrite/redirect internals. For a plain JSON reply with no cookie manipulation, they're interchangeable; reach for `NextResponse` when you also need to set cookies or headers Next-specifically understands.
