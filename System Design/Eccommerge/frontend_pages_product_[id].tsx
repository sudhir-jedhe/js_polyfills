import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
}

export default function ProductPage() {
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const router = useRouter()
  const { id } = router.query
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`)
          setProduct(response.data)
        } catch (error) {
          console.error('Error fetching product:', error)
        }
      }

      fetchProduct()
    }
  }, [id])

  const addToCart = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        productId: product?.id,
        quantity
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Product added to cart!')
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2">
          <img src={product.image_url || "/placeholder.svg"} alt={product.name} className="w-full h-auto" />
        </div>
        <div className="md:w-1/2 md:pl-8 mt-4 md:mt-0">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-xl mt-2">${product.price.toFixed(2)}</p>
          <p className="mt-4">{product.description}</p>
          <div className="mt-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <select
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={addToCart}
            className="mt-6 w-full bg-yellow-400 border border-yellow-500 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-900 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

