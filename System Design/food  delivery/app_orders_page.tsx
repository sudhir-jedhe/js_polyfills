'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Card, { CardContent, CardHeader } from '@/components/Card'

interface Order {
  id: string
  restaurantName: string
  items: { name: string; quantity: number }[]
  total: number
  status: 'pending' | 'preparing' | 'on the way' | 'delivered'
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const { user } = useAuth()

  useEffect(() => {
    // In a real app, you would fetch orders from your API
    const fetchOrders = async () => {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setOrders([
        {
          id: '1',
          restaurantName: 'Burger Palace',
          items: [
            { name: 'Classic Burger', quantity: 2 },
            { name: 'Fries', quantity: 1 },
          ],
          total: 24.97,
          status: 'on the way',
          createdAt: '2023-05-01T12:00:00Z',
        },
        {
          id: '2',
          restaurantName: 'Pizza Heaven',
          items: [
            { name: 'Margherita Pizza', quantity: 1 },
            { name: 'Garlic Bread', quantity: 1 },
          ],
          total: 18.99,
          status: 'delivered',
          createdAt: '2023-04-28T18:30:00Z',
        },
      ])
    }

    if (user) {
      fetchOrders()
    }
  }, [user])

  if (!user) {
    return <div>Please log in to view your orders.</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Your Orders</h1>
        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <h2 className="text-xl font-semibold">{order.restaurantName}</h2>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Order #{order.id}</p>
                <p>Status: {order.status}</p>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <ul className="mt-2">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      {item.name} x {item.quantity}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 font-semibold">Total: ${order.total.toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}

