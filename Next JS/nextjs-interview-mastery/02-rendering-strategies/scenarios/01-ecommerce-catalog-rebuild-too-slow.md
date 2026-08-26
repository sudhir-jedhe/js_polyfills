# Scenario: A 50,000-Product Catalog That Takes 40 Minutes to Rebuild

Your e-commerce site uses pure SSG for `/products/[id]` — every product page is generated at build time via `generateStaticParams`. The catalog has grown to 50,000 SKUs, and full builds now take 40 minutes, which is killing deploy velocity. Worse, prices and stock levels change throughout the day from a separate inventory system, and the marketing team is frustrated that a price change requires a full redeploy to show up.

**Approach:** This is a textbook case for switching from pure SSG to ISR. The fix doesn't require rewriting the fetch logic — it's mostly a config change plus a reduction in what `generateStaticParams` pre-builds.

```tsx
// app/products/[id]/page.tsx
export const revalidate = 300 // regenerate any given product at most every 5 minutes

// Only pre-build the top sellers at build time; everything else
// renders on first request and gets cached from there (dynamicParams defaults to true).
export async function generateStaticParams() {
  const topSellers = await getTopSellingProductIds(500)
  return topSellers.map((id) => ({ id }))
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetch(`https://api.example.com/products/${params.id}`, {
    next: { revalidate: 300 },
  }).then((r) => r.json())

  return <ProductDetails product={product} />
}
```

This addresses both problems at once. Build time drops dramatically — instead of pre-rendering all 50,000 pages, the build only pre-renders the 500 highest-traffic products (covering the majority of actual visits), and the long tail renders on-demand on first visit, then gets cached like any other ISR page. Price/stock changes now surface automatically within the 5-minute revalidate window without needing a redeploy at all.

For cases where marketing needs a price change to appear *immediately* (a flash sale going live at a specific second), layer in on-demand revalidation: have the inventory system's webhook call a Route Handler that runs `revalidateTag('product-${id}')` (assuming the fetch was tagged accordingly) the moment a price changes, rather than waiting for the 5-minute window. That combination — a reasonable ISR baseline plus targeted on-demand invalidation for time-sensitive changes — is the standard pattern for large, frequently-updated catalogs.
