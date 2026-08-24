# Scenario: Sitemap Must Include Both Static Pages and CMS Content

The marketing site has a handful of static pages (`/`, `/about`, `/pricing`,
`/contact`) plus hundreds of blog posts and dozens of case studies, all
stored in a headless CMS. SEO wants a single accurate `sitemap.xml` that
always reflects current content, without anyone manually updating a static
file when new posts or case studies are published.

**Approach:**

```js
// app/sitemap.js
const BASE_URL = 'https://acme.example.com';

export default async function sitemap() {
  const staticRoutes = [
    { path: '', priority: 1, changeFrequency: 'daily' },
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' },
    { path: '/pricing', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'yearly' },
  ].map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const [posts, caseStudies] = await Promise.all([
    getAllPosts(),
    getAllCaseStudies(),
  ]);

  const postRoutes = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const caseStudyRoutes = caseStudies.map((study) => ({
    url: `${BASE_URL}/case-studies/${study.slug}`,
    lastModified: study.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes, ...caseStudyRoutes];
}

async function getAllPosts() {
  const res = await fetch('https://cms.example.com/api/posts', {
    next: { revalidate: 3600, tags: ['posts'] },
  });
  return res.json();
}

async function getAllCaseStudies() {
  const res = await fetch('https://cms.example.com/api/case-studies', {
    next: { revalidate: 3600, tags: ['case-studies'] },
  });
  return res.json();
}
```

Points worth raising:

1. **Fetching multiple content types in parallel** (`Promise.all`) rather
   than sequentially, since sitemap generation shouldn't be slower than it
   needs to be, especially if it's regenerated on every crawl request rather
   than fully cached.
2. **Explicit `lastModified`** per entry sourced from the CMS's actual
   `updatedAt`, not a blanket `new Date()` for everything — search engines
   use this to prioritize re-crawling recently changed content, so a
   uniformly "just now" timestamp on unchanged pages is actively
   counterproductive.
3. **Scaling concern**: if post/case-study counts grow into the tens of
   thousands, this single-file approach hits the 50,000-URL-per-sitemap
   ceiling — at that point, `generateSitemaps()` splitting output across
   multiple numbered sitemap files becomes necessary, referenced from an
   auto-generated sitemap index.
4. **Cache/revalidation strategy matters here too** — a `revalidate: 3600`
   window means a newly published post can take up to an hour to appear in
   the sitemap unless the CMS's publish webhook also calls
   `revalidateTag('posts')` to invalidate immediately.
