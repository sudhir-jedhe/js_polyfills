# Error Boundary That Logs via `componentDidCatch`

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error('Caught by boundary:', error, info.componentStack);
  }
  render() {
    return this.state.hasError ? <p>Error!</p> : this.props.children;
  }
}
```
