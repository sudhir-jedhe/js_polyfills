// app/orders/page.tsx
// Direct async/await data fetching, no useEffect/getServerSideProps needed.

export default async function OrdersPage() {
  const res = await fetch('https://api.example.com/orders')
  const orders: { id: string; total: number }[] = await res.json()

  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>Order {order.id}: ${order.total.toFixed(2)}</li>
      ))}
    </ul>
  )
}
