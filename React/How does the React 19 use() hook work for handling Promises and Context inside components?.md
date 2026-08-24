In React 19, **`use()`** is a first-class React API that lets you read the value of a resource—specifically a **Promise** or a **Context**—directly within render.

Unlike standard React hooks (`useState`, `useEffect`, `useContext`), **`use()` can be called conditionally** inside `if` statements, loops, and after early returns.

---

### Core Comparison: `use()` vs. Traditional Hooks

| Dimension                             | `use(Context)` | `useContext(Context)` | `use(Promise)` | Standard `useEffect` + `useState`  |
| ------------------------------------- | -------------- | --------------------- | -------------- | ---------------------------------- |
| **Allowed in Conditionals / Loops?**  | **Yes**        | No                    | **Yes**        | No                                 |
| **Integration with `<Suspense>**`     | N/A            | N/A                   | **Automatic**  | Manual boilerplate                 |
| **Integration with Error Boundaries** | N/A            | N/A                   | **Automatic**  | Requires manual `catch`            |
| **Boilerplate**                       | 1 line         | 1 line                | 1 line         | 15+ lines (state, effect, cleanup) |

---

### 1. Handling Promises with `use(Promise)`

When passed a Promise, `use()` intercepts the promise state and coordinates automatically with the nearest `<Suspense>` and `ErrorBoundary` components:

* **Pending:** `use()` suspends the component, triggering the nearest `<Suspense fallback="{...}">`.
* **Fulfilled:** `use()` unwraps the Promise and returns the resolved value synchronously to the component.
* **Rejected:** `use()` throws the rejection error to the nearest `<ErrorBoundary>`.

#### Basic Example with `<Suspense>`

```jsx
import { use, Suspense } from 'react';

// A component that reads an active Promise directly
function UserProfile({ userPromise }) {
  // Unwraps the resolved data directly; suspends while pending
  const user = use(userPromise);

  return (
    <div className="profile-card">
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
    </div>
  );
}

// Parent component managing the Promise and boundaries
export function App() {
  // Pass the promise down as a prop (or create in a cached resource layer)
  const userPromise = fetchUser(101);

  return (
    <Suspense fallback={<div className="skeleton">Loading profile...</div>}>
      <UserProfile userPromise={userPromise} />
    </Suspense>
  );
}

```

---

### 2. Conditional Promise Reading

Because `use()` is an API rather than a rigid hook, you can call it inside `if` statements to conditionally bypass network requests or unnecessary work.

```jsx
import { use } from 'react';

function Dashboard({ commentsPromise, shouldShowComments }) {
  if (!shouldShowComments) {
    return <div>Comments are hidden.</div>;
  }

  // Valid in React 19: Calling `use` conditionally
  const comments = use(commentsPromise);

  return (
    <ul>
      {comments.map((c) => (
        <li key={c.id}>{c.text}</li>
      ))}
    </ul>
  );
}

```

---

### 3. Reading Context with `use(Context)`

`use(ThemeContext)` serves as a direct, flexible replacement for `useContext(ThemeContext)`. Its primary advantage is that it can also be used inside conditional logic.

```jsx
import { use, createContext } from 'react';

const ThemeContext = createContext('light');

function Panel({ showCustomTheme }) {
  let theme = 'default';

  if (showCustomTheme) {
    // Valid: Read context only when a condition is met
    theme = use(ThemeContext);
  }

  return <div className={`panel-${theme}`}>Panel Content</div>;
}

```

---

### Critical Rule: Promise Caching

`use()` does **not** create or memoize Promises. If you create a new Promise directly inside a component body on every render, `use()` will trigger an infinite re-render loop:

```jsx
// ❌ WRONG: Creates a new Promise reference on every single render
function BadComponent() {
  const data = use(fetch('/api/data').then(res => res.json())); 
  return <div>{data.title}</div>;
}

```

#### Proper Patterns for Creating Promises

1. **Pass from Server Components (RSC):** In full-stack frameworks (Next.js, etc.), pass Promises created on the server directly down to Client Components as props.
2. **Global / Module-level Data Stores:** Use a query cache (e.g., TanStack Query, cached fetch).
3. **Memoize with `useMemo` / React `cache()`:**

```jsx
function GoodComponent({ id }) {
  const dataPromise = useMemo(() => fetchItem(id), [id]);
  const data = use(dataPromise);
  return <div>{data.title}</div>;
}

```
