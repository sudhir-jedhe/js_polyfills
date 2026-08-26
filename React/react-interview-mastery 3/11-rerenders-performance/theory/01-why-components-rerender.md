# Why a Component Re-Renders

There are exactly three things that cause a function component to run again:

1. **Its own state changes** (`useState`/`useReducer` setter is called with a new value).
2. **Its parent re-renders**, regardless of whether the props it receives actually changed.
3. **A context it consumes changes value** (any component calling `useContext(MyContext)` re-renders when the provider's `value` changes, even if the consumer doesn't use the changed part).

Note what's *not* on this list: props changing by themselves do not cause a re-render — a prop change only matters because it's usually the *result* of the parent re-rendering. If a parent re-renders and passes the exact same props, the child still re-renders (unless memoized).

```jsx
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <div>
      <button onClick={() => setCount(c => c + 1)}>{count}</button>
      <Child />
    </div>
  );
}

function Child() {
  console.log('Child rendered'); // logs on every Parent re-render
  return <p>I don't use count at all</p>;
}
```

## Does a prop changing cause a re-render if the parent didn't re-render?

No — a component can only receive new props as part of its parent re-rendering and passing different values down. There's no mechanism for a prop to change "in isolation" without the parent function re-running.
