***  06-unstable-object-dependency-reruns-every-render.md ***

# What's Wrong With This Component, and What Happens When It Runs?

```jsx
function SearchBox({ onSearch }) {
  const [query, setQuery] = React.useState('');
  const options = { trim: true, caseSensitive: false };

  React.useEffect(() => {
    onSearch(query, options);
  }, [query, options]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```

**Answer:** The effect re-runs on *every single render* of `SearchBox`, not just when `query` actually changes — including renders triggered by the parent for unrelated reasons, and even the render caused by the effect itself calling `onSearch` if that triggers a parent state update.

**Why:** `options` is a new object literal created fresh on every render, so it's a new reference every time even though its contents never change. Since it's in the dependency array, React's shallow comparison (`Object.is` per dependency) sees it as "changed" every render, causing the effect to fire repeatedly. Fix by moving the object literal inside the effect, or wrapping it in `useMemo`, or depending on its primitive fields directly.
