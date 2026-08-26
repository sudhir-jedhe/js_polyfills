*** copy Show code examples of when useCallback actually prevents re-renders vs when it adds pure overhead..md ***

**Scenario 1: Pure Overhead (Provides Zero Performance Benefit)**

In this example, wrapping `handleClick` in `useCallback` does not prevent any re-renders because standard HTML elements like `<button>` do not perform prop comparison, and `RegularChild` is not memoized.

```tsx
function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // ❌ ANTI-PATTERN: Waste of memory and comparison cycles
  // The arrow function is still created every render, and React runs dependency checks.
  const handleNativeClick = useCallback(() => {
    console.log('Button clicked');
  }, []);

  // ❌ ANTI-PATTERN: RegularChild is NOT wrapped in React.memo
  // When ParentComponent re-renders, RegularChild re-renders anyway,
  // regardless of whether `onAction` reference changes or stays the same.
  const handleChildAction = useCallback(() => {
    console.log('Action triggered');
  }, []);

  return (
    <div>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      
      {/* Native DOM elements don't care about referential stability */}
      <button onClick={handleNativeClick}>Click Me</button>

      {/* Re-renders on every keystroke in `text` regardless of useCallback */}
      <RegularChild onAction={handleChildAction} />
    </div>
  );
}

function RegularChild({ onAction }: { onAction: () => void }) {
  console.log('RegularChild rendered!'); // Executes on EVERY parent render
  return <button onClick={onAction}>Child Action</button>;
}

```

---

**Scenario 2: Effective Usage (Actually Prevents Re-Renders)**

`useCallback` works effectively when paired with **`React.memo`** or when the function serves as a dependency in a hook.

```tsx
import React, { useState, useCallback, useEffect, memo } from 'react';

// 1. Child component is explicitly memoized
const ExpensiveList = memo(function ExpensiveList({
  onItemDelete,
}: {
  onItemDelete: (id: number) => void;
}) {
  console.log('ExpensiveList rendered'); // Runs ONLY on initial mount
  return <div>Expensive tree with hundreds of nodes...</div>;
});

function ParentContainer() {
  const [items, setItems] = useState([1, 2, 3]);
  const [theme, setTheme] = useState('light');

  // ✅ EFFECTIVE: Stabilizes reference so ExpensiveList's shallow prop check passes.
  // When `theme` changes, ParentContainer re-renders, but ExpensiveList is skipped.
  const handleDelete = useCallback((id: number) => {
    setItems((prev) => prev.filter((item) => item !== id));
  }, []); // Using functional updater avoids `items` in dependency array

  // ✅ EFFECTIVE: Prevents infinite loops or unwanted runs in useEffect
  const fetchUserAnalytics = useCallback(() => {
    console.log('Fetching analytics for current state...');
  }, []);

  useEffect(() => {
    fetchUserAnalytics();
  }, [fetchUserAnalytics]); // Stable reference prevents effect from re-running on every render

  return (
    <div>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Toggle Theme
      </button>

      {/* Will NOT re-render when `theme` changes */}
      <ExpensiveList onItemDelete={handleDelete} />
    </div>
  );
}

```

---

**Summary Checklist**

* **Skip `useCallback**` when passing handlers to native elements (`<input>`, `<button>`, `<div>`) or non-memoized components.
* **Use `useCallback**` only when passing callbacks to `React.memo` components, using them inside `useEffect`/`useMemo` dependency arrays, or returning them from custom hooks.
