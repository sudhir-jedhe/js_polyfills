The `use` hook is a new API introduced in React 19 that fundamentally changes how you handle asynchronous data inside a component.

In the older `useEffect` pattern, fetching data was treated as an **afterthought** — the component rendered empty, the effect ran, the data fetched, and the component re-rendered. The `use` hook treats asynchronous data as a **blocking requirement** — it pauses the component from rendering until the data is actually ready.

Here is exactly how the two approaches compare in mental model, boilerplate, and execution.

## The Old Way: `useEffect` + State

Historically, fetching data required manual state management. You had to wire together three separate `useState` hooks to track the data, the loading spinner, and any potential errors, and then trigger the network request inside a `useEffect`.

```jsx
// BEFORE REACT 19
import { useState, useEffect } from "react";

export default function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Manually track the loading state
    setIsLoading(true);

    fetch(`/api/users/${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        // 2. Manually set the data
        setUser(data);
        setIsLoading(false);
      })
      .catch((err) => {
        // 3. Manually track the error
        setError(err.message);
        setIsLoading(false);
      });
  }, [userId]); // 4. Manually manage the dependency array

  // 5. Manually render fallback UI
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return <div>Hello, {user.name}</div>;
}
```

## The New Way: The `use` Hook

In React 19, the `use` hook allows you to "unwrap" a Promise directly inside the render body.

You no longer manage the loading or error states manually. Instead, you delegate them to React's native boundary components (`<Suspense>` and `<ErrorBoundary>`).

```jsx
// IN REACT 19
import { use, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

// 1. The component that consumes the data
function UserProfile({ userPromise }) {
  // React pauses rendering here until the Promise resolves.
  // No useState, no useEffect, no dependency arrays.
  const user = use(userPromise);

  return <div>Hello, {user.name}!</div>;
}

// 2. The parent orchestrates the fetching and the fallback UI
export default function App({ userId }) {
  // Create the promise outside of the component that consumes it
  const fetchUser = fetch(`/api/users/${userId}`).then((res) => res.json());

  return (
    <ErrorBoundary fallback={<p>Something went wrong!</p>}>
      <Suspense fallback={<p>Loading user...</p>}>
        {/* Pass the unresolved promise as a prop */}
        <UserProfile userPromise={fetchUser} />
      </Suspense>
    </ErrorBoundary>
  );
}
```

---

## Why `use` is a Massive Upgrade

1. **Eliminates Waterfall Renders:** With `useEffect`, a component has to finish mounting before it can even _start_ fetching its data. If you have nested components doing this, they fetch in a sequence, slowing down your app. With `use`, the Promise is often created by the parent or server before the child even mounts, allowing fetches to run in parallel.
2. **Removes Boilerplate:** You drop the `try/catch/finally` blocks and the `isPending`/`isError` state variables.
3. **Conditionally Callable:** Unlike `useEffect`, `use()` breaks the Rules of Hooks. Because it is technically a function, **you can call it inside `if` statements and loops**.

```jsx
function Bio({ showBio, bioPromise }) {
  // This was completely forbidden with useEffect!
  if (showBio) {
    const bio = use(bioPromise);
    return <p>{bio}</p>;
  }
  return null;
}
```

> **The Major Pitfall:** Notice in the `use` example that the `fetchUser` Promise is created in the parent component and passed down as a prop. **Never create a Promise directly inside the same component where you call `use(Promise)**`. If you do, React will suspend the component, resolve the data, re-render the component, _create a brand-new Promise again_, and get stuck in an infinite loop.

### How does the new use() API replace useContext in React 19, and why is it better?

In React 19, passing a Context object into the new `use()` API does the exact same thing as `useContext`: it reads the current value provided by the nearest Context Provider above it.

The reason `use()` is a massive upgrade is because **it is not technically a Hook**, which means it does not have to follow the strict "Rules of Hooks."

Here is how this single change cleans up your code and improves performance.

## The Superpower: Conditional Context

With `useContext`, you are forced to call the hook at the absolute top level of your component. You cannot put it inside an `if` statement, a `for` loop, or after an early `return`.

This often leads to unnecessary re-renders. If a component is visually hidden (returning `null`), but the Context updates, the component still re-renders because the `useContext` hook is still listening at the top of the file.

```jsx
// BEFORE REACT 19 (Using useContext)
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export default function Sidebar({ isOpen }) {
  // We MUST call this here, even if the sidebar is closed.
  // If the theme changes globally, this hidden sidebar re-renders!
  const theme = useContext(ThemeContext);

  if (!isOpen) {
    return null;
  }

  return <div className={`sidebar ${theme}`}>...</div>;
}
```

Because `use()` is just a function, **you can call it conditionally**. You only subscribe to the Context when you actually need it.

```jsx
// IN REACT 19 (Using use)
import { use } from "react";
import { ThemeContext } from "./ThemeContext";

export default function Sidebar({ isOpen }) {
  // Early return first!
  if (!isOpen) {
    return null;
  }

  // We only read the context if the sidebar is actually open.
  // If isOpen is false, this component completely ignores theme updates.
  const theme = use(ThemeContext);

  return <div className={`sidebar ${theme}`}>...</div>;
}
```

## A Unified Mental Model

The React team introduced `use()` to be the single, universal "unwrapper" of asynchronous or external resources in a component.

Instead of juggling different hooks for different data types, you now have one predictable tool. If you have a Promise (like a network request), you unwrap it with `use(Promise)`. If you have a Context object, you unwrap it with `use(Context)`.

## Bonus: The Provider Upgrade

While you are replacing `useContext` with `use()`, React 19 also introduced a quality-of-life upgrade for how you _provide_ that context.

You no longer need to append `.Provider` to your context wrappers. You can render the Context object directly as a component, which makes your component trees much easier to read.

```jsx
// BEFORE REACT 19
<ThemeContext.Provider value="dark">
  <App />
</ThemeContext.Provider>

// IN REACT 19
<ThemeContext value="dark">
  <App />
</ThemeContext>

```
