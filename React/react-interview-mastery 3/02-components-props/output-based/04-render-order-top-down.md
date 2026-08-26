*** copy 04-render-order-top-down.md ***

# What's Logged, and in What Order?

```jsx
function Child({ value }) {
  console.log('Child render', value);
  return <span>{value}</span>;
}

function Parent() {
  const [count, setCount] = React.useState(0);
  console.log('Parent render', count);
  return (
    <div>
      <Child value={count} />
      <button onClick={() => setCount(c => c + 1)}>+</button>
    </div>
  );
}
```

**Answer:** Initial mount logs `Parent render 0` then `Child render 0`. Each click logs `Parent render N` then `Child render N`.

**Why:** Rendering flows top-down: React calls `Parent` first to get its returned element tree, then calls `Child` (since it's part of that tree) to resolve it further. Without `React.memo` on `Child`, every parent re-render also re-renders `Child`, regardless of whether `value` actually changed.
