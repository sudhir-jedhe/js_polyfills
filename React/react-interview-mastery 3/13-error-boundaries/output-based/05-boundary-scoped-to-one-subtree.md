# What Shows on Screen After `SearchResults` Throws?

```jsx
function App() {
  return (
    <div>
      <Header />
      <ErrorBoundary fallback={<p>Results unavailable</p>}>
        <SearchResults />
      </ErrorBoundary>
      <Footer />
    </div>
  );
}
```

**Answer:** `Header`, the text "Results unavailable", and `Footer` all render normally — only `SearchResults` is replaced.

**Why:** The boundary is scoped to just `SearchResults`; siblings outside the boundary (`Header`, `Footer`) are unaffected because the error and the resulting unmount/fallback substitution only apply to the subtree rendered *inside* the boundary that caught it. This is the argument for per-section granularity.
