// app/market/page.tsx — server-rendered shell (static/ISR)
import { LiveTicker } from './LiveTicker'

export const revalidate = 3600 // shell content changes rarely

export default async function MarketPage() {
  const marketSummary = await fetch('https://api.example.com/market/summary').then((r) => r.json())

  return (
    <div>
      <h1>Market Overview</h1>
      <p>{marketSummary.description}</p>
      {/* CSR island: needs live, per-second data that server rendering can't provide */}
      <LiveTicker symbol="ACME" />
    </div>
  )
}

// app/market/LiveTicker.tsx
;('use client')

import { useEffect, useState } from 'react'

export function LiveTicker({ symbol }: { symbol: string }) {
  const [price, setPrice] = useState<number | null>(null)

  useEffect(() => {
    const id = setInterval(async () => {
      const res = await fetch(`/api/prices/${symbol}`)
      const data = await res.json()
      setPrice(data.price)
    }, 1000)
    return () => clearInterval(id)
  }, [symbol])

  return <span>{symbol}: {price ? `$${price.toFixed(2)}` : 'loading…'}</span>
}
