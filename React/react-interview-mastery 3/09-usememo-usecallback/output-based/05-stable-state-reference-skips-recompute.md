***  05-stable-state-reference-skips-recompute.md ***

# Output-Based: Stable State Reference Skips Recomputation

```jsx
function ExpensiveList({ data }) {
  const sorted = useMemo(() => {
    console.log('sorting', data.length, 'items');
    return [...data].sort((a, b) => a.value - b.value);
  }, [data]);

  return <ul>{sorted.map((d) => <li key={d.id}>{d.value}</li>)}</ul>;
}

function App() {
  const [data] = useState([{ id: 1, value: 3 }, { id: 2, value: 1 }]);
  const [tick, setTick] = useState(0);

  return (
    <div>
      <button onClick={() => setTick((t) => t + 1)}>Tick: {tick}</button>
      <ExpensiveList data={data} />
    </div>
  );
}
```

Clicking "Tick" 5 times — does "sorting..." log 5 more times?

**Answer:** No — it doesn't log again at all after the initial render.

**Why:** `data` comes from `useState` and is never reassigned, so it's the same array reference on every render of `App`, which means `ExpensiveList` always receives the same `data` prop reference. Even though `App` re-renders (and by default so would `ExpensiveList`, since it's not wrapped in `React.memo`), the `useMemo` inside `ExpensiveList` checks its own dependency (`data`) — unchanged — and returns the cached sorted array without recomputing.
