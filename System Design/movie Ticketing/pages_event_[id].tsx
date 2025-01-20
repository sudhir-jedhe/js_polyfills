import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface Event {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  price: number;
}

export default function EventDetails() {
  const [event, setEvent] = useState<Event | null>(null)
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    // In a real application, you would fetch event details from an API
    const fetchEventDetails = async () => {
      // Simulating API call
      const eventData: Event = {
        id: Number(id),
        title: 'Sample Event',
        type: 'Movie',
        date: '2023-06-15',
        time: '19:00',
        venue: 'Cinema A',
        description: 'This is a sample event description.',
        price: 15.99,
      }
      setEvent(eventData)
    }

    if (id) {
      fetchEventDetails()
    }
  }, [id])

  if (!event) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src="/placeholder.jpg" alt={event.title} className="w-full h-auto rounded" />
        </div>
        <div>
          <p className="text-xl mb-2">{event.type}</p>
          <p className="mb-2">Date: {event.date}</p>
          <p className="mb-2">Time: {event.time}</p>
          <p className="mb-2">Venue: {event.venue}</p>
          <p className="mb-4">{event.description}</p>
          <p className="text-2xl font-bold mb-4">Price: ${event.price.toFixed(2)}</p>
          <Link href={`/booking/${event.id}`}>
            <a className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Book Now
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

