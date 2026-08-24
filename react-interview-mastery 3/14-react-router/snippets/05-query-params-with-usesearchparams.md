# Reading and Updating Query Params With `useSearchParams`

```jsx
function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sort = searchParams.get('sort') ?? 'popularity';
  return (
    <select value={sort} onChange={e => setSearchParams({ sort: e.target.value })}>
      <option value="popularity">Popularity</option>
      <option value="price">Price</option>
    </select>
  );
}
```
