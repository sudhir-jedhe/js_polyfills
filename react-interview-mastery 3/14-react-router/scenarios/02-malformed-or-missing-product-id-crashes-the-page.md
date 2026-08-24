# Malformed or Missing Product IDs Crash the Page Instead of Showing a 404

Your app has a `/products/:productId` route. Users report that pasting a malformed ID (e.g., `/products/../../etc`) or a non-existent product ID crashes the page with a blank screen instead of showing a proper 404. How do you fix it?

**Approach:** Validate the param and handle the not-found case explicitly instead of assuming the data will always be there — ideally combined with an error boundary as a safety net for anything unexpected.

```jsx
function ProductPage() {
  const { productId } = useParams();
  const [state, setState] = useState({ status: 'loading', product: null });

  useEffect(() => {
    let cancelled = false;
    fetchProduct(productId)
      .then(product => {
        if (!cancelled) setState({ status: 'success', product });
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'not-found', product: null });
      });
    return () => { cancelled = true; };
  }, [productId]);

  if (state.status === 'loading') return <Spinner />;
  if (state.status === 'not-found') return <Navigate to="/products/not-found" replace />;
  return <ProductDetails product={state.product} />;
}

// catch genuinely unexpected errors (bad routing, render bugs) with a boundary too
<Route element={<ErrorBoundary fallback={<GenericError />} />}>
  <Route path="/products/:productId" element={<ProductPage />} />
</Route>
```

If migrating to a data router, this becomes cleaner: throw a `Response('Not Found', { status: 404 })` from the route's `loader` and let a route-level `errorElement` render the 404 UI automatically, removing the manual status-state juggling from the component.
