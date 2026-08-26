*** copy 05-default-value-triggers-on-undefined-only.md ***

# What Happens Here?

```jsx
function Card({ title = 'Untitled' }) {
  return <h2>{title}</h2>;
}

function App() {
  return <Card title={undefined} />;
}
```

**Answer:** Renders `<h2>Untitled</h2>`.

**Why:** Destructuring default values kick in specifically when the value is `undefined` — not when it's missing entirely vs. explicitly passed as `undefined`, both behave the same way. This differs from passing `title={null}`, which would render an empty `<h2></h2>` because `null` is a defined value and doesn't trigger the default.
