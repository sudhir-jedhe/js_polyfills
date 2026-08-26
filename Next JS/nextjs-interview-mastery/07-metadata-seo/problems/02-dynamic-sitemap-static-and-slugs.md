# Problem 2: Dynamic `sitemap.js` With Static Routes and Blog Slugs

## Task

Implement `app/sitemap.js` that returns:

- Four static routes: `/`, `/about`, `/pricing`, `/contact`, each with an
  appropriate `changeFrequency` and `priority` (homepage highest priority).
- Every blog post slug fetched from `getAllPosts()`, each entry using the
  post's real `updatedAt` as `lastModified`.
- All URLs must be absolute, built from a single `BASE_URL` constant (no
  hardcoding the domain in multiple places).

## Constraints

- `getAllPosts()` should be revalidated periodically (not `no-store` on every
  crawl, but not permanently stale either) — pick and justify a
  `revalidate` value.
- Structure the code so static and dynamic entries are clearly separated and
  easy to extend later (e.g., adding a `case-studies` content type).

## Solution

```js
// app/sitemap.js
const BASE_URL = 'https://example.com';

const STATIC_ROUTES = [
  { path: '/', priority: 1, changeFrequency: 'daily' },
  { path: '/about', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/pricing', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.4, changeFrequency: 'yearly' },
];

export default async function sitemap() {
  const staticEntries = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const posts = await getAllPosts();
  const postEntries = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}

async function getAllPosts() {
  const res = await fetch('https://api.example.com/posts', {
    // 10-minute revalidation: sitemap freshness matters for discoverability,
    // but crawlers don't re-fetch sitemap.xml on every single crawl anyway,
    // so a short cache window balances freshness against origin load.
    next: { revalidate: 600 },
  });
  if (!res.ok) return [];
  return res.json();
}
```

Extending this to a second content type later is a matter of adding one more
`fetch` + `.map(...)` pair and spreading it into the returned array — the
static/dynamic separation keeps that change localized and low-risk.
