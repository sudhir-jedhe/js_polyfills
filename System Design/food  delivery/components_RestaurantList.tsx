import RestaurantCard from '@/components/RestaurantCard'

interface Restaurant {
  id: number
  name: string
  cuisine: string
  rating: number
  deliveryTime: string
  image: string
}

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "Burger Palace",
    cuisine: "American",
    rating: 4.5,
    deliveryTime: "30-45 min",
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    id: 2,
    name: "Pasta Paradise",
    cuisine: "Italian",
    rating: 4.7,
    deliveryTime: "40-55 min",
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    id: 3,
    name: "Sushi Sensation",
    cuisine: "Japanese",
    rating: 4.8,
    deliveryTime: "35-50 min",
    image: "/placeholder.svg?height=200&width=300"
  },
  {
    id: 4,
    name: "Taco Town",
    cuisine: "Mexican",
    rating: 4.6,
    deliveryTime: "25-40 min",
    image: "/placeholder.svg?height=200&width=300"
  },
]

interface RestaurantListProps {
  searchTerm: string
  cuisineFilter: string
}

export default function RestaurantList({ searchTerm, cuisineFilter }: RestaurantListProps) {
  const filteredRestaurants = restaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          restaurant.cuisine.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCuisine = cuisineFilter === '' || restaurant.cuisine.toLowerCase() === cuisineFilter.toLowerCase()
    return matchesSearch && matchesCuisine
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {filteredRestaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  )
}

