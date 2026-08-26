# Output: Build Error or Success?

```
app/
  (marketing)/
    pricing/
      page.tsx
  (app)/
    pricing/
      page.tsx
```

Both files render different content — one is the public pricing page, the other an internal admin pricing editor. What happens when you run `next build`?

**Answer:** The build fails with a routing conflict error, something like: "You cannot have two parallel pages that resolve to the same path."

**Why:** Route groups — the parenthesized folders — are stripped from the URL entirely. Both `(marketing)/pricing/page.tsx` and `(app)/pricing/page.tsx` resolve to the exact same public URL, `/pricing`. Next.js requires every URL to map to exactly one page, and route groups provide zero namespacing — they're a purely organizational/filesystem construct for grouping layouts, not a way to create URL prefixes. To actually separate these, you need a real (non-parenthesized) segment in the URL, e.g. `(app)/admin/pricing/page.tsx` resolving to `/admin/pricing`, or move one behind a distinct top-level path.
