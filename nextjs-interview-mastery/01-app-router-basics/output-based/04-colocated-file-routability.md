# Output: Is `/dashboard/utils` a Route?

```
app/
  dashboard/
    page.tsx
    utils.ts
    Card/
      index.tsx
```

Given this tree, does visiting `/dashboard/utils` in the browser render `utils.ts`'s default export (if it had one)? Does `/dashboard/Card` render anything?

**Answer:** Neither is a route. Visiting `/dashboard/utils` or `/dashboard/Card` returns a 404 (the nearest `not-found.tsx`, or the default Next.js 404 page).

**Why:** Only files matching reserved convention names — `page`, `layout`, `loading`, `error`, `not-found`, `template`, `route`, `default` — are wired into the router, and only when they live directly inside a folder that's part of the URL path being resolved. `utils.ts` isn't one of those names, so it's inert for routing regardless of its location — it's just a colocated module. `Card/index.tsx` is also irrelevant to routing: Next.js's App Router does not treat `index.tsx` as a page-equivalent (that's a Pages Router / bundler convention); a folder only becomes a route if it directly contains a `page.tsx` (or `page.js`). `Card/` here is just a colocated component folder, safely nested inside the route folder without becoming navigable.
