'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Card, { CardContent, CardFooter, CardHeader } from '@/components/Card'

export default function CheckoutPage() {
  const [address, setAddress] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const { user } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would send this data to your backend for processing
    console.log('Processing payment and creating order...')
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    // Redirect to order confirmation page
    router.push('/order-confirmation')
  }

  if (!user) {
    router.push('/login')
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>
        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold">Delivery Address</h2>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your full address"
                required
              />
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold">Payment Information</h2>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="Card number"
                required
              />
              <div className="flex space-x-4">
                <Input
                  type="text"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  placeholder="MM/YY"
                  required
                />
                <Input
                  type="text"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="CVV"
                  required
                />
              </div>
            </CardContent>
          </Card>
          <CardFooter>
            <Button type="submit" className="w-full">Place Order</Button>
          </CardFooter>
        </form>
      </main>
      <Footer />
    </div>
  )
}

