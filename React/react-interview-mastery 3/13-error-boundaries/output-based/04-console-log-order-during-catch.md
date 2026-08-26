# Which Console Logs Appear, and in What Order, When `Buggy` Throws During Render?

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError(error) {
    console.log('getDerivedStateFromError');
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.log('componentDidCatch');
  }
  render() {
    console.log('ErrorBoundary render, hasError =', this.state.hasError);
    return this.state.hasError ? <p>Fallback</p> : this.props.children;
  }
}
function Buggy() {
  console.log('Buggy render');
  throw new Error('boom');
}
```

**Answer:** `"ErrorBoundary render, hasError = false"`, `"Buggy render"`, `"getDerivedStateFromError"`, `"ErrorBoundary render, hasError = true"`, `"componentDidCatch"`.

**Why:** React first renders normally until `Buggy` throws. `getDerivedStateFromError` (a static, render-phase method) runs first to compute the new state, causing `ErrorBoundary` to re-render with the fallback. Only after the fallback has been committed does `componentDidCatch` (a commit-phase method, safe for side effects like logging) run.
