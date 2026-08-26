# What Renders When the Button Is Clicked?

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    return this.state.hasError ? <p>Fallback</p> : this.props.children;
  }
}
function Buggy() {
  function handleClick() {
    throw new Error('boom');
  }
  return <button onClick={handleClick}>Click</button>;
}
function App() {
  return (
    <ErrorBoundary>
      <Buggy />
    </ErrorBoundary>
  );
}
```

**Answer:** The error is thrown as an uncaught exception in the console (crashing that event handler's execution); the boundary's fallback UI does **not** appear, and the button remains rendered as-is.

**Why:** Error boundaries only catch errors thrown during React's render/commit/lifecycle phases. An error thrown inside an event handler happens outside that call stack — it's a plain synchronous JS exception in the handler's own execution context, invisible to `getDerivedStateFromError`/`componentDidCatch`.
