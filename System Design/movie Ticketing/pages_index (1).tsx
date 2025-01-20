import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

interface Movie {
  id: number;
  title: string;
  image_url: string;
}

export default function Home() {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([])

  useEffect(() => {
    const fetchFeaturedMovies = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/movies`)
        setFeaturedMovies(response.data.slice(0, 3)) // Get first 3 movies as featured
      } catch (error) {
        console.error('Error fetching featured movies:', error)
      }
    }

    fetchFeaturedMovies()
  }, [])

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Welcome to MovieBooker</h1>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Featured Movies</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredMovies.map((movie) => (
            <Link key={movie.id} href={`/movies/${movie.id}`}>
              <a className="block">
                <img src={movie.image_url || "/placeholder.svg"} alt={movie.title} className="w-full h-64 object-cover rounded-lg shadow-md" />
                <h3 className="mt-2 text-xl font-semibold">{movie.title}</h3>
              </a>
            </Link>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-bold mb-4">Quick Links</h2>
        <div className="flex space-x-4">
          <Link href="/movies">
            <a className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Browse All Movies</a>
          </Link>
          <Link href="/profile">
            <a className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">My Bookings</a>
          </Link>
        </div>
      </section>
    </div>
  )
}

