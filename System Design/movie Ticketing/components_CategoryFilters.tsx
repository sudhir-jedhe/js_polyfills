import React from 'react'
import Link from 'next/link'

const CategoryFilters: React.FC = () => {
  const categories = ['Movies', 'Concerts', 'Theater', 'Sports']

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <div className="flex space-x-4">
        {categories.map((category) => (
          <Link key={category} href={`/search?category=${encodeURIComponent(category)}`}>
            <a className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">{category}</a>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CategoryFilters

