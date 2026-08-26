*** copy 01-render-then-effect-order-on-mount.md ***

# What's Logged, and in What Order, on Mount?

```jsx
function App() {
  console.log('A: render');
  React.useEffect(() => {
    console.log('C: effect');
  });
  console.log('B: still rendering');
  return <div>hi</div>;
}
```

**Answer:** `A: render`, `B: still rendering`, `C: effect` — in that order.

**Why:** The component function body (render phase) runs completely and synchronously first, producing the JSX. React commits the resulting DOM changes, and only after paint does it run the effect callback. Effects never run interleaved with the render function's own synchronous code.
