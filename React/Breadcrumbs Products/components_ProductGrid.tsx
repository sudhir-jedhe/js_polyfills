"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface Product {
  id: number
  title: string
  thumbnail: string
}

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("https://dummyjson.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.products)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return <div>Loading products...</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <Card key={product.id}>
          <CardContent className="p-4">
            <Link href={`/products/${product.id}`}>
              <div className="relative h-48 mb-2">
                <Image
                  src={product.thumbnail || "/placeholder.svg"}
                  alt={product.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
              </div>
              <h3 className="text-lg font-semibold">{product.title}</h3>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

