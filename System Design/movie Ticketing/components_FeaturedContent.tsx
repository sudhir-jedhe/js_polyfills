import React from 'react'
import Link from 'next/link'

const FeaturedContent: React.FC = () => {
  const featuredItems = [
    { id: 1, title: 'Featured Movie 1', image: '/placeholder.jpg' },
    { id: 2, title: 'Featured Event 1', image: '/placeholder.jpg' },
    { id: 3, title: 'Featured Movie 2', image: '/placeholder.jpg' },
  ]

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Featured Content</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {featuredItems.map((item) => (
          <Link key={item.id} href={`/event/${item.id}`}>
            <a className="block">
              <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-48 object-cover rounded" />
              <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
            </a>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default FeaturedContent

