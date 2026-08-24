# Scenario: A "Favorite" Button Causes the Entire Parent List to Re-Render

You're building a product grid where each `ProductCard` has a favorite toggle. Clicking favorite on one card visibly causes every other card to flash/re-render in the React DevTools profiler, even though only one item's data changed.

**Approach:** Likely culprits: the favorite-toggle handler is defined inline inside the `.map()` (new function per card per render), and/or the cards aren't wrapped in `React.memo` at all. Fix both:

```jsx
const ProductCard = React.memo(function ProductCard({ product, onToggleFavorite }) {
  console.log('ProductCard render', product.id);
  return (
    <div>
      {product.name}
      <button onClick={() => onToggleFavorite(product.id)}>
        {product.isFavorite ? '★' : '☆'}
      </button>
    </div>
  );
});

function ProductGrid({ products, onToggleFavorite }) {
  // onToggleFavorite is expected to be a stable useCallback from the parent
  return (
    <div>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} onToggleFavorite={onToggleFavorite} />
      ))}
    </div>
  );
}

function ProductPage() {
  const [products, setProducts] = useState(initialProducts);
  const toggleFavorite = useCallback((id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isFavorite: !p.isFavorite } : p))
    );
  }, []);
  return <ProductGrid products={products} onToggleFavorite={toggleFavorite} />;
}
```

With `toggleFavorite` memoized (stable reference) and the state update using `.map()` (which only creates a new object for the toggled product — every other product object keeps its old reference), `React.memo` on `ProductCard` correctly skips re-rendering for every card except the one that was actually favorited.
