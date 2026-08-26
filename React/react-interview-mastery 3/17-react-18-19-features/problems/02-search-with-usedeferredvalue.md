# Problem: Implement the Same Search Using useDeferredValue, and Compare

## Task

Rebuild the same responsive search box from the `useTransition` version, but using `useDeferredValue` instead. Then compare the two approaches.

## Solution

```jsx
import { useState, useDeferredValue, useMemo } from "react";

function expensiveFilter(items, query) {
  return items.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
}

export default function SearchWithDeferredValue({ items }) {
  const [inputValue, setInputValue] = useState("");

  // deferredQuery trails behind inputValue during expensive renders —
  // React re-renders with the old deferredQuery first (fast), then
  // re-renders again with the new one once it's ready.
  const deferredQuery = useDeferredValue(inputValue);
  const isStale = inputValue !== deferredQuery;

  // useMemo avoids recomputing the filter on every render — only when
  // deferredQuery (or items) actually changes.
  const filteredItems = useMemo(
    () => expensiveFilter(items, deferredQuery),
    [items, deferredQuery]
  );

  return (
    <div>
      <input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Search…"
      />
      {isStale && <span style={{ marginLeft: 8, color: "#888" }}>updating…</span>}
      <ul style={{ opacity: isStale ? 0.6 : 1 }}>
        {filteredItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Why this works

- `inputValue` still updates at normal priority on every keystroke, so the input itself never lags.
- `useDeferredValue(inputValue)` gives back a version of the value that "lags behind" under load: React renders immediately with the previous `deferredQuery` (cheap, since `filteredItems` is memoized against it), then attempts a background re-render with the new value, which can itself be interrupted by further typing.
- `isStale` (comparing `inputValue !== deferredQuery`) is the `useDeferredValue` equivalent of `isPending` — a signal you can use to dim stale results while the fresh ones compute.

## useTransition vs. useDeferredValue, compared directly

| Aspect | `useTransition` version | `useDeferredValue` version |
|---|---|---|
| What's wrapped | The `setFilteredItems` state update, explicitly | The `inputValue` itself — no second state variable needed |
| Who must own the state | You need to own and call the setter for the derived state | Works even if the "current" value came from a prop you don't control |
| Loading signal | `isPending` (built-in boolean) | You derive it yourself (`value !== deferredValue`) |
| Code shape | Two states (`inputValue`, `filteredItems`) + a transition-wrapped setter | One state (`inputValue`) + one derived value; less state to keep in sync |

For this exact scenario — you own the input's state and the setter that drives the expensive work — either works. Reach for `useTransition` when you're the one triggering the update (e.g., in an event handler) and want an explicit pending flag; reach for `useDeferredValue` when the value flows in from somewhere you don't control (a prop, context, or a value from a parent), since there's no setter there to wrap in `startTransition`.
