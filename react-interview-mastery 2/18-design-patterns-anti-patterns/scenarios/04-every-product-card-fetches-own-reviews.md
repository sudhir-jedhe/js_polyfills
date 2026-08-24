# Every Product Card on a Listing Page Fetches Its Own Review Summary, Tanking Performance

A product listing page renders 40 `ProductCard` components, and each one independently calls `/api/reviews/summary?productId=X` in its own `useEffect`, firing 40 simultaneous requests on page load.

**Approach:** Lift the fetch to the parent (batch-fetch all summaries in one request if the API supports it) or introduce a shared cache/dedup layer so identical concurrent requests collapse into one, then pass the relevant summary down as a prop.

```jsx
// Before: each card fetches independently
function ProductCard({ product }) {
  const [summary, setSummary] = useState(null);
  useEffect(() => {
    fetch(`/api/reviews/summary?productId=${product.id}`).then((r) => r.json()).then(setSummary);
  }, [product.id]);
  // ...
}

// After: parent fetches once, in bulk
function ProductList({ products }) {
  const [summaries, setSummaries] = useState({});

  useEffect(() => {
    const ids = products.map((p) => p.id).join(",");
    fetch(`/api/reviews/summary?productIds=${ids}`)
      .then((r) => r.json())
      .then((data) => setSummaries(Object.fromEntries(data.map((s) => [s.productId, s]))));
  }, [products]);

  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} summary={summaries[p.id]} />
      ))}
    </div>
  );
}

function ProductCard({ product, summary }) {
  return (
    <div>
      <h3>{product.name}</h3>
      {summary ? <StarRating value={summary.avgRating} /> : <RatingSkeleton />}
    </div>
  );
}
```

This turns 40 requests into 1, and `ProductCard` becomes a pure, testable presentational component with no fetching logic of its own.
