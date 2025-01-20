import React from 'react'
import Link from 'next/link'

interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Link href={`/product/${product.id}`}>
      <a className="block">
        <div className="border rounded-lg overflow-hidden shadow-lg">
          <img src={product.image_url || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
          <div className="p-4">
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600">${product.price.toFixed(2)}</p>
          </div>
        </div>
      </a>
    </Link>
  )
}

export default ProductCard

