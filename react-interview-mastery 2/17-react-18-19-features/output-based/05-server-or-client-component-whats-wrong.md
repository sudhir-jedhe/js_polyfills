# Is This a Server Component or Client Component, and What's Wrong with It?

```jsx
"use client";

async function ProductDetails({ id }) {
  const product = await db.products.findById(id);
  return <h1>{product.name}</h1>;
}
```

**Answer:** This is invalid — it's marked `"use client"` but is written as an `async` Server-Component-style function directly querying the database, which Client Components cannot do.

**Why:** `"use client"` opts a component into client-side rendering, where you don't have direct server-side resources like a database connection available, and client components (as of the current RSC model) aren't rendered as `async` functions the way Server Components can be. Direct data access with `await db...` belongs in a Server Component (no `"use client"` directive); a Client Component would instead receive `product` as a prop or fetch it client-side.
