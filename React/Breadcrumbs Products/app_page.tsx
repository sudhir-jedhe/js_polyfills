import TrendingProducts from "@/components/TrendingProducts"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Home Page</h1>
      <h2 className="text-xl font-semibold mb-4">Trending Products 🔥</h2>
      <TrendingProducts />
      <Link href="/products" className="block mt-6">
        <Button className="w-full">View All Products</Button>
      </Link>
    </div>
  )
}

