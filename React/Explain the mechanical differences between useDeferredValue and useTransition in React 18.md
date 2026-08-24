While both `useTransition` and `useDeferredValue` lower rendering priority using React's **Transition Lanes**, they differ fundamentally in **where the concurrency is triggered** (at the state-setter source vs. at the derived value/consumer level) and **how many render passes occur**.

---

### Core Mechanics Comparison

```
┌────────────────────────────────────────────────────────┐
│ useTransition: State-Setter Producer                   │
│                                                        │
│   startTransition(() => setCount(newVal))              │
│       │                                                │
│       ▼                                                │
│   Schedules ONE render pass directly in TransitionLane │
│   (Plus immediate high-priority isPending update)      │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│ useDeferredValue: Value-Based Consumer                 │
│                                                        │
│   const deferred = useDeferredValue(query)             │
│       │                                                │
│       ▼                                                │
│   Step 1: Synchronous/Urgent render with OLD value     │
│   Step 2: Background concurrent render with NEW value  │
└────────────────────────────────────────────────────────┘

```

---

### 1. `useTransition` (Eager Transition Scheduling)

`useTransition` wraps a **state setter call**. It tells React: *"Execute this state update directly inside a lower-priority `TransitionLane`."*

```tsx
const [isPending, startTransition] = useTransition();

function handleChange(e) {
  // Urgent update (SyncLane / InputContinuousLane)
  setInputValue(e.target.value);

  // Non-urgent update (TransitionLane)
  startTransition(() => {
    setSearchQuery(e.target.value);
  });
}

```

#### Under the Hood

1. **`isPending = true`**: React immediately schedules a synchronous, high-priority update to flip `isPending` to `true` so you can show a loading indicator.
2. **Single Transition Render**: React allocates a single `workInProgress` tree for `setSearchQuery` tagged with `TransitionLane`.
3. **Preemptible**: If the user types again, this background render is aborted and restarted with the newest input.
4. **`isPending = false`**: When the transition render finally commits, `isPending` flips back to `false`.

---

### 2. `useDeferredValue` (Two-Pass Reconciliation)

`useDeferredValue` accepts an **already changing value** (a prop or state variable) and defers re-rendering the downstream subtree that depends on it.

```tsx
function SearchResults({ query }: { query: string }) {
  // query is already updated by the parent
  const deferredQuery = useDeferredValue(query);

  // If query !== deferredQuery, this component's subtree is lagging behind
  const isStale = query !== deferredQuery;

  return (
    <div style={{ opacity: isStale ? 0.5 : 1 }}>
      <HeavyList query={deferredQuery} />
    </div>
  );
}

```

#### Under the Hood (The Two-Pass Render)

1. **Pass 1 (Urgent/Synchronous):** When `query` changes from `"A"` to `"B"`, the component re-renders immediately. However, `useDeferredValue` returns the **stale value (`"A"`)**. React quickly re-renders and commits the UI using the old value.
2. **Pass 2 (Deferred/TransitionLane):** Right after committing Pass 1, React immediately schedules a second, non-blocking render pass in the background where `deferredQuery` receives `"B"`.
3. **Bailout Optimization:** If child components are wrapped in `React.memo`, they bailout and skip rendering during Pass 1 (since `deferredQuery` did not change), remaining responsive until Pass 2 finishes.

---

### Key Differences Table

| Feature                     | `useTransition`                                        | `useDeferredValue`                                                                           |
| --------------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| **Control Point**           | Wraps the state update (`setState`)                    | Wraps a consumed value/prop                                                                  |
| **Pending State Indicator** | Provides built-in `isPending` boolean                  | Compare `value !== deferredValue`                                                            |
| **Render Passes**           | 1 Transition pass (+ synchronous `isPending` toggle)   | **2 passes** (Urgent pass with stale value, then deferred pass with new value)               |
| **Best Used When**          | You own the state-setting function and want to wrap it | You receive data from a parent, hook, or third-party store where you can't access `setState` |
| **Requires `React.memo`?**  | No                                                     | **Recommended** for children so they skip the first urgent render pass                       |

---

### When to Choose Which

* **Use `useTransition**` when you control the state modification directly (e.g., tab switching, filtering buttons, pagination) and want a built-in `isPending` spinner flag.
* **Use `useDeferredValue**` when you receive incoming props from an external source or parent (e.g., URL search params, props from an ancestor, router transitions) and need to keep the host input responsive while deferring heavy child computation.
