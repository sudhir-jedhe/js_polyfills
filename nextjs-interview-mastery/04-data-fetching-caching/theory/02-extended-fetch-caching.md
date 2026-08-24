# Next.js's Extended `fetch()` Caching Behavior

Next.js patches the global `fetch()` inside the App Router so that every call carries extra, framework-specific caching semantics on top of standard Fetch API behavior. Understanding these options precisely is one of the highest-value things to know cold for an interview.

**`cache: 'force-cache'` (the default).** Unless told otherwise, `fetch()` calls made during rendering are cached indefinitely — the result is stored in Next.js's Data Cache and reused across requests, across users, and across deployments (until explicitly invalidated), without ever hitting the network again. This is what enables a route to be statically generated: if every `fetch()` in it uses this default behavior (or is otherwise cacheable), the whole route can be pre-rendered once and served as static HTML.

```tsx
// Cached indefinitely, contributes to static rendering
const res = await fetch('https://api.example.com/config')
```

**`cache: 'no-store'`.** Explicitly disables caching for that specific fetch — it hits the network on every single call, no matter how many times or how close together. Using this anywhere in a route's render path forces that route into dynamic rendering, since a fresh-every-time data dependency can't be part of a statically cached page.

```tsx
// Always fresh, forces the containing route dynamic
const res = await fetch('https://api.example.com/live-price', { cache: 'no-store' })
```

**`next: { revalidate: N }`.** The ISR-style middle ground — the result is cached, but Next.js will treat it as stale after `N` seconds and regenerate it (per the usual stale-while-revalidate behavior) on the next request after that point. This can be set per-fetch, independent of (but consistent with) any route-level `export const revalidate`.

```tsx
// Cached, but regenerated in the background after 60 seconds
const res = await fetch('https://api.example.com/products', { next: { revalidate: 60 } })
```

**`next: { tags: [...] }`.** Attaches one or more string tags to a cached fetch's entry, without changing its time-based behavior on its own. Tags exist purely to enable **on-demand invalidation**: calling `revalidateTag('posts')` elsewhere (typically in a Server Action or webhook-driven Route Handler) immediately invalidates every cached fetch result tagged `'posts'`, regardless of how much time remains on any `revalidate` window.

```tsx
const res = await fetch('https://api.example.com/posts', { next: { tags: ['posts'] } })
```

A subtlety worth remembering: these caching options only apply to `fetch()` calls made by Next.js's patched global (i.e., during Server Component rendering, Route Handlers, or Server Actions). Third-party data-fetching libraries or clients that don't use `fetch()` internally (some ORMs, some SDKs using raw sockets) don't automatically get this caching behavior — you'd need to wrap such calls yourself using React's `cache()` function or Next.js's `unstable_cache` if you want equivalent caching semantics for non-fetch data sources.
