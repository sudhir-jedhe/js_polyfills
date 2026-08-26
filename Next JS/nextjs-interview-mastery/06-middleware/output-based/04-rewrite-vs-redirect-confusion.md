## The QA team reports the A/B test is "broken." What's wrong?

```js
// middleware.js — intended: silently show pricing-variant for bucket B
import { NextResponse } from 'next/server';

export function middleware(request) {
  const bucket = request.cookies.get('ab-bucket')?.value ?? 'control';

  if (bucket === 'variant' && request.nextUrl.pathname === '/pricing') {
    return NextResponse.redirect(new URL('/pricing-variant', request.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ['/pricing'] };
```

QA's complaint: "Users in the variant bucket get bounced to a different URL, and analytics now shows two different page paths for what should be one A/B tested page, breaking our conversion funnel report."

**Answer:** The bug is using `NextResponse.redirect` instead of `NextResponse.rewrite`. A redirect sends a real 3xx response, the browser's URL bar changes to `/pricing-variant`, and a brand-new client request is made — visibly exposing the internal variant route and splitting analytics/URL-sharing behavior between two distinct URLs for what's supposed to be one logical page.

**Why:** `redirect` and `rewrite` are not interchangeable despite superficially similar signatures. `rewrite` serves the variant's content while the browser continues to show `/pricing` — no new request, no URL change, no funnel-tracking split. The fix is a one-word change:

```js
return NextResponse.rewrite(new URL('/pricing-variant', request.url));
```

This is a genuinely common real-world bug because both methods take an identical `URL` argument and both "successfully" show the right content — the difference only becomes visible in the browser's address bar and in downstream analytics, not in a quick manual content check.
