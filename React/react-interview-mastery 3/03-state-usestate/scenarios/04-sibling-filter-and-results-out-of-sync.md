***  04-sibling-filter-and-results-out-of-sync.md ***

# Two Sibling Components (a Filter Sidebar and a Results List) Get Out of Sync

**Scenario:** You're building a product listing page with a `<FilterSidebar>` and a `<ResultsList>` as siblings, each currently managing its own local `selectedCategory` state, and users report the results list sometimes doesn't reflect the filter they just picked.

**Approach:** Sibling components can't directly share `useState` — each has its own independent copy, so there's no way for one to "know" the other changed. The fix is to lift the shared state up to their common parent and pass it down as props:

```jsx
function ProductPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [products] = React.useState(allProducts);

  const filtered = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="page">
      <FilterSidebar selected={selectedCategory} onSelect={setSelectedCategory} />
      <ResultsList products={filtered} />
    </div>
  );
}

function FilterSidebar({ selected, onSelect }) {
  return (
    <select value={selected} onChange={e => onSelect(e.target.value)}>
      <option value="all">All</option>
      <option value="shoes">Shoes</option>
    </select>
  );
}

function ResultsList({ products }) {
  return <ul>{products.map(p => <li key={p.id}>{p.name}</li>)}</ul>;
}
```

Neither sibling owns `selectedCategory` anymore — `ProductPage` is the single source of truth, and both children stay trivially in sync because they're both driven from the same state via props.
