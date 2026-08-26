# Error Boundary Basics

## What an error boundary is

An error boundary is a component that catches JavaScript errors thrown anywhere in its child component tree during rendering, logs them, and renders a fallback UI instead of letting the error propagate up and unmount the entire app. Without one, an uncaught render error anywhere blanks the whole page — React unmounts the entire tree by default since React 16.

## Must be a class component

Error boundaries require two APIs that only exist as class lifecycle methods — **there is no hook equivalent**, making this one of the few remaining cases where you must write a class in modern React.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // called during the "render" phase — must be pure, update state only
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // called during the "commit" phase — safe for side effects (logging)
    logErrorToService(error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <FallbackUI error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

`getDerivedStateFromError` is used to compute the fallback state (pure, no side effects allowed); `componentDidCatch` is used to *react* to the error — logging to Sentry/Datadog, sending analytics, etc. You typically implement both: the first for the fallback render, the second for reporting.

## `getDerivedStateFromError` vs `componentDidCatch`

| Aspect | `getDerivedStateFromError` | `componentDidCatch` |
|---|---|---|
| Phase | Render phase (static method, must be pure) | Commit phase (instance method, side effects allowed) |
| Purpose | Compute new state to trigger the fallback UI | React to the error — logging, analytics, reporting to an error-tracking service |
| Common mistake | Doing side effects (network calls, logging) inside it, which can run multiple times or in concurrent-rendering edge cases since it's meant to be pure | Relying on it alone to set fallback state — it doesn't return state, so you still need `getDerivedStateFromError` (or `setState` inside it) to actually change what renders |

Use both together: `getDerivedStateFromError` to flip a `hasError` flag for rendering, `componentDidCatch` to send the error details somewhere.

`componentDidCatch`'s second argument, `errorInfo`, contains a `componentStack` string showing which component in the tree threw the error, which is invaluable for logging/debugging in production since minified stack traces alone often aren't enough to locate the failing component.
