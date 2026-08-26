// app/pricing-demo/page.tsx
// Side-by-side comparison of the three core fetch caching options.

export default async function PricingDemoPage() {
  // Cached indefinitely (Data Cache), enables static rendering
  const config = await fetch('https://api.example.com/pricing-config').then((r) => r.json())

  // Always fresh, forces this route dynamic
  const liveRate = await fetch('https://api.example.com/exchange-rate', {
    cache: 'no-store',
  }).then((r) => r.json())

  // Cached, but regenerated in the background after 300 seconds
  const plans = await fetch('https://api.example.com/plans', {
    next: { revalidate: 300 },
  }).then((r) => r.json())

  return (
    <div>
      <p>Base currency: {config.currency}</p>
      <p>Live rate: {liveRate.rate}</p>
      <ul>{plans.map((p: { id: string; name: string }) => <li key={p.id}>{p.name}</li>)}</ul>
    </div>
  )
}
