# Does the Fallback Show Again on the Second Render?

```jsx
const Heavy = React.lazy(() => import("./Heavy"));

function App() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>{count}</button>
      <Suspense fallback={<p>Fallback</p>}>
        <Heavy />
      </Suspense>
    </div>
  );
}
```

**Answer:** No — after the initial load, clicking the button just re-renders `count`; `Heavy` stays mounted and "Fallback" does not reappear.

**Why:** Once a lazy module has been imported, the browser/module cache holds the resolved module, so subsequent renders of `Heavy` don't suspend again — they render synchronously like any other component. Suspense only triggers while the promise is pending.
