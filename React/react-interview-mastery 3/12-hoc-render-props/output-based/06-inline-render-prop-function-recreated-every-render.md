# Output-Based: Does an Inline Render Prop Get Redefined Every Render, and Does That Matter?

```jsx
function App() {
  const [count, setCount] = useState(0);
  return (
    <DataFetcher url="/api">
      {({ data }) => <p onClick={() => setCount(c => c + 1)}>{data}, {count}</p>}
    </DataFetcher>
  );
}
```
**Answer:** Yes, a brand-new inline function is created every time `App` renders, and it does matter for performance (though not for correctness): if `DataFetcher` were wrapped in `React.memo`, the new `children` function reference would defeat that memoization every render.

**Why:** Inline arrow functions passed as render props are recreated on every parent render just like any other inline function prop — the render-props pattern doesn't get special treatment from React. This is one of the concrete downsides of render props relative to hooks: there's no clean way to "memoize away" the child-function recreation without `useCallback`, which is exactly the ceremony hooks avoid needing in the first place.
