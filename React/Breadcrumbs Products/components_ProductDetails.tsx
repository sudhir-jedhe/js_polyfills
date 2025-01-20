"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface Product {
  id: number
  title: string
  thumbnail: string
  price: number
  description: string
}

export default function ProductDetails({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data)
        setIsLoading(false)
      })
  }, [id])

  if (isLoading) {
    return <div>Loading product details...</div>
  }

  if (!product) {
    return <div>Product not found</div>
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2">
        <div className="relative h-96">
          <Image
            src={product.thumbnail || "/placeholder.svg"}
            alt={product.title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
      </div>
      <div className="md:w-1/2">
        <h2 className="text-2xl font-bold mb-2">{product.title}</h2>
        <p className="text-xl font-semibold mb-4">${product.price}</p>
        <p className="text-gray-600">{product.description}</p>
      </div>
    </div>
  )
}

