import ProductDetails from "@/components/ProductDetails"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Detail Page</h1>
      <ProductDetails id={params.id} />
    </div>
  )
}

