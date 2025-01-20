import ProductGrid from "@/components/ProductGrid"

export default function ProductListing() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Listing</h1>
      <ProductGrid />
    </div>
  )
}

