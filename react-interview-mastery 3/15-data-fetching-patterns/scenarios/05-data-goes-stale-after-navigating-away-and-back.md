# Data Goes Stale After Navigating Away and Back

Users navigate from a product list to a product detail page and back; the list shows outdated inventory counts because it was fetched once on first mount and never refreshed.

**Approach:** Decide on a staleness policy: refetch on every mount (simplest, extra network calls), refetch on window focus (catches the common "came back to this tab" case), or cache with a TTL and background-refresh (stale-while-revalidate). For a manual implementation, refetch on mount but show cached data instantly to avoid a loading flash:

```jsx
const listCache = new Map();

function ProductList() {
  const cached = listCache.get("products");
  const [products, setProducts] = useState(cached ?? []);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        listCache.set("products", data);
        setProducts(data);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {loading && !cached && <Spinner />}
      <ul>{products.map((p) => <li key={p.id}>{p.name}: {p.stock}</li>)}</ul>
    </div>
  );
}
```

This is a hand-rolled version of exactly what SWR's name describes: show stale cached data immediately, revalidate in the background, update when the fresh response lands.
