*** copy 02-undefined-children-renders-empty.md ***

# What Renders?

```jsx
function Box({ children }) {
  return <div className="box">{children}</div>;
}

function App() {
  return <Box />;
}
```

**Answer:** `<div class="box"></div>` — an empty box, no error.

**Why:** `children` is `undefined` when nothing is nested between `<Box>` and `</Box>` (and there's no self-closing content). React happily renders `undefined` as nothing, so the div is just empty rather than throwing.
