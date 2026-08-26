// app/products/page.tsx
// Server Component: direct database access, no API route needed,
// no directive, and no JS shipped for this component's own logic.
import { db } from '@/lib/db'

export default async function ProductsPage() {
  const products = await db.product.findMany({ take: 20 })

  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          {product.name} — ${product.price.toFixed(2)}
        </li>
      ))}
    </ul>
  )
}
