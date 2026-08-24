// BEFORE: entire page marked "use client" just for one search input
// app/catalog/page.tsx
'use client'
import { useState } from 'react'

export default function CatalogPage({ items }: { items: { id: string; name: string }[] }) {
  const [query, setQuery] = useState('')
  const filtered = items.filter((i) => i.name.includes(query))

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>{filtered.map((i) => <li key={i.id}>{i.name}</li>)}</ul>
    </div>
  )
}

// ----------------------------------------------------------------------

// AFTER: page stays a Server Component, only the search box is client-side
// app/catalog/page.tsx
import { SearchBox } from './SearchBox'

export default async function CatalogPage() {
  const items = await getItems() // now fetched directly on the server
  return (
    <div>
      <SearchBox items={items} />
    </div>
  )
}

// app/catalog/SearchBox.tsx
;('use client')
import { useState } from 'react'

export function SearchBox({ items }: { items: { id: string; name: string }[] }) {
  const [query, setQuery] = useState('')
  const filtered = items.filter((i) => i.name.includes(query))

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>{filtered.map((i) => <li key={i.id}>{i.name}</li>)}</ul>
    </div>
  )
}
