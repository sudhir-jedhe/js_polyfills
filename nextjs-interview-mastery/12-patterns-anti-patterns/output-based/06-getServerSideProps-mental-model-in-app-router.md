# A developer migrating from Pages Router writes this. What's wrong?

```tsx
// app/products/[id]/page.tsx
export async function getServerSideProps({ params }: { params: { id: string } }) {
  const product = await fetch(`https://api.example.com/products/${params.id}`).then((r) =>
    r.json()
  );
  return { props: { product } };
}

export default function ProductPage({ product }: { product: { name: string } }) {
  return <div>{product.name}</div>;
}
```

This developer is porting a Pages Router habit directly into an `app/` directory file. What actually happens when this route is requested?

**Answer:** `getServerSideProps` is simply **not a recognized export** in the App Router — Next.js's App Router routing convention doesn't look for it at all, so it's dead code, never called. `ProductPage` renders with `product` as `undefined` (since no `props` are ever injected the way Pages Router does it), and the component crashes trying to read `product.name` on `undefined` — or, depending on how defensively it's written, silently renders broken/empty content.

**Why:** The App Router doesn't have a special-function-export data-fetching contract at all — that entire model (`getServerSideProps`, `getStaticProps`, `getStaticPaths` as named exports the framework specifically looks for) is a Pages Router-only convention. In the App Router, a page component is simply an `async` function that fetches its own data directly, inline, using `params`/`searchParams` props and `fetch` (or any async data-access call):

```tsx
// app/products/[id]/page.tsx -- corrected
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await fetch(`https://api.example.com/products/${id}`, {
    cache: 'no-store',
  }).then((r) => r.json());

  return <div>{product.name}</div>;
}
```

This is a genuinely different mental model, not just renamed syntax: instead of a separate function returning a `props` object that the framework injects into a component, the component itself *is* the async function that fetches and directly uses the data — there's no intermediate "props" handoff step at all. This is one of the most common early mistakes for engineers moving from Pages Router to App Router, precisely because the old pattern doesn't throw an obvious "you used the wrong API" error — it just silently does nothing.
