# What Does `useSearchParams` Return, and What Happens After Calling `setSearchParams`?

```jsx
function Filters() {
  const [params, setParams] = useSearchParams();
  console.log('render, category =', params.get('category'));
  return (
    <button onClick={() => setParams({ category: 'shoes' })}>
      Filter shoes
    </button>
  );
}
// initial URL: /products
```

**Answer:** Initial log: `"render, category = null"`. After clicking the button: URL becomes `/products?category=shoes`, and it logs `"render, category = shoes"`.

**Why:** `useSearchParams` reads/writes the query string via `URLSearchParams`, synced to the browser's location. `params.get('category')` returns `null` when the key is absent (not `undefined`). Calling `setParams` updates the URL and triggers a re-render with the new `params` object reflecting the change — functionally similar to `useState`, but backed by the URL itself.
