import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'

interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  release_date: string;
  image_url: string;
}

interface Showtime {
  id: number;
  date: string;
  time: string;
}

export default function MovieDetails() {
  const [movie, setMovie] = useState<Movie | null>(null)
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    const fetchMovieAndShowtimes = async () => {
      if (id) {
        try {
          const [movieResponse, showtimesResponse] = await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/movies/${id}`),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/showtimes/${id}`)
          ])
          setMovie(movieResponse.data)
          setShowtimes(showtimesResponse.data)
        } catch (error) {
          console.error('Error fetching movie details:', error)
        }
      }
    }

    fetchMovieAndShowtimes()
  }, [id])

  if (!movie) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="md:w-1/3">
        <img src={movie.image_url || "/placeholder.svg"} alt={movie.title} className="w-full rounded-lg shadow-md" />
      </div>
      <div className="md:w-2/3">
        <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
        <p className="text-gray-600 mb-4">{movie.description}</p>
        <p className="mb-2"><strong>Duration:</strong> {movie.duration} minutes</p>
        <p className="mb-4"><strong>Release Date:</strong> {new Date(movie.release_date).toLocaleDateString()}</p>
        <h2 className="text-2xl font-bold mb-4">Showtimes</h2>
        {showtimes.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {showtimes.map((showtime) => (
              <Link key={showtime.id} href={`/booking/${showtime.id}`}>
                <a className="block text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
                  {new Date(showtime.date).toLocaleDateString()} - {showtime.time}
                </a>
              </Link>
            ))}
          </div>
        ) : (
          <p>No showtimes available for this movie.</p>
        )}
      </div>
    </div>
  )
}

