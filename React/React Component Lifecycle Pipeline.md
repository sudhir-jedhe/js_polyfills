***  React Component Lifecycle Pipeline.md ***

In React, a component follows a continuous lifecycle and execution pipeline: **Trigger $\rightarrow$ Render $\rightarrow$ Commit $\rightarrow$ Effect $\rightarrow$ Cleanup/Unmount**.

Understanding this workflow clarifies how data flows, when state updates happen, and how React synchronizes with the DOM.

---

### The React Component Lifecycle Pipeline

```
 [1. Trigger]        [2. Render Phase]          [3. Commit Phase]         [4. Effects Phase]
  - Initial Mount  ──► - Execute Function Body ──► - Mutate Real DOM  ──► - Run useEffect
  - State Change       - Generate JSX/VDOM        - Update Refs             - Run Side Effects
  - Prop Change        - Diffing (Reconciliation) - Update Screen Paint     - Setup Listeners
  - Parent Re-render

```

---

### Step-by-Step Execution Phases

| Phase                        | What Happens                                                                                                                       | Purity & Rules                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| **1. Trigger**               | React schedules a render pass due to initial mounting, a `setState` call, context update, or parent re-rendering.                  | Asynchronous / batched.                                                   |
| **2. Render**                | React invokes the component function to produce Virtual DOM (JSX elements) and performs reconciliation (diffing old vs. new VDOM). | **Must be pure**: No side effects, no direct DOM mutations, no API calls. |
| **3. Commit**                | React applies the calculated differences (diffs) to the actual browser DOM and updates layout.                                     | Synchronous.                                                              |
| **4. Paint**                 | The browser repaints the screen with the new DOM nodes.                                                                            | User sees the updated UI.                                                 |
| **5. Effects (`useEffect`)** | React runs side-effect callbacks (fetching data, subscriptions, analytics) after the screen is painted.                            | Runs asynchronously after paint to prevent blocking UI responsiveness.    |
| **6. Cleanup / Unmount**     | React runs effect cleanup functions when dependencies change or when the component is removed from the DOM.                        | Cancels subscriptions, clears timers, aborts requests.                    |

---

### Mental Model in Code

Here is how code executes inside a modern React component:

```tsx
import * as React from "react";

interface UserProfileProps {
  userId: string;
}

export function UserProfile({ userId }: UserProfileProps) {
  // --------------------------------------------------------------------------
  // 1. RENDER PHASE (Executes on every render)
  // --------------------------------------------------------------------------
  const [data, setData] = React.useState<{ name: string } | null>(null);
  const [count, setCount] = React.useState(0);

  // Pure calculations derived during render:
  const doubleCount = count * 2; 

  // --------------------------------------------------------------------------
  // 2. EFFECTS PHASE (Executes AFTER commit & browser paint)
  // --------------------------------------------------------------------------
  React.useEffect(() => {
    const controller = new AbortController();

    async function loadData() {
      try {
        const res = await fetch(`/api/users/${userId}`, {
          signal: controller.signal,
        });
        const json = await res.json();
        // Triggers a new render cycle with updated state:
        setData(json);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Failed to load user:", err);
        }
      }
    }

    loadData();

    // ------------------------------------------------------------------------
    // 3. CLEANUP PHASE (Runs before re-running effect or when unmounting)
    // ------------------------------------------------------------------------
    return () => {
      controller.abort(); // Cancel ongoing request
    };
  }, [userId]); // Dependency array controls effect execution

  // --------------------------------------------------------------------------
  // 4. JSX RETURN (Virtual DOM representation)
  // --------------------------------------------------------------------------
  return (
    <div className="p-4 rounded-xl border border-slate-200">
      <h2 className="text-lg font-bold">{data ? data.name : "Loading..."}</h2>
      <p className="text-sm text-slate-500">Count: {count} (Doubled: {doubleCount})</p>
      <button
        onClick={() => setCount((prev) => prev + 1)} // Triggers next render pass
        className="mt-2 px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs"
      >
        Increment
      </button>
    </div>
  );
}

```

---

### Data Flow Principles in React

* **Unidirectional Data Flow:** Data travels strictly downward from parent to child via `props`.
* **State Lifts Up:** If sibling components require access to shared state, the state is hoisted to their common ancestor.
* **Events Bubble Up:** Children communicate state modifications back to parents via event callbacks (e.g., `onSelect`, `onChange`).
* **Automatic Batching:** In React 18 and newer, multiple state updates inside event handlers, `setTimeout`, or `async/await` calls are batched into a single render pass to optimize performance.

---

### Common Hook Execution Flow

```
Render Function Starts
  │
  ├─► useState / useReducer (Reads current state values)
  ├─► useMemo (Calculates memoized derivations if dependencies changed)
  ├─► useCallback (Returns memoized function references)
  │
Return JSX (Produces VDOM)
  │
DOM Mutation & Commit
  │
  ├─► useLayoutEffect (Runs synchronously BEFORE browser repaints screen)
  │
Browser Screen Repaint
  │
  └─► useEffect (Runs asynchronously AFTER browser repaints screen)

```
