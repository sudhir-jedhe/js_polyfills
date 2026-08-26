# useTransition and useDeferredValue

Both hooks let you mark work as non-urgent so React can prioritize more important updates (like keystrokes) ahead of it. They solve the same underlying problem from two different angles.

## useTransition

`useTransition` marks a state update as non-urgent ("a transition"), so React can interrupt it to handle higher-priority updates first:

```jsx
function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    setQuery(e.target.value); // urgent: keep the input responsive
    startTransition(() => {
      setResults(expensiveFilter(e.target.value)); // non-urgent
    });
  }

  return (
    <>
      <input value={query} onChange={handleChange} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  );
}
```

The input stays snappy because `setQuery` runs at normal priority, while `setResults` — which might trigger an expensive re-render of a big list — can be interrupted mid-render if the user types another character. `isPending` tells you the transition is still in flight, useful for a subtle loading indicator.

## useDeferredValue

`useDeferredValue` is the "value" counterpart to `useTransition` — instead of wrapping a state setter, you defer a value itself, letting React re-render with the old value while it computes the new one in the background:

```jsx
function SearchResults({ query }) {
  const deferredQuery = useDeferredValue(query);
  const results = useMemo(() => expensiveFilter(deferredQuery), [deferredQuery]);
  return <List items={results} />;
}
```

Use `useDeferredValue` when you don't control the state update itself (e.g., the value comes from a prop) and can't wrap it in `startTransition` at the source.

## Choosing between them

| Aspect | `useTransition` | `useDeferredValue` |
|---|---|---|
| What you wrap | A state *update* (`startTransition(() => setX(...))`) | A *value* you already have (often a prop or state you don't control) |
| Gives you | An `isPending` boolean | A deferred version of the value to compare against the current one |
| Use when | You control the state setter causing the expensive work | You only have the value itself, not the setter (e.g., it's a prop) |
| Common mistake | Wrapping the urgent update (like the input's own `setText`) in the transition, defeating the point | Comparing `deferredValue !== value` incorrectly or forgetting to memoize the expensive computation, so it still runs every render |

Prefer `useTransition` when you're the one calling `setState`; reach for `useDeferredValue` when a value flows in from outside your control.
