'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Card, { CardContent, CardHeader } from '@/components/Card'

interface MenuItem {
  id: number
  name: string
  price: number
}

interface Order {
  id: number
  customerName: string
  items: { name: string; quantity: number }[]
  total: number
  status: 'pending' | 'preparing' | 'on the way' | 'delivered'
}

export default function RestaurantDashboard() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [newItemName, setNewItemName] = useState('')
  const [newItemPrice, setNewItemPrice] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    setMenuItems([
      { id: 1, name: 'Burger', price: 9.99 },
      { id: 2, name: 'Fries', price: 3.99 },
      { id: 3, name: 'Soda', price: 1.99 },
    ])
    setOrders([
      {
        id: 1,
        customerName: 'John Doe',
        items: [{ name: 'Burger', quantity: 2 }, { name: 'Fries', quantity: 1 }],
        total: 23.97,
        status: 'pending',
      },
      {
        id: 2,
        customerName: 'Jane Smith',
        items: [{ name: 'Soda', quantity: 1 }],
        total: 1.99,
        status: 'preparing',
      },
    ])
  }, [])

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault()
    const newItem = {
      id: menuItems.length + 1,
      name: newItemName,
      price: parseFloat(newItemPrice),
    }
    setMenuItems([...menuItems, newItem])
    setNewItemName('')
    setNewItemPrice('')
  }

  const handleUpdateOrderStatus = (orderId: number, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ))
  }

  if (!user || user.role !== 'restaurant_owner') {
    return <div>Access denied. This page is for restaurant owners only.</div>
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Restaurant Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Menu Management</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddMenuItem} className="mb-4 space-y-4">
                <Input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Item name"
                  required
                />
                <Input
                  type="number"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  placeholder="Price"
                  step="0.01"
                  required
                />
                <Button type="submit">Add Item</Button>
              </form>
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.id} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <span>${item.price.toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Order Management</h2>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {orders.map((order) => (
                  <li key={order.id} className="border-b pb-4">
                    <p><strong>Order #{order.id}</strong> - {order.customerName}</p>
                    <ul className="ml-4">
                      {order.items.map((item, index) => (
                        <li key={index}>{item.name} x {item.quantity}</li>
                      ))}
                    </ul>
                    <p>Total: ${order.total.toFixed(2)}</p>
                    <p>Status: {order.status}</p>
                    <div className="mt-2 space-x-2">
                      <Button onClick={() => handleUpdateOrderStatus(order.id, 'preparing')} size="small">Prepare</Button>
                      <Button onClick={() => handleUpdateOrderStatus(order.id, 'on the way')} size="small">Send</Button>
                      <Button onClick={() => handleUpdateOrderStatus(order.id, 'delivered')} size="small">Delivered</Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

