# `sitemap.js` and `robots.js`: Programmatic Generation

Rather than hand-maintaining a static `public/sitemap.xml` and
`public/robots.txt`, the App Router lets you define `sitemap.js` and
`robots.js` at the root of `app/` (or nested, for section-specific sitemaps),
exporting functions that generate the correct output — XML and plain text,
respectively — automatically, correctly formatted, and (importantly) able to
include dynamic content like blog post slugs pulled from a real data source
at build or request time.

**`robots.js`** exports a default function returning a config object:

```js
// app/robots.js
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: 'https://example.com/sitemap.xml',
  };
}
```

Next.js serves this at `/robots.txt`, correctly formatted, with no manual
string templating.

**`sitemap.js`** exports a default function returning an array of URL
entries:

```js
// app/sitemap.js
export default async function sitemap() {
  const staticRoutes = ['', '/about', '/pricing'].map((route) => ({
    url: `https://example.com${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  const posts = await getAllPosts(); // fetched from a CMS/DB
  const postRoutes = posts.map((post) => ({
    url: `https://example.com/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes];
}
```

This is served at `/sitemap.xml`, and — crucially for a real content site —
it's **generated dynamically from your actual data source**, not a hardcoded
list that goes stale the moment someone publishes a new post without
remembering to update a static file. This is one of the most concrete,
practical wins the App Router's conventions give you over the Pages Router
approach, which typically required a custom build script to generate
`sitemap.xml`.

For very large sites (tens of thousands of URLs), a single `sitemap.js` can
become unwieldy — search engines also cap individual sitemap files at 50,000
URLs. Next.js supports generating **sitemap indexes** by exporting a
`generateSitemaps()` function alongside the default export, letting you split
output across multiple numbered sitemap files (`sitemap/0.xml`,
`sitemap/1.xml`, ...) that get referenced from an auto-generated sitemap
index — worth mentioning if asked about scaling this beyond a small site.

Both conventions matter for the same underlying reason: search engine
crawlers use `robots.txt` to know what *not* to crawl (keeping crawl budget
focused on content worth indexing) and `sitemap.xml` to discover what *does*
exist, especially content that isn't easily reachable through internal link
crawling alone (e.g., older paginated content, or pages behind a search
form). Getting both right is foundational, low-effort SEO hygiene that's
easy to get exactly right once and forget about, precisely because it's
generated from real data instead of manually maintained.
