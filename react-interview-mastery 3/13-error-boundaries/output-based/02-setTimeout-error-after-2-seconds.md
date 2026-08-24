# What Renders After 2 Seconds?

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? <p>Fallback</p> : this.props.children;
  }
}
function Delayed() {
  useEffect(() => {
    setTimeout(() => {
      throw new Error('async boom');
    }, 2000);
  }, []);
  return <p>Loaded</p>;
}
function App() {
  return (
    <ErrorBoundary>
      <Delayed />
    </ErrorBoundary>
  );
}
```

**Answer:** `<p>Loaded</p>` stays on screen; the thrown error appears as an unhandled exception in the console, and the fallback UI never shows.

**Why:** `setTimeout`'s callback runs outside React's render call stack entirely — by the time it executes, React has already finished rendering and moved on, so there's no render/commit context for the boundary to intercept. Async errors must be caught manually (e.g., `try/catch` inside the timeout callback, then call `setState` to surface an error in your own UI).
