import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

interface Booking {
  id: number;
  title: string;
  date: string;
  time: string;
  row: string;
  number: number;
}

export default function Profile() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const { user } = useAuth()

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setBookings(response.data)
      } catch (error) {
        console.error('Error fetching bookings:', error)
      }
    }

    if (user) {
      fetchBookings()
    }
  }, [user])

  if (!user) {
    return <div>Please log in to view your profile.</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">User Information</h2>
        <p><strong>Username:</strong> {user.username}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">My Bookings</h2>
        {bookings.length > 0 ? (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li key={booking.id} className="bg-white shadow rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">{booking.title}</h3>
                <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                <p><strong>Seat:</strong> Row {booking.row}, Number {booking.number}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have no bookings yet.</p>
        )}
      </div>
    </div>
  )
}

