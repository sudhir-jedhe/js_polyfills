// app/products/[id]/page.tsx
// ISR: statically generated, then regenerated in the background
// at most once every 60 seconds per unique product id.

export const revalidate = 60

export default async function ProductPage({ params }: { params: { id: string } }) {
  const res = await fetch(`https://api.example.com/products/${params.id}`, {
    next: { revalidate: 60 }, // equivalent, fetch-level override
  })
  const product = await res.json()

  return (
    <div>
      <h1>{product.name}</h1>
      <p>${product.price}</p>
      <p>In stock: {product.stock}</p>
    </div>
  )
}
