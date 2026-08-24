# Scenario: Documentation site with an arbitrarily deep, editor-controlled tree

**Problem:** A docs team manages content in a headless CMS (or a folder of MDX-like files) organized as a nested tree: `getting-started`, `guides/authentication/oauth`, `api-reference/v2/endpoints/users`, etc. The nesting depth is decided by content editors, not developers, and changes over time as sections get reorganized. Hardcoding a route file per depth level (`[a]`, `[a]/[b]`, `[a]/[b]/[c]`...) is unmaintainable and breaks the moment an editor adds one more level of nesting.

**Approach:** A single catch-all route captures the entire remaining path as an array, regardless of depth, and the page resolves that array against the content source at request/build time.

```tsx
// app/docs/[...slug]/page.tsx
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const allDocPaths = await getAllDocPaths(); // e.g. ["getting-started", "guides/auth/oauth", ...]
  return allDocPaths.map((path) => ({
    slug: path.split('/'),
  }));
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = slug.join('/');
  const doc = await getDocByPath(path);

  if (!doc) notFound();

  return (
    <div>
      <DocBreadcrumbs segments={slug} />
      <DocContent doc={doc} />
      <DocSidebarNav currentPath={path} />
    </div>
  );
}
```

Because the whole documentation set is typically fully known ahead of time (unlike a blog with an ever-growing long tail), it's usually worth pre-rendering *all* of it via `generateStaticParams` rather than relying on on-demand rendering — docs sites value zero-latency navigation between pages over build-time cost, and the full path set is usually small enough (hundreds to low thousands of pages) that a full static build is fast and cheap. If the docs set ever grows large enough that full pre-rendering becomes a build-time bottleneck, the same hybrid pattern from the blog scenario (pre-render only top-level/most-visited pages, `dynamicParams = true` for the rest) applies identically here.
