# What Renders First, Second, and Does It Flicker?

```jsx
function List({ page }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems([]); // reset before fetch
    fetch(`/api/items?page=${page}`).then((r) => r.json()).then(setItems);
  }, [page]);

  return <ul>{items.map((i) => <li key={i.id}>{i.name}</li>)}</ul>;
}
```

**Answer:** On every `page` change: empty list renders first, then the new page's items render once the fetch resolves — a visible flicker to empty on each page change.

**Why:** `setItems([])` runs synchronously inside the effect before the async fetch resolves, so React commits an empty-list render immediately, then a second render once data arrives. This is the classic "loading flash" that stale-while-revalidate patterns (keep old data visible while fetching new) are designed to avoid.
