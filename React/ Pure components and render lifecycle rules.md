In React, the **render phase must always be a pure calculation**.

A component is pure when it acts like a mathematical function: given the exact same inputs (props, state, and context), it will **always return the exact same JSX**, without modifying any pre-existing variables or objects outside its own scope.

---

### The Core Rule of React Rendering

> **Components must be idempotent:** Rendering can be called multiple times, aborted midway, or executed in parallel (Concurrent Mode) without changing the state of the system or producing observable side effects.

```
Props + State + Context ──▶ [ Pure Calculation ] ──▶ Returns JSX Elements

```

---

### The Rules of Pure Rendering

#### 1. Mind Your Own Business (No External Mutations)

A component should never mutate variables, objects, or arrays that existed before the render call started.

```tsx
// ❌ IMPURE: Mutates a variable outside the component
let renderCount = 0;
function Header({ title }: { title: string }) {
  renderCount++; // Side effect!
  return <h1>{title} (Rendered {renderCount} times)</h1>;
}

// ❌ IMPURE: Mutates incoming props
function UserList({ users }: { users: User[] }) {
  users.push({ id: 'guest', name: 'Guest' }); // Mutates parent's array!
  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

// ✅ PURE: Local mutations created WITHIN the render are completely fine
function UserListPure({ users }: { users: User[] }) {
  const localUsers = [...users, { id: 'guest', name: 'Guest' }]; // Fresh array
  return <ul>{localUsers.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}

```

#### 2. Same Inputs, Same Output (Deterministic Calculation)

Given identical props, state, and context, the component must render identical JSX.

* **Never generate random values in render:** Calling `Math.random()`, `crypto.randomUUID()`, or `Date.now()` during render produces hydration mismatches and non-deterministic trees. Use `useId()` for stable IDs or pass timestamps as props.
* **Never read non-reactive browser state during render:** Reading `window.innerWidth`, `document.cookie`, or `localStorage` during render breaks determinism across environments (SSR vs Client).

#### 3. No Side Effects in the Component Body

The body of your component function should only calculate JSX. Side effects belong strictly in **Event Handlers** (e.g., `onClick`, `onSubmit`) or **Effects** (`useEffect`).

```tsx
function BadProfile({ userId }: { userId: string }) {
  // ❌ IMPURE: Network requests and DOM writes directly in render body
  fetch(`/api/user/${userId}`);
  document.title = 'Profile Page';

  return <div>Profile</div>;
}

function GoodProfile({ userId }: { userId: string }) {
  // ✅ PURE: Side effects delegated to useEffect
  useEffect(() => {
    document.title = 'Profile Page';
  }, []);

  return <div>Profile</div>;
}

```

---

### Pure Components vs. Memoization (`React.memo`)

In React, the term **Pure Component** refers to both the mathematical purity of the render function and the performance optimization technique of skipping renders when props have not changed.

* **Class Components:** `React.PureComponent` implemented a shallow comparison of `props` and `state` inside `shouldComponentUpdate`.
* **Functional Components:** `React.memo(Component)` performs a shallow comparison of current vs. previous props:

```tsx
import React, { memo } from 'react';

interface CardProps {
  title: string;
  count: number;
}

export const MetricCard = memo(function MetricCard({ title, count }: CardProps) {
  return (
    <div className="metric-box">
      <h3>{title}</h3>
      <p>{count}</p>
    </div>
  );
});

```

* If `props.title === prevProps.title` and `props.count === prevProps.count`, React skips executing `MetricCard` entirely and reuses the previous rendered output.
* *Note:* `React.memo` only works reliably if the component adheres to the **pure rendering rules** above.

---

### Summary: What Belongs Where

| Code Action                                  | Render Body          | Event Handler (`onClick`) | `useEffect` |
| -------------------------------------------- | -------------------- | ------------------------- | ----------- |
| **Calculate JSX markup**                     | ✅ Yes                | ❌ No                      | ❌ No        |
| **Transform / Filter data**                  | ✅ Yes                | ❌ No                      | ❌ No        |
| **Mutate local variables created in render** | ✅ Yes                | ✅ Yes                     | ✅ Yes       |
| **Mutate external / global variables**       | ❌ **Forbidden**      | ✅ Yes                     | ✅ Yes       |
| **Update React State (`setState`)**          | ⚠️ *Conditional only* | ✅ Yes                     | ✅ Yes       |
| **Fetch data / Network calls**               | ❌ **Forbidden**      | ✅ Yes                     | ✅ Yes       |
| **Attach DOM / Browser listeners**           | ❌ **Forbidden**      | ❌ No                      | ✅ Yes       |
