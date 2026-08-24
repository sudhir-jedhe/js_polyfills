# Migrating a Page to Server Components, but a Component Needs Both DB Access and a Click Handler

You're converting a product page to use React Server Components for performance. The page needs to read directly from the database, but also has an "Add to Wishlist" button that needs `onClick` and local state.

**Approach:** Split the concerns: keep the page itself a Server Component that fetches data directly, and extract the interactive button into its own file marked `"use client"`, passing down only the plain-data props it needs (not functions or non-serializable values from the server).

```jsx
// ProductPage.jsx (Server Component, default in an RSC framework)
async function ProductPage({ id }) {
  const product = await db.products.findById(id);
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <WishlistButton productId={product.id} />
    </div>
  );
}

// WishlistButton.jsx (Client Component)
"use client";
function WishlistButton({ productId }) {
  const [added, setAdded] = useState(false);

  async function handleClick() {
    setAdded(true);
    await fetch(`/api/wishlist`, {
      method: "POST",
      body: JSON.stringify({ productId }),
    });
  }

  return <button onClick={handleClick}>{added ? "Saved" : "Save to wishlist"}</button>;
}
```

Only `WishlistButton`'s JS ships to the client; the rest of the page's markup arrives pre-rendered from the server with no extra client-side bundle for the static content.
