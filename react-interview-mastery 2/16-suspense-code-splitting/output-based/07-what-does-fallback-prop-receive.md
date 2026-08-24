# What Does the `fallback` Prop Receive — a Rendered Value or Something Else?

```jsx
function App() {
  console.log(typeof (<p>Loading...</p>));
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <LazyThing />
    </Suspense>
  );
}
```

**Answer:** `"object"` — JSX always compiles to a plain object (a React element), whether or not it's used as a Suspense fallback.

**Why:** This is a trick question about JSX itself, not Suspense specifically: `<p>Loading...</p>` is just `React.createElement('p', null, 'Loading...')`, an ordinary object describing what to render. Suspense treats `fallback` like any other prop — there's no special runtime type for it.
