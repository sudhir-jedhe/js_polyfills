# `NextResponse.redirect` vs `.rewrite` vs `.next()`

These three are the entire vocabulary of what middleware can *do* to a request, and mixing them up is a common interview stumble.

**`NextResponse.next()`** — "continue as normal." This is the pass-through case: middleware inspected the request and decided not to intervene in routing, though it may still attach headers or cookies to the eventual response:

```js
export function middleware(request) {
  const response = NextResponse.next();
  response.headers.set('x-request-id', crypto.randomUUID());
  return response;
}
```

**`NextResponse.redirect(url)`** — sends the *browser* a real HTTP redirect (302 by default, or specify `308`/`301` for permanent). The URL bar changes. The client makes a brand new request to the new URL. This is what you want for "you're not logged in, go to `/login`" — the user should see `/login` in their address bar, and history/back-button behavior should reflect that they were redirected.

```js
export function middleware(request) {
  const isAuthed = Boolean(request.cookies.get('session'));
  if (!isAuthed && request.nextUrl.pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}
```

**`NextResponse.rewrite(url)`** — serves *different content* for the URL the user actually requested, transparently. The browser's address bar does **not** change, and no new client-side request happens — Next.js internally resolves the response from the rewritten path instead. This is the right tool for A/B testing (show `/checkout-v2`'s content while the URL stays `/checkout`) and locale/geo routing where you don't want to expose the underlying path structure to the user:

```js
export function middleware(request) {
  const bucket = request.cookies.get('ab-bucket')?.value ?? (Math.random() < 0.5 ? 'a' : 'b');

  if (bucket === 'b' && request.nextUrl.pathname === '/checkout') {
    const response = NextResponse.rewrite(new URL('/checkout-v2', request.url));
    response.cookies.set('ab-bucket', bucket);
    return response;
  }
  return NextResponse.next();
}
```

The mental model that sticks: **redirect changes what the user sees in the URL bar and triggers a new round trip; rewrite changes what content is served while keeping the URL bar exactly as the user typed/clicked it.** Confusing the two produces very different, very visible bugs — using `redirect` for A/B testing would leak the variant's internal route name into the URL (and break bookmarking/sharing the canonical URL); using `rewrite` for an auth gate would mean an unauthenticated user's URL bar still shows `/dashboard` while secretly seeing the login page's content, which is confusing and bad for analytics/bookmarking.

One more detail: both `redirect` and `rewrite` take a full `URL` object, typically constructed as `new URL(path, request.url)` — using `request.url` as the base is what correctly preserves the protocol/host across local dev, preview deployments, and production without hardcoding a domain.
