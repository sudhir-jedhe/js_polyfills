# Does this project build?

```
app/
  [category]/
    page.tsx
  [id]/
    page.tsx
```

**Answer:** No — this fails the build with an error along the lines of *"You cannot have two parallel pages that resolve to the same path"* / conflicting dynamic segment names at the same route level. Next.js refuses to build a project with two differently-named single dynamic segments as direct siblings at the same folder depth.

**Why:** Both `[category]` and `[id]` would match the exact same set of URLs — any single path segment like `/electronics` or `/42` — and Next.js has no runtime signal (no distinguishing static prefix, no way to know which "meaning" a raw string segment has) to decide which route should own a given request. This differs from having genuinely different dynamic route *shapes* at the same level, like `[id]` (single segment) versus `[...slug]` (catch-all) — those two together are also disallowed for the same reason (both can match a single-segment URL) — you'll get a similar build error. The fix is always to disambiguate with a static path prefix: `product/[id]` and `category/[category]` as siblings under a common static parent, rather than trying to distinguish purely by param name at the same folder level. This is a good interview trap because it looks like a naming/typing problem, but it's really a routing-topology problem — the param *name* is irrelevant to route matching; only the *shape* (segment count, static vs. dynamic) matters.
