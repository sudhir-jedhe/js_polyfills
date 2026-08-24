# Scenario: Product pages with SKU-level variants in the URL

**Problem:** An e-commerce catalog has products with variants (size, color) that should each be reflected in the URL for SEO and shareability — `/products/running-shoes/red/10` — but the site has tens of thousands of SKUs across thousands of base products, and building every variant combination at deploy time would make builds take hours for pages that mostly get near-zero traffic (e.g., an unpopular size/color combination of a niche product).

**Approach:** Use a `[...slug]` catch-all under `/products` to capture the full variant path in one route file, and pre-render only the "canonical" combinations that matter for SEO (top sellers, default variant per product) via `generateStaticParams`, leaving the long tail of specific variant combinations to render on-demand.

```tsx
// app/products/[...slug]/page.tsx
// slug: ["running-shoes"] | ["running-shoes", "red"] | ["running-shoes", "red", "10"]

export const dynamicParams = true;

export async function generateStaticParams() {
  const topProducts = await getTopSellingProducts(200);
  // Pre-render just the base product page and default variant for each top seller.
  return topProducts.flatMap((p) => [
    { slug: [p.handle] },
    { slug: [p.handle, p.defaultColor] },
  ]);
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const [handle, color, size] = (await params).slug;
  const product = await getProduct(handle);
  if (!product) notFound();

  const variant = resolveVariant(product, { color, size });
  return <ProductDetail product={product} variant={variant} />;
}
```

This keeps deploy time bounded (only a few hundred pre-rendered pages instead of tens of thousands) while every valid SKU URL still resolves correctly and gets cached after its first hit — a search-engine crawler or a customer following a specific deep-linked variant URL both get a fast, cached page after the first visit, without the build pipeline having to enumerate the full combinatorial product catalog up front. An additional discussion point for interviews: because `[...slug]` doesn't encode "how many segments are expected," the page component itself is responsible for validating that the captured array has a sane shape (1 to 3 segments here) and calling `notFound()` for anything malformed, since the routing layer alone won't reject, say, a 6-segment junk URL.
