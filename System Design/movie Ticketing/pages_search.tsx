import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

interface Event {
  id: number;
  title: string;
  type: string;
  date: string;
  venue: string;
}

export default function Search() {
  const [searchResults, setSearchResults] = useState<Event[]>([])
  const [filters, setFilters] = useState({
    date: '',
    type: '',
    venue: '',
  })
  const router = useRouter()
  const { q, category } = router.query

  useEffect(() => {
    // In a real application, you would fetch search results from an API
    const fetchSearchResults = async () => {
      // Simulating API call
      const results: Event[] = [
        { id: 1, title: 'Movie 1', type: 'Movie', date: '2023-06-15', venue: 'Cinema A' },
        { id: 2, title: 'Concert 1', type: 'Concert', date: '2023-06-20', venue: 'Stadium B' },
        { id: 3, title: 'Play 1', type: 'Theater', date: '2023-06-25', venue: 'Theater C' },
      ]
      setSearchResults(results)
    }

    if (q || category) {
      fetchSearchResults()
    }
  }, [q, category])

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }))
  }

  const filteredResults = searchResults.filter((event) => {
    return (
      (!filters.date || event.date === filters.date) &&
      (!filters.type || event.type === filters.type) &&
      (!filters.venue || event.venue === filters.venue)
    )
  })

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Search Results</h1>
      <div className="mb-4 flex space-x-4">
        <select
          name="date"
          value={filters.date}
          onChange={handleFilterChange}
          className="border rounded p-2"
        >
          <option value="">All Dates</option>
          <option value="2023-06-15">June 15, 2023</option>
          <option value="2023-06-20">June 20, 2023</option>
          <option value="2023-06-25">June 25, 2023</option>
        </select>
        <select
          name="type"
          value={filters.type}
          onChange={handleFilterChange}
          className="border rounded p-2"
        >
          <option value="">All Types</option>
          <option value="Movie">Movie</option>
          <option value="Concert">Concert</option>
          <option value="Theater">Theater</option>
        </select>
        <select
          name="venue"
          value={filters.venue}
          onChange={handleFilterChange}
          className="border rounded p-2"
        >
          <option value="">All Venues</option>
          <option value="Cinema A">Cinema A</option>
          <option value="Stadium B">Stadium B</option>
          <option value="Theater C">Theater C</option>
        </select>
      </div>
      <ul className="space-y-4">
        {filteredResults.map((event) => (
          <li key={event.id} className="border p-4 rounded">
            <Link href={`/event/${event.id}`}>
              <a>
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-sm text-gray-600">{event.type} | {event.date} | {event.venue}</p>
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

