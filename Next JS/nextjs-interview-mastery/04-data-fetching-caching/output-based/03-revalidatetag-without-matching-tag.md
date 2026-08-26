# Output: Does `revalidateTag` Do Anything Here?

```tsx
// app/products/page.tsx
async function getProducts() {
  const res = await fetch('https://api.example.com/products', {
    next: { tags: ['catalog'] },
  })
  return res.json()
}

export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductGrid products={products} />
}

// app/actions/update-product.ts
'use server'
import { revalidateTag } from 'next/cache'

export async function updateProduct(id: string, data: FormData) {
  await fetch(`https://api.example.com/products/${id}`, { method: 'PATCH', body: data })
  revalidateTag('products') // note: NOT 'catalog'
}
```

A product is updated via `updateProduct`, which calls `revalidateTag('products')`. Does the `/products` page show the updated data on the next visit?

**Answer:** No — the tags don't match, so nothing is invalidated. `revalidateTag('products')` has no effect on the fetch tagged `'catalog'`, and `/products` keeps serving the previously cached (pre-update) data until its `revalidate` window (if any) naturally expires, or until someone calls `revalidateTag('catalog')` correctly.

**Why:** Tag-based revalidation is a pure string match — `revalidateTag(tag)` invalidates Data Cache entries tagged with exactly that string, with no fuzzy matching, pluralization awareness, or relationship inference. The fetch in `getProducts` was tagged `'catalog'`, but the Server Action calls `revalidateTag('products')` — a plausible-sounding but different string. This is a genuinely common real-world bug: as an app grows, fetches for related data get tagged inconsistently by different developers (or the same developer at different times), and revalidation calls silently no-op because the tag doesn't exist or doesn't match anything currently cached. The fix is purely a naming consistency issue — either change the fetch's tag to `'products'` or change the revalidation call to `revalidateTag('catalog')`; ideally, tag names are defined as a shared constant (e.g., `export const PRODUCTS_TAG = 'products'`) imported everywhere they're needed, specifically to prevent this class of typo-driven bug.
