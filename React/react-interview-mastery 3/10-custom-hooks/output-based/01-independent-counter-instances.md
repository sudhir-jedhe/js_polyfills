*** copy 01-independent-counter-instances.md ***

# Output-Based: Independent Counter Instances

```jsx
function useCounter() {
  const [count, setCount] = useState(0);
  return [count, () => setCount((c) => c + 1)];
}

function App() {
  const [countA, incrementA] = useCounter();
  const [countB, incrementB] = useCounter();

  return (
    <div>
      <button onClick={incrementA}>A: {countA}</button>
      <button onClick={incrementB}>B: {countB}</button>
    </div>
  );
}
```

The user clicks "A" three times. What does "B:" show?

**Answer:** `B: 0` — unchanged.

**Why:** Each call to `useCounter()` creates its own independent `useState` slot. Custom hooks share *logic* (the code that defines how state updates), not *state itself* — the two calls in `App` are two completely separate instances of `count`, with no connection to each other. Clicking A's button only ever touches A's own `count`.
