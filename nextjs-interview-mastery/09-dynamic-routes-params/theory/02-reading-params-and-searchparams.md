# Reading `params` and `searchParams` in a Server Component Page

Every `page.tsx` under a dynamic segment receives a `params` prop, and every page (dynamic or not) can receive a `searchParams` prop for the query string. Getting the types and the async behavior right is a frequent interview checkpoint, especially since Next.js 15 changed the contract.

## `params`: path segment values

```tsx
// app/blog/[slug]/page.tsx
export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return <Post post={post} />;
}
```

In Next.js 15, `params` (and `searchParams`) are **Promises** — you must `await` them before use. This is a deliberate change to let Next.js start streaming a route's shell before the exact params are resolved, and to unify the API with the async nature of the rest of the data layer. In Next.js 14, `params` was a plain synchronous object; if you're working across versions, check `next`'s major version before assuming which shape applies. Values inside `params` are always strings (or `string[]` for catch-all segments) — never numbers, dates, or booleans. Any `id` you read from `params` needs explicit parsing (`Number(id)`) and validation before you trust it.

## `searchParams`: the query string

```tsx
// app/products/page.tsx
export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { sort, page } = await searchParams;
  const products = await getProducts({
    sort: sort ?? 'newest',
    page: Number(page ?? 1),
  });
  return <ProductGrid products={products} />;
}
```

`searchParams` values can be `string`, `string[]` (for repeated keys like `?tag=a&tag=b`), or `undefined` when the key is absent — always code defensively for all three shapes.

## The performance implication of `searchParams`

Reading `searchParams` opts a page into **dynamic rendering** at request time, because the query string isn't known at build time. A page that only reads `params` can still be statically rendered via `generateStaticParams`; a page that reads `searchParams` cannot be fully static, since Next.js has no way to enumerate every possible query string combination in advance. If you see a page that should be static suddenly rendering dynamically, `searchParams` usage further down the component tree is a prime suspect.

## Passing params down vs. reading them again

`params` and `searchParams` are only injected into `page.tsx` and `layout.tsx` (params only, layouts never receive `searchParams` — that's intentional, since layouts persist across sibling pages with different query strings and re-rendering a layout on every search param change would defeat the purpose of layout persistence). If a deeply nested Server Component needs the slug, pass it down as a regular prop from the page rather than trying to re-read route params from an arbitrary component — there's no hook for that on the server.

The interview-ready summary: params describe *where* you are (path shape, known at build or request time), searchParams describe *how* you're viewing it (filters, pagination, sort — usually only known at request time), and that distinction is exactly why one participates in static generation and the other forces dynamic rendering.
