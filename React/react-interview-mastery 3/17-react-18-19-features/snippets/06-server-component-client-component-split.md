# A Minimal Server Component + Client Component Split (Framework-Dependent Syntax)

```jsx
// ProductPage.jsx — Server Component (no directive = server by default in an RSC framework)
async function ProductPage({ id }) {
  const product = await db.products.findById(id); // direct server-side data access
  return (
    <div>
      <h1>{product.name}</h1>
      <AddToCartButton productId={product.id} />
    </div>
  );
}

// AddToCartButton.jsx — Client Component (needs interactivity)
"use client";
function AddToCartButton({ productId }) {
  const [added, setAdded] = useState(false);
  return (
    <button onClick={() => setAdded(true)}>
      {added ? "Added!" : "Add to cart"}
    </button>
  );
}
```
