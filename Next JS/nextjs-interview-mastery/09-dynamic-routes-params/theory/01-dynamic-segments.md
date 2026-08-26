# Dynamic Segments: `[slug]`, `[...slug]`, `[[...slug]]`

The App Router encodes dynamic routing directly into the filesystem. A folder name wrapped in square brackets becomes a **dynamic segment** whose matched value is handed to your page as a route parameter. There are three flavors, and picking the wrong one is a common source of "why does this route not match" bugs.

## `[slug]` — single dynamic segment

```
app/blog/[slug]/page.tsx
```

This matches exactly one path segment: `/blog/hello-world` matches, with `params.slug === 'hello-world'`. It does **not** match `/blog/2024/hello-world` — that's two segments, and a single bracket only ever captures one. It also does not match `/blog` itself (no segment present); you'd need a separate `app/blog/page.tsx` for that.

## `[...slug]` — catch-all segment

```
app/docs/[...slug]/page.tsx
```

The spread syntax captures **one or more** remaining segments as an array. `/docs/a` gives `params.slug === ['a']`, `/docs/a/b/c` gives `['a', 'b', 'c']`. Crucially, `/docs` with nothing after it does **not** match — catch-all requires at least one segment. This is the shape you want for documentation sites, wikis, or any content tree with arbitrary, unpredictable depth.

## `[[...slug]]` — optional catch-all segment

```
app/shop/[[...slug]]/page.tsx
```

Double brackets make the catch-all optional, so this single route file matches `/shop`, `/shop/electronics`, and `/shop/electronics/laptops` all at once. When there's nothing to capture, `params.slug` is `undefined` (not an empty array) — a detail that trips people up when they write `slug.length` without a guard. This pattern is common for category browsers where the "root" listing and nested category pages should share one component.

## Choosing between them

```tsx
// app/docs/[...slug]/page.tsx
export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const path = slug.join('/');
  const doc = await getDocByPath(path);
  if (!doc) notFound();
  return <Article content={doc.content} />;
}
```

Rule of thumb: use `[slug]` when the URL shape is fixed at one level (product ID, username), `[...slug]` when depth is variable but a root page without a slug is meaningless, and `[[...slug]]` when you want one component to also own the root route.

## A subtlety with route groups and multiple dynamic segments

Two sibling dynamic segments at the same level (e.g., both `app/[category]/page.tsx` and `app/[id]/page.tsx`) are a build error — Next.js can't disambiguate which param name a given URL segment belongs to. If you need multiple "shapes" of dynamic route colliding at the same level, disambiguate with static prefixes (`/product/[id]`, `/user/[id]`) or route groups, not by stacking differently-named single dynamic segments side by side.

In interviews, the sharp distinction to articulate is: bracket count controls arity (one segment vs. many), and double brackets control optionality of the whole match — two independent axes that combine into three practical tools.
