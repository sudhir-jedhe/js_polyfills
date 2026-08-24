Here is a complete, custom polyfill for React's `useMemo` built using `useRef`.

---

### Implementation

```javascript
import { useRef } from 'react';

function areEqual(prevDeps, nextDeps) {
  if (prevDeps === nextDeps) return true;
  if (!prevDeps || !nextDeps || prevDeps.length !== nextDeps.length) return false;

  for (let i = 0; i < prevDeps.length; i++) {
    // Standard Object.is comparison (same as React's shallow dependency comparison)
    if (!Object.is(prevDeps[i], nextDeps[i])) {
      return false;
    }
  }
  return true;
}

export function useCustomMemo(cb, deps) {
  // Store previous value and dependencies in a ref across re-renders
  const memoRef = useRef(null);

  // 1. Initial run: No previous ref state exists
  // 2. Subsequent runs: Dependency array has changed
  if (!memoRef.current || !areEqual(memoRef.current.deps, deps)) {
    memoRef.current = {
      value: cb(),
      deps: deps,
    };
  }

  // Cleanup reference for component unmount
  useEffect(() => {
    return () => {
      memoRef.current = null;
    };
  }, []);

  return memoRef.current.value;
}

```

---

### Low-Level React Core Simulation (Without Hooks)

To see how React internally manages `useMemo` via an internal fiber hook pointer array:

```javascript
let hookStates = [];
let hookIndex = 0;

function customUseMemo(cb, deps) {
  const currentIndex = hookIndex;
  const prevHook = hookStates[currentIndex];

  let hasChanged = true;

  if (prevHook) {
    hasChanged = !areEqual(prevHook.deps, deps);
  }

  if (hasChanged) {
    const newValue = cb();
    hookStates[currentIndex] = { value: newValue, deps };
    hookIndex++;
    return newValue;
  }

  hookIndex++;
  return prevHook.value;
}

// Reset the cursor before each component render pass
function renderComponent(Component) {
  hookIndex = 0;
  return Component();
}

```

---

### Usage Example

```jsx
import React, { useState } from 'react';
import { useCustomMemo } from './useCustomMemo';

export const Demo = () => {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(false);

  // Re-runs only when `count` changes
  const squaredValue = useCustomMemo(() => {
    console.log('Computing expensive square...');
    return count * count;
  }, [count]);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Squared Value: {squaredValue}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment Count</button>
      <button onClick={() => setOtherState(s => !s)}>Toggle Other State</button>
    </div>
  );
};

```

---

### Key Mechanics

* **`useRef` Persistence**: Holds data across component renders without triggering unnecessary re-renders when mutated.
* **`Object.is` Shallow Comparison**: Accurately handles edge cases like `NaN === NaN` (`true`) and `-0 === +0` (`false`).
* **Cache Invalidation**: Re-evaluates `cb()` only when `deps` is missing, changes size, or encounters a modified reference/value.

React's `useMemo` solves a fundamental performance problem: avoiding expensive recalculations on every component render when inputs have not changed.

---

### Core Mechanics of `useMemo`

`useMemo` follows a cache-invalidation cycle:

1. **First Render (Mount):** Invokes the factory function `cb()`, saves the resulting value along with its dependency array `deps`, and returns the computed value.
2. **Subsequent Renders (Update):** Compares the previous dependency array with the current one element-by-element using shallow comparison (`Object.is`).

* **Dependencies Unchanged:** Skips `cb()` entirely and returns the cached `value`.
* **Dependencies Changed:** Calls `cb()`, updates the stored cache with the new `value` and `deps`, and returns the new value.

---

### Step-by-Step Breakdown of the Implementation

**1. Dependency Comparison (`areEqual`)**

React uses the `Object.is` algorithm to perform shallow dependency checks:

```javascript
function areEqual(prevDeps, nextDeps) {
  // Identity check
  if (prevDeps === nextDeps) return true;

  // Handle undefined/null or mismatched array lengths
  if (!prevDeps || !nextDeps || prevDeps.length !== nextDeps.length) return false;

  for (let i = 0; i < prevDeps.length; i++) {
    // Object.is handles NaN and signed zeros (+0 vs -0) correctly
    if (!Object.is(prevDeps[i], nextDeps[i])) {
      return false;
    }
  }
  return true;
}

```

* **Why not `===`?** `NaN === NaN` is `false`, which would cause infinite re-evaluations if `NaN` appears in dependencies. `Object.is(NaN, NaN)` correctly returns `true`.

---

**2. Persisting State Across Renders with `useRef**`

A custom hook needs to preserve values across render cycles without causing infinite render loops:

* `useState`: Causes a component re-render when its setter is called.
* `useRef`: Retains mutable data across render cycles without triggering a re-render.

```javascript
export function useCustomMemo(cb, deps) {
  const memoRef = useRef(null);

  // Check if it's the first run OR if dependencies changed
  if (!memoRef.current || !areEqual(memoRef.current.deps, deps)) {
    memoRef.current = {
      value: cb(),
      deps: deps,
    };
  }

  return memoRef.current.value;
}

```

---

### Comparison: React Core Internal Pointer Model vs. `useRef`

| Feature                | React Core (`FiberNode.memoizedState`)                    | `useRef` Polyfill                                 |
| ---------------------- | --------------------------------------------------------- | ------------------------------------------------- |
| **Storage**            | Linked list of Hook objects on Fiber                      | Stored in React's built-in `ref` cell             |
| **Index Pointer**      | WorkInProgress hook cursor advances per hook call         | Managed independently per component ref instance  |
| **Dependency Missing** | Recalculates every single render if `deps` is `undefined` | Matches behavior via `!areEqual(null, undefined)` |

---

### How `useCallback` Relates to `useMemo`

`useCallback(fn, deps)` is syntactic sugar for `useMemo(() => fn, deps)`. Instead of storing the *result* of calling the function, it stores and returns the *function definition itself*:

```javascript
export function useCustomCallback(fn, deps) {
  return useCustomMemo(() => fn, deps);
}

```
