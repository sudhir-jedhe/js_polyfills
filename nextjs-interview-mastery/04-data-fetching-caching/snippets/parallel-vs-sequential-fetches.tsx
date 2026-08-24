// app/profile/[id]/page.tsx
// Avoiding an unnecessary waterfall: kick off independent fetches together.

// BAD: sequential waterfall — getOrders waits for getUser to fully resolve
// even though it doesn't actually need the user data, just the id (already known).
async function badVersion(userId: string) {
  const user = await fetch(`https://api.example.com/users/${userId}`).then((r) => r.json())
  const orders = await fetch(`https://api.example.com/orders?userId=${userId}`).then((r) => r.json())
  return { user, orders }
}

// GOOD: both requests start at the same time, total wait = the slower of the two
async function goodVersion(userId: string) {
  const [user, orders] = await Promise.all([
    fetch(`https://api.example.com/users/${userId}`).then((r) => r.json()),
    fetch(`https://api.example.com/orders?userId=${userId}`).then((r) => r.json()),
  ])
  return { user, orders }
}

export default async function ProfilePage({ params }: { params: { id: string } }) {
  const { user, orders } = await goodVersion(params.id)

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{orders.length} orders</p>
    </div>
  )
}
