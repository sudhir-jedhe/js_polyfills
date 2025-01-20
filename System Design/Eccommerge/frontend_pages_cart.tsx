import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'

interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setCartItems(response.data)
        calculateTotal(response.data)
      } catch (error) {
        console.error('Error fetching cart:', error)
      }
    }

    fetchCart()
  }, [isAuthenticated, router])

  const calculateTotal = (items: CartItem[]) => {
    const sum = items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    setTotal(sum)
  }

  const checkout = () => {
    router.push('/checkout')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b pb-4">
                <div>
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="text-lg">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <p className="text-2xl font-bold">Total: ${total.toFixed(2)}</p>
            <button
              onClick={checkout}
              className="mt-4 w-full bg-yellow-400 border border-yellow-500 rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-gray-900 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}

