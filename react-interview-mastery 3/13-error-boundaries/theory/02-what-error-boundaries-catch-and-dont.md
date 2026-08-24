# What Error Boundaries Catch (and Don't)

## What error boundaries catch

- Errors thrown during **rendering** of any component in the subtree below the boundary.
- Errors thrown in **lifecycle methods** (`componentDidMount`, `componentDidUpdate`, etc.) of descendant components.
- Errors thrown in the **constructors** of components in the tree below the boundary.

```jsx
function Buggy() {
  const data = null;
  return <p>{data.name}</p>; // throws TypeError during render — CAUGHT
}
```

## What error boundaries do NOT catch

- **Event handlers.** A `throw` inside `onClick`/`onChange`/etc. does not trigger the boundary — it's just a normal uncaught JS exception in that callback's execution context. Handle these with a regular `try/catch` inside the handler.

```jsx
function Buggy() {
  function handleClick() {
    throw new Error('oops'); // NOT caught by any error boundary
  }
  return <button onClick={handleClick}>Click</button>;
}
```

- **Asynchronous code.** Errors in `setTimeout`, promises, `async/await`, or any code that runs outside React's render call stack are not caught, because by the time the async callback runs, React is no longer "inside" the render it could attribute the error to.

```jsx
useEffect(() => {
  fetchData().catch(err => {
    // must handle manually — an error boundary will NOT catch this
    setError(err);
  });
}, []);
```

- **Server-side rendering (SSR).** Error boundaries only work in the client-rendering path; errors during SSR need separate handling (e.g., try/catch around `renderToString`/`renderToPipeableStream`).

- **Errors thrown inside the error boundary component itself.** A boundary can't catch its own errors — if `FallbackUI` itself throws, you need a *parent* boundary above it to catch that.

## Error boundaries vs `try/catch`

| Aspect | Error Boundary | `try/catch` |
|---|---|---|
| Scope | Catches render/lifecycle/constructor errors in the *entire subtree* below it, declaratively | Catches errors only in the exact synchronous block it wraps, wherever you write it |
| Handles async/event errors? | No | Yes — works for any synchronous or `await`ed code inside the try block, including event handlers |
| Common mistake | Assuming a boundary covers event handlers or promises too (it doesn't) | Wrapping every single component's render logic manually instead of using a boundary for broad, declarative coverage |

Use error boundaries for render-time crash containment across a subtree; use `try/catch` for expected, localized failures in event handlers and async code (network calls, parsing, etc.).

For async errors specifically, a common bridging technique is to catch the rejection, store it in state, then re-throw it synchronously during the next render (`if (error) throw error;`) — the nearest error boundary then catches this re-thrown error normally, giving async failures the same declarative fallback/retry UX as render errors. This is exactly what `react-error-boundary`'s `useErrorHandler` hook does under the hood.
