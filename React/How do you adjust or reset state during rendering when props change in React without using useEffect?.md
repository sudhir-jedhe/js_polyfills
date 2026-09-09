***  How do you adjust or reset state during rendering when props change in React without using useEffect?.md ***

You can adjust state when props change by calling the **`setState` updater directly inside the component body during render**.

When you call `setState` during rendering, React immediately stops rendering that component, discards the unfinished JSX output, and restarts rendering that component with the updated state—**all before painting the screen or executing children**.

---

**The Implementation Pattern: Storing Information from Previous Renders**

To avoid infinite render loops, you must track the previous prop in state (or a state-adjacent check) and execute the `setState` conditionally:

```jsx
import { useState } from 'react';

export function SearchResults({ items }) {
  const [selection, setSelection] = useState(null);
  const [prevItems, setPrevItems] = useState(items);

  // 1. Check if the prop has changed during this render pass
  if (items !== prevItems) {
    // 2. Synchronously schedule state adjustments
    setPrevItems(items);
    setSelection(null); // Reset selection when items list changes
  }

  return (
    <ul>
      {items.map((item) => (
        <li
          key={item.id}
          className={selection === item.id ? 'selected' : ''}
          onClick={() => setSelection(item.id)}
        >
          {item.name}
        </li>
      ))}
    </ul>
  );
}

```

---

**How React Handles This Under the Hood**

```
[Parent Renders with new `items`]
       │
       ▼
[SearchResults Executes]
   ├── `items !== prevItems` evaluates to `true`
   └── `setSelection(null)` and `setPrevItems(items)` are called
       │
       ▼
[React Render Bailout & Immediate Restart]
   ├── React detects `setState` during render of `SearchResults`
   ├── Discards current incomplete render pass (DOM is NOT touched, children NOT evaluated)
   └── Immediately restarts `SearchResults` with `selection: null` and updated `prevItems`
       │
       ▼
[Clean Render Commits & Paints]

```

* **No Visible Flicker:** Because the adjustment happens before the commit phase, the browser never paints an intermediate frame showing stale selection data.
* **Faster Than `useEffect`:** `useEffect` waits until *after* the DOM commits and paints the stale state to the screen, only to schedule a second render pass that paints again.

---

**Crucial Rules When Adjusting State During Render**

* **Must Be Strictly Conditional:** You must guard the `setState` with a condition like `if (prop !== prevProp)`. Calling `setState` unconditionally during render throws a fatal error: *"Too many re-renders. React limits the number of renders to prevent an infinite loop."*
* **Keep State Pure:** Only update the state of the component currently executing. Attempting to update a different component's state or a parent's state during render is prohibited.
* **Keep It Minimal:** Do not run side-effects (e.g., network requests, timers, DOM queries) inside the render condition.

---

**Better Alternative: Can You Derive It Instead?**

Before storing prev-props in state, check if you actually need state at all. Often, deriving the value during render eliminates state management entirely:

```jsx
// ✅ BEST: No state reset required; derived dynamically during render
function SearchResults({ items }) {
  const [selectedId, setSelectedId] = useState(null);

  // If items change and selectedId is no longer present, fallback to null
  const selectedItem = items.find((item) => item.id === selectedId) ?? null;

  return <div>Selected: {selectedItem?.name ?? 'None'}</div>;
}

```

---

**When to Use Which Approach**

| Strategy                                                  | When to Choose                                                                                              |
| --------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **Derive during render**                                  | The selection/value can be calculated on-the-fly from existing props and state.                             |
| **`key={prop}` reset**                                    | Switching entire entities (e.g., `userId` changes) and *all* local state should start completely fresh.     |
| **Adjust state during render (`if (prop !== prevProp)`)** | You only want to reset *part* of the state while preserving user interactions if the prop remains the same. |
| **`useEffect`**                                           | **Avoid** for state synchronization/resets (causes visual flashes and redundant render cycles).             |
