import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'

interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  release_date: string;
  image_url: string;
}

export default function Movies() {
  const [movies, setMovies] = useState<Movie[]>([])

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/movies`)
        setMovies(response.data)
      } catch (error) {
        console.error('Error fetching movies:', error)
      }
    }

    fetchMovies()
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">All Movies</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <Link key={movie.id} href={`/movies/${movie.id}`}>
            <a className="block bg-white shadow-md rounded-lg overflow-hidden">
              <img src={movie.image_url || "/placeholder.svg"} alt={movie.title} className="w-full h-64 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                <p className="text-gray-600 mb-2">{movie.description.substring(0, 100)}...</p>
                <p className="text-sm text-gray-500">Duration: {movie.duration} minutes</p>
                <p className="text-sm text-gray-500">Release Date: {new Date(movie.release_date).toLocaleDateString()}</p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  )
}

