# A `try/catch` Is Added Inside the Component Body, Wrapping the JSX Return. Does This Change Anything?

```jsx
function Buggy({ data }) {
  try {
    return <p>{data.value}</p>;
  } catch (err) {
    console.log('caught locally');
    return <p>fallback text</p>;
  }
}
```

**Answer:** This actually works and prevents the error boundary from ever seeing an error — `"caught locally"` logs, and `<p>fallback text</p>` renders.

**Why:** JSX (`<p>{data.value}</p>`) compiles to a plain `React.createElement(...)` call executed synchronously within the function body, so a `try/catch` wrapped around the `return` statement *does* catch a `TypeError` thrown while evaluating `data.value`, just like any other synchronous JS error. This is a legitimate (if unusual) way to handle expected, localized render errors without needing a boundary — though for genuinely unexpected errors, a boundary further up is still the more robust safety net since you can't wrap every component in local try/catch.
