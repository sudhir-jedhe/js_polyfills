import Image from 'next/image'
import { useState } from 'react'
import Card, { CardContent, CardFooter } from '@/components/Card'
import Button from '@/components/Button'
import Input from '@/components/Input'

interface Restaurant {
  id: number
  name: string
  cuisine: string
  rating: number
  deliveryTime: string
  image: string
}

export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewText, setReviewText] = useState('')
  const [userRating, setUserRating] = useState(0)

  const handleSubmitReview = () => {
    // In a real app, you would send this data to your backend
    console.log('Submitting review:', { restaurantId: restaurant.id, rating: userRating, text: reviewText })
    setShowReviewForm(false)
    setReviewText('')
    setUserRating(0)
  }

  return (
    <Card className="overflow-hidden">
      <Image
        src={restaurant.image || "/placeholder.svg"}
        alt={restaurant.name}
        width={300}
        height={200}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
        <p className="text-gray-600 mb-2">{restaurant.cuisine}</p>
        <div className="flex items-center mb-2">
          <span className="text-yellow-400 mr-1">★</span>
          <span>{restaurant.rating}</span>
        </div>
        <div className="flex items-center">
          <span className="text-gray-400 mr-1">🕒</span>
          <span>{restaurant.deliveryTime}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col">
        <Button 
          className="w-full mb-2" 
          onClick={() => setShowReviewForm(!showReviewForm)}
        >
          {showReviewForm ? 'Cancel Review' : 'Write a Review'}
        </Button>
        {showReviewForm && (
          <div className="w-full space-y-2">
            <div className="flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`text-2xl ${
                    star <= userRating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setUserRating(star)}
                >
                  ★
                </button>
              ))}
            </div>
            <Input
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your review here..."
            />
            <Button onClick={handleSubmitReview}>Submit Review</Button>
          </div>
        )}
        <Button className="w-full" variant="outline">View Menu</Button>
      </CardFooter>
    </Card>
  )
}

