# Problem 1: Convert a Pages Router page to an App Router Server Component

## Task

Convert the following Pages Router page to an equivalent App Router Server Component, preserving identical behavior.

```tsx
// pages/orders/[id].tsx
export async function getServerSideProps(context) {
  const { id } = context.params;
  const authHeader = context.req.headers.authorization;

  const res = await fetch(`https://api.example.com/orders/${id}`, {
    headers: { Authorization: authHeader ?? '' },
  });

  if (res.status === 404) {
    return { notFound: true };
  }
  if (res.status === 401) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const order = await res.json();
  return { props: { order } };
}

export default function OrderPage({ order }) {
  return (
    <div>
      <h1>Order #{order.id}</h1>
      <p>Status: {order.status}</p>
      <p>Total: ${order.total}</p>
    </div>
  );
}
```

## Requirements

1. Implement `app/orders/[id]/page.tsx` as an `async` Server Component.
2. Read the dynamic segment via `params` (typed as a `Promise`, Next.js 15 convention).
3. Reproduce the 404 behavior using `notFound()` from `next/navigation`.
4. Reproduce the redirect behavior using `redirect()` from `next/navigation`.
5. Reproduce the "always fresh, per-request" caching behavior of `getServerSideProps` using the correct `fetch` option.
6. Read the incoming request's `Authorization` header using the correct App Router API (not `context.req`, which doesn't exist in this model).

## Self-check

- Does the converted page use `headers()` from `next/headers` (awaited) instead of `context.req.headers`?
- Are both `notFound()` and `redirect()` called directly in the component body, not returned as part of an object?
- Is the `fetch` call explicitly configured to never cache (matching `getServerSideProps`'s always-fresh behavior)?
