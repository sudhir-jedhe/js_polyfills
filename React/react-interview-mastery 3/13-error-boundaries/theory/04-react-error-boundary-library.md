# The `react-error-boundary` Library

The community-standard library wraps the class-component boilerplate in a reusable `<ErrorBoundary>` component with a function-based `FallbackComponent`/`fallbackRender` prop and a built-in `resetErrorBoundary` callback, plus a `useErrorHandler`/`useErrorBoundary` hook for triggering the nearest boundary from event handlers or async code (by re-throwing into render on the next tick). Conceptually it's the class-component pattern from the basics file, packaged so consumers write only function components.

```jsx
import { ErrorBoundary } from 'react-error-boundary';

function Fallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert">
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Retry</button>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={Fallback} onReset={() => window.location.reload()}>
      <Dashboard />
    </ErrorBoundary>
  );
}
```

## Hand-rolled class boundary vs `react-error-boundary`

| Aspect | Hand-rolled class component | `react-error-boundary` library |
|---|---|---|
| Boilerplate | You write the class, state, both lifecycle methods yourself each time | Provides `<ErrorBoundary>` component + `useErrorHandler` hook, reusable across the app |
| Function-component ergonomics | Fallback UI still needs a separate component; wiring reset logic is manual | `resetErrorBoundary` and `onReset` are built in; `FallbackComponent`/`fallbackRender` props are idiomatic function-component APIs |
| Common mistake | Copy-pasting the same boundary class into multiple files, causing drift when one gets updated and others don't | Forgetting that the library's boundary still can't catch async/event errors either — `useErrorHandler` exists specifically to bridge that gap by re-throwing into render |

Use the library for consistency and less boilerplate in any non-trivial app; hand-roll only for a single, simple, one-off boundary or when avoiding the extra dependency matters.

## Combining reset with async error handling

Catch the async error (e.g., in a `.catch()`), store it in state, then re-throw it synchronously during the next render (`if (error) throw error;`). The nearest error boundary catches this re-thrown error normally; its `resetErrorBoundary`/reset callback can then clear that error state before remounting children, giving async failures the same declarative fallback/retry UX as render errors.
