// app/status/page.tsx
// Explicitly forcing dynamic rendering via route segment config,
// even though nothing here calls cookies()/headers().

export const dynamic = 'force-dynamic'

async function getLiveStatus() {
  const res = await fetch('https://status.example.com/api/current')
  return res.json()
}

export default async function StatusPage() {
  const status = await getLiveStatus()

  return (
    <div>
      <h1>System Status</h1>
      <p>{status.ok ? 'All systems operational' : 'Degraded performance'}</p>
      <small>Checked at {new Date().toISOString()}</small>
    </div>
  )
}
