'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import Input from '@/components/Input'
import { useState } from 'react'
import Card, { CardContent } from '@/components/Card'
import RestaurantList from '@/components/RestaurantList'

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [cuisineFilter, setCuisineFilter] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would trigger a search here
    console.log('Searching for:', searchTerm)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Discover Restaurants Near You</h1>
        <form onSubmit={handleSearch} className="mb-8 flex gap-4">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search restaurants or cuisines"
            className="flex-grow"
          />
          <Button type="submit">Search</Button>
        </form>
        <Card className="mb-8">
          <CardContent>
            <label htmlFor="cuisine-filter" className="block mb-2 font-semibold">Filter by Cuisine:</label>
            <select
              id="cuisine-filter"
              value={cuisineFilter}
              onChange={(e) => setCuisineFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Cuisines</option>
              <option value="italian">Italian</option>
              <option value="japanese">Japanese</option>
              <option value="mexican">Mexican</option>
              <option value="indian">Indian</option>
            </select>
          </CardContent>
        </Card>
        <RestaurantList searchTerm={searchTerm} cuisineFilter={cuisineFilter} />
      </main>
      <Footer />
    </div>
  )
}

