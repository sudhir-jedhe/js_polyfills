# Problem 2: Locale-Detection Middleware

## Task

Implement `middleware.js` that:

- Rewrites `/` to `/en` or `/fr` based on the incoming `Accept-Language` header — `/fr` if French is the visitor's top preferred language among the app's supported locales, `/en` otherwise (default).
- Also rewrites any other top-level path missing a locale prefix — `/about` → `/en/about` or `/fr/about` — using the same detection logic.
- Does **not** re-rewrite a URL that already has a locale prefix (`/en/about` should pass through untouched, not become `/en/en/about`).
- Skips static assets via `matcher`.

## Constraints

- Only `en` and `fr` are supported; anything else in `Accept-Language` falls back to `en`.
- Parse `Accept-Language` manually (it's a comma-separated list like `fr-CA,fr;q=0.9,en;q=0.8`) — no library.

## Solution

```js
// middleware.js
import { NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'fr'];
const DEFAULT_LOCALE = 'en';

function detectLocale(acceptLanguageHeader) {
  if (!acceptLanguageHeader) return DEFAULT_LOCALE;

  const candidates = acceptLanguageHeader
    .split(',')
    .map((entry) => entry.trim().split(';')[0].slice(0, 2).toLowerCase());

  return candidates.find((lang) => SUPPORTED_LOCALES.includes(lang)) ?? DEFAULT_LOCALE;
}

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const alreadyLocalized = SUPPORTED_LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (alreadyLocalized) {
    return NextResponse.next();
  }

  const locale = detectLocale(request.headers.get('accept-language'));
  const newPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;

  return NextResponse.rewrite(new URL(newPath, request.url));
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
```

Walkthrough of the tricky parts:

- **`.split(';')[0]`** strips off the quality value (`;q=0.9`) from each `Accept-Language` entry before comparing.
- **`.slice(0, 2)`** normalizes `fr-CA` down to `fr` so region-specific tags still match a supported base locale.
- **The `alreadyLocalized` guard** is what prevents the double-prefix bug (`/en/en/about`) — without it, every internal navigation to an already-localized path would get re-rewritten with another prefix layered on top.
- The matcher's `.*\\..*` exclusion additionally skips any path containing a dot (covers most static file extensions) on top of the standard `_next` exclusions.
