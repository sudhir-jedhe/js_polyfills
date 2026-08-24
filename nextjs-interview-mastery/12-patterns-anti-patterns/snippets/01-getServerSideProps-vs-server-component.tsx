// Side-by-side: Pages Router getServerSideProps vs. App Router Server Component.

// ============ Pages Router: pages/orders/[id].tsx ============
export async function getServerSideProps({ params }: { params: { id: string } }) {
  const order = await fetch(`https://api.example.com/orders/${params.id}`).then((r) =>
    r.json()
  );
  if (!order) {
    return { notFound: true };
  }
  return { props: { order } };
}

export default function OrderPage({ order }: { order: { id: string; total: number } }) {
  return <div>Order #{order.id}: ${order.total}</div>;
}

// ============ App Router: app/orders/[id]/page.tsx ============
import { notFound } from 'next/navigation';

export default async function OrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await fetch(`https://api.example.com/orders/${id}`, {
    cache: 'no-store', // getServerSideProps-equivalent: fresh on every request
  }).then((r) => r.json());

  if (!order) {
    notFound();
  }

  return <div>Order #{order.id}: ${order.total}</div>;
}
