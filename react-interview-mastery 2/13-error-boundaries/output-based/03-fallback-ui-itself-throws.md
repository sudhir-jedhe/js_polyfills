# What Happens if `FallbackUI` Itself Throws?

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return <FallbackUI />;
    return this.props.children;
  }
}
function FallbackUI() {
  const config = null;
  return <p>{config.message}</p>; // throws
}
function App() {
  return (
    <ErrorBoundary>
      <Buggy />
    </ErrorBoundary>
  );
}
```

**Answer:** The app crashes with no fallback shown at all (assuming no boundary wraps `<App>` itself) — React unmounts the whole tree.

**Why:** An error boundary cannot catch an error thrown by itself (including its own fallback render path). Catching that requires a *separate, parent* boundary above this one. This is why fallback components should be kept extremely simple and defensive — ideally with no dependency on the same data/context that might have caused the original crash.
