# Output: What Renders at `/blog`?

```
app/
  blog/
    layout.tsx
    [slug]/
      page.tsx
```

There is no `app/blog/page.tsx`. What happens when a user navigates to exactly `/blog` (not `/blog/something`)?

**Answer:** A 404 — the nearest `not-found.tsx` (or Next's default not-found UI, since none is defined here). `blog/layout.tsx` is not rendered for this URL either.

**Why:** A folder becomes a navigable route only when it (or, via dynamic matching, a segment inside it) contains a `page.tsx`. `app/blog/` itself has no `page.tsx` — only a `layout.tsx`, which is not independently routable — so `/blog` has nothing to render at that exact segment. The `[slug]/page.tsx` only matches URLs with an additional segment, like `/blog/hello-world`; it does not act as a catch-all or fallback for the parent path. This trips people up because they assume "there's a layout here, so something must render" — but layouts only ever wrap a `page.js`, they never substitute for one. To make `/blog` itself navigable, you'd add `app/blog/page.tsx` explicitly (e.g., a blog index listing posts).
