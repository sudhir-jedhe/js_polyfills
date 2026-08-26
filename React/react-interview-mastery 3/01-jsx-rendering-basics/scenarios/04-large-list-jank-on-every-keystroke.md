*** copy 04-large-list-jank-on-every-keystroke.md ***

# Long List of 5,000 Rows Causes Visible Jank on Every Keystroke in a Filter Box

**Scenario:** You're building a search-as-you-type filter over a large product catalog rendered as a JSX list, and every keystroke causes the whole page to freeze for a noticeable moment.

**Approach:** Before reaching for virtualization or memoization (later topics), first confirm the basics: each keystroke triggers a state update, which triggers a full re-render of the parent, which re-runs `.map()` over the filtered array and creates a fresh element tree of up to 5,000 elements every time. React still has to reconcile all of them even if the diff avoids most DOM writes. A quick, topic-appropriate fix is to make sure the list itself isn't being recreated unnecessarily (e.g., don't inline a new array/object literal as `items` on every keystroke if it doesn't need to be) and that keys are stable so React can bail out of re-rendering unchanged rows structurally:

```jsx
function ProductList({ query, products }) {
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase())
  );
  return (
    <ul>
      {filtered.map(p => (
        <li key={p.id}>{p.name}</li> // stable key lets React diff cheaply
      ))}
    </ul>
  );
}
```

For real performance at this scale you'd eventually reach for `React.memo` on row components, debouncing the filter input, or list virtualization — but ruling out unstable keys and unnecessary reference churn is the first, cheapest check.
