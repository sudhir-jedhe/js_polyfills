# Problem: Implement a Search Input Using useTransition

## Task

Build a search box that filters a large list (thousands of items) as the user types. Typing must stay responsive — no stutter — even though filtering the list is an expensive synchronous computation. Use `useTransition` to defer the expensive update.

## Solution

```jsx
import { useState, useTransition, useMemo } from "react";

function expensiveFilter(items, query) {
  // Simulate a heavy synchronous computation over a big list.
  return items.filter((item) => item.toLowerCase().includes(query.toLowerCase()));
}

export default function SearchWithTransition({ items }) {
  const [inputValue, setInputValue] = useState("");
  const [filteredItems, setFilteredItems] = useState(items);
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const next = e.target.value;

    // Urgent: the input's own displayed value updates immediately,
    // so the character the user typed always appears without delay.
    setInputValue(next);

    // Non-urgent: this can be expensive over a big list, so we mark it
    // as a transition. React will interrupt this work if the user types
    // again before it finishes, instead of blocking the input.
    startTransition(() => {
      setFilteredItems(expensiveFilter(items, next));
    });
  }

  return (
    <div>
      <input
        value={inputValue}
        onChange={handleChange}
        placeholder="Search…"
      />
      {isPending && <span style={{ marginLeft: 8, color: "#888" }}>updating…</span>}
      <ul style={{ opacity: isPending ? 0.6 : 1 }}>
        {filteredItems.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
```

## Why this works

- `inputValue` is updated via a plain `setInputValue` call — a normal-priority update — so the character the user typed is painted to the input immediately, every time, with no lag.
- `filteredItems` is updated inside `startTransition`, marking it as low-priority. If the user types another character before the filter finishes computing, React can abandon the in-progress transition and start a new one with the latest text, rather than finishing a now-stale filter pass first.
- `isPending` reflects whether a transition is currently in flight, which is used here both for a text hint and to dim the (possibly stale) list while the new results are being computed.

## Things to watch out for

- Don't wrap `setInputValue` in the transition — that's the mistake that defeats the whole point; the input's own value must stay at normal priority or typing itself will lag.
- `useTransition` only helps because you control the `setFilteredItems` call directly. If `filteredItems` were instead derived from a prop you don't set yourself, `useDeferredValue` would be the right tool instead — see `../problems/02-search-with-usedeferredvalue.md`.
