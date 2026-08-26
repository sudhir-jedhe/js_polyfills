*** copy 02-intermediate-component-unaware-of-context.md ***

# Output-Based: Does an intermediate component need to know about a context it doesn't consume?

```jsx
const ThemeContext = createContext('light');

function Page() {
  return (
    <ThemeContext.Provider value="dark">
      <Section />
    </ThemeContext.Provider>
  );
}

function Section() {
  return <Label />;
}

function Label() {
  const theme = useContext(ThemeContext);
  return <span>{theme}</span>;
}
```

What does `<Label/>` render, and does `<Section/>` need to know about `ThemeContext`?

**Answer:** Renders `dark`. `Section` needs no knowledge of `ThemeContext` at all — it doesn't call `useContext`, doesn't accept a `theme` prop, and doesn't re-render because of context value changes (only because its parent re-renders).

**Why:** This is exactly what Context is for — `Label`, several layers below the Provider, reads the value directly without `Section` acting as a pass-through. `Section`'s render count is driven only by its own props/state and its parent's re-renders, not by `ThemeContext`'s value.
