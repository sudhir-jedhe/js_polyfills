# Output: How Many Actual Network Calls?

```tsx
// lib/get-product.ts
export async function getProduct(id: string) {
  const res = await fetch(`https://api.example.com/products/${id}`)
  return res.json()
}

// app/products/[id]/page.tsx
import { getProduct } from '@/lib/get-product'
import { ProductReviews } from './ProductReviews'
import { RelatedProducts } from './RelatedProducts'

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id) // call site A
  return (
    <div>
      <h1>{product.name}</h1>
      <ProductReviews id={params.id} />
      <RelatedProducts id={params.id} />
    </div>
  )
}

// app/products/[id]/ProductReviews.tsx
import { getProduct } from '@/lib/get-product'
export async function ProductReviews({ id }: { id: string }) {
  const product = await getProduct(id) // call site B — same URL, same options
  return <p>{product.reviewCount} reviews</p>
}

// app/products/[id]/RelatedProducts.tsx
import { getProduct } from '@/lib/get-product'
export async function RelatedProducts({ id }: { id: string }) {
  const product = await getProduct(id) // call site C — same URL, same options
  return <p>Related to {product.name}</p>
}
```

For a single request to `/products/42`, how many actual network requests hit `https://api.example.com/products/42`?

**Answer:** Exactly one.

**Why:** All three call sites invoke `getProduct('42')`, which resolves to identical `fetch()` calls — same URL, same (default/unspecified) options — during the same server render pass for this one request. React's Request Memoization deduplicates identical `fetch()` calls within a single render: the first call actually hits the network, and the second and third reuse that same in-flight/resolved promise rather than issuing new requests. This is distinct from the Data Cache (which would also make the *next request*, from a different user, reuse the cached result) — Request Memoization specifically explains why *this one request*, despite calling `getProduct` from three different components, only produces one network call. If any of the three calls used different options (e.g., one added `cache: 'no-store'`), memoization would not apply to that call, since it's no longer an identical `fetch()` invocation.
