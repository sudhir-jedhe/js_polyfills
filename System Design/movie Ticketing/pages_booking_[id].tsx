import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

interface Seat {
  id: number;
  row: string;
  number: number;
  is_booked: boolean;
}

interface Showtime {
  id: number;
  movie_id: number;
  theater_id: number;
  date: string;
  time: string;
}

export default function Booking() {
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<number[]>([])
  const [showtime, setShowtime] = useState<Showtime | null>(null)
  const router = useRouter()
  const { id } = router.query
  const { user } = useAuth()

  useEffect(() => {
    const fetchSeatsAndShowtime = async () => {
      if (id) {
        try {
          const [seatsResponse, showtimeResponse] = await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/seats/${id}`),
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/showtimes/${id}`)
          ])
          setSeats(seatsResponse.data)
          setShowtime(showtimeResponse.data)
        } catch (error) {
          console.error('Error fetching seats and showtime:', error)
        }
      }
    }

    fetchSeatsAndShowtime()
  }, [id])

  const handleSeatSelect = (seatId: number) => {
    setSelectedSeats((prevSelectedSeats) =>
      prevSelectedSeats.includes(seatId)
        ? prevSelectedSeats.filter((id) => id !== seatId)
        : [...prevSelectedSeats, seatId]
    )
  }

  const handleBooking = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
        showtimeId: showtime?.id,
        seatIds: selectedSeats
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      router.push('/profile')
    } catch (error) {
      console.error('Error booking seats:', error)
      alert('Booking failed. Please try again.')
    }
  }

  if (!showtime) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Select Your Seats</h1>
      <p className="mb-4">
        <strong>Date:</strong> {new Date(showtime.date).toLocaleDateString()} - <strong>Time:</strong> {showtime.time}
      </p>
      <div className="grid grid-cols-10 gap-2 mb-6">
        {seats.map((seat) => (
          <button
            key={seat.id}
            onClick={() => handleSeatSelect(seat.id)}
            disabled={seat.is_booked}
            className={`p-2 text-center rounded ${
              seat.is_booked
                ? 'bg-gray-400 cursor-not-allowed'
                : selectedSeats.includes(seat.id)
                ? 'bg-green-500 text-white'
                : 'bg-blue-100 hover:bg-blue-200'
            }`}
          >
            {seat.row}{seat.number}
          </button>
        ))}
      </div>
      <div className="mb-6">
        <p><strong>Selected Seats:</strong> {selectedSeats.length}</p>
        <p><strong>Total Price:</strong> ${(selectedSeats.length * 10).toFixed(2)}</p>
      </div>
      <button
        onClick={handleBooking}
        disabled={selectedSeats.length === 0}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Book Now
      </button>
    </div>
  )
}

