# Interview Q&A: Layouts and Route Groups

**Q: Why can't `layout.js` read `searchParams`?**
A: Layouts persist across navigations by design, including navigations that only change the query string (e.g. `?page=2` to `?page=3`). If layouts received `searchParams` as a prop and re-rendered whenever it changed, they'd lose their core benefit of staying stable across such navigations. Only `page.js` receives `searchParams` directly from Next.js; if a layout genuinely needs to react to query params, it has to do so client-side via the `useSearchParams()` hook in a Client Component, which is a deliberate opt-in rather than the default behavior.

**Q: What problem do route groups solve that a plain folder can't?**
A: A plain nested folder becomes part of the URL — `app/marketing/pricing/page.tsx` renders at `/marketing/pricing`. A route group (`app/(marketing)/pricing/page.tsx`) organizes files and can host a shared `layout.tsx` for everything inside it, without that folder name appearing in the URL — it still renders at `/pricing`. This lets you group routes by concern (marketing vs. authenticated app, or even by team ownership) purely for codebase organization and layout-sharing, independent of URL structure.

**Q: Can you have more than one root layout in a single Next.js app?**
A: Yes, via route groups. Normally there's exactly one root `app/layout.tsx` defining `<html>`/`<body>` for the whole app. If you move that responsibility into per-group layouts instead — e.g. `app/(marketing)/layout.tsx` and `app/(app)/layout.tsx`, each with their own `<html>` — and remove the top-level `app/layout.tsx`, you get effectively independent root shells per section. Every route must resolve to exactly one such root layout; Next.js errors at build time if some route isn't covered.

**Q: If two different route groups define pages at the same effective URL, what happens?**
A: Build error. Route groups don't provide URL namespacing — they're purely a filesystem organization tool — so `(a)/foo/page.tsx` and `(b)/foo/page.tsx` both resolve to `/foo`, and Next.js requires every URL to map to exactly one page. You'd need to give one of them a distinct real (non-parenthesized) path segment to disambiguate.
