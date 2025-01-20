import React from 'react'
import Link from 'next/link'

const UpcomingEvents: React.FC = () => {
  const upcomingEvents = [
    { id: 1, title: 'Upcoming Movie 1', date: '2023-06-15' },
    { id: 2, title: 'Upcoming Concert 1', date: '2023-06-20' },
    { id: 3, title: 'Upcoming Play 1', date: '2023-06-25' },
  ]

  return (
    <section>
      <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
      <ul className="space-y-2">
        {upcomingEvents.map((event) => (
          <li key={event.id}>
            <Link href={`/event/${event.id}`}>
              <a className="block bg-gray-100 p-4 rounded hover:bg-gray-200">
                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600">{event.date}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default UpcomingEvents

