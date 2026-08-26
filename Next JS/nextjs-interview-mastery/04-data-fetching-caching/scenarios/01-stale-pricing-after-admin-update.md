# Scenario: Admin Updates a Price, Customers Still See the Old One

Your e-commerce app has a static-ish `/products/[id]` page using ISR with `revalidate = 3600` (1 hour). An admin updates a product's price through the internal admin panel, and support immediately gets tickets: "I bought this at the old price, the site was still showing $49 when the price should have changed to $59 an hour ago... wait, actually customers report seeing the OLD price up to an hour later even though the admin change was instant in the database." Product wants the fix to guarantee the new price shows within seconds of an admin edit, not up to an hour later.

**Approach:** This is precisely the gap between time-based revalidation and on-demand revalidation. `revalidate = 3600` only guarantees content is *at most* an hour stale — it says nothing about reacting to a specific known change instantly. The fix is adding tag-based on-demand revalidation to the admin update flow, without necessarily removing the 1-hour timer (which still serves as a safety net for any update path that doesn't explicitly trigger revalidation).

```tsx
// app/products/[id]/page.tsx
export const revalidate = 3600 // safety-net fallback, not the primary freshness mechanism now

async function getProduct(id: string) {
  const res = await fetch(`https://api.example.com/products/${id}`, {
    next: { revalidate: 3600, tags: [`product-${id}`] },
  })
  return res.json()
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id)
  return <ProductDetails product={product} />
}
```

```tsx
// app/admin/actions/update-price.ts
'use server'
import { db } from '@/lib/db'
import { revalidateTag } from 'next/cache'

export async function updatePrice(productId: string, newPrice: number) {
  await db.product.update({ where: { id: productId }, data: { price: newPrice } })
  revalidateTag(`product-${productId}`) // bypasses the 1-hour window entirely
}
```

After this change, the moment an admin saves a price change, `revalidateTag` invalidates that specific product's cached fetch, and the very next customer request to `/products/[id]` regenerates the page with the new price — no waiting for the hour to elapse. The `revalidate = 3600` fallback still protects against any other, less-obvious code path that might change the underlying data without going through `updatePrice` (e.g., a batch import script) — worth flagging to the team that those paths should ideally also call `revalidateTag` for consistency, and the 3600-second timer is really a backstop, not the primary freshness guarantee, going forward.
