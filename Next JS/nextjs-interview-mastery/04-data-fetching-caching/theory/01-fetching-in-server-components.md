# Fetching Data Directly in Server Components

The App Router collapses data fetching into the component itself: a Server Component can be an `async function` that `await`s whatever it needs and returns JSX, with no separate exported function required. This replaces both the Pages Router's `getServerSideProps`/`getStaticProps` and the classic client-side pattern of `useEffect` + `useState` + a loading flag.

```tsx
// app/orders/page.tsx
export default async function OrdersPage() {
  const res = await fetch('https://api.example.com/orders')
  const orders = await res.json()

  return (
    <ul>
      {orders.map((o: { id: string; total: number }) => (
        <li key={o.id}>Order {o.id}: ${o.total}</li>
      ))}
    </ul>
  )
}
```

Compare this to the `useEffect` pattern it replaces:

```tsx
// The old client-side way — no longer necessary for this use case
'use client'
function OrdersPage() {
  const [orders, setOrders] = useState(null)
  useEffect(() => {
    fetch('/api/orders').then((r) => r.json()).then(setOrders)
  }, [])
  if (!orders) return <p>Loading…</p>
  return <ul>{/* ... */}</ul>
}
```

The Server Component version is strictly better for this scenario: no loading spinner state to manage, no client-side JS for the fetch/state logic, no waterfall where the browser has to first receive an empty shell before even starting the data request (the server starts fetching immediately as part of rendering, often before any HTML has been sent at all), and no separate `/api/orders` route needed purely to expose data a Server Component could just fetch/query directly.

You're not limited to `fetch()` either — any async data source works: an ORM query (`db.order.findMany()`), a GraphQL client call, reading a file from disk, calling an internal gRPC service. The `fetch()` API specifically gets special treatment from Next.js — an extended caching layer discussed in the next theory file — but the "just `await` it in the component" pattern applies universally.

Multiple Server Components on the same page can each do their own independent data fetching — you don't need to lift everything into one top-level `getServerSideProps`-style function and prop-drill it down. This composes naturally with React Suspense: if one Server Component's fetch is slow, wrapping it in `<Suspense>` (or relying on the route's `loading.js`) lets the rest of the page stream in without waiting on it. Sequential `await`s within a single component do create a waterfall, though — if `Page` awaits `getUser()` and then awaits `getOrders(user.id)`, those two requests are inherently sequential because the second depends on the first's result; independent fetches that don't depend on each other should generally be kicked off together with `Promise.all` to avoid an unnecessary waterfall.
