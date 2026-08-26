# Error Boundary Wrapping Suspense to Catch Failed Chunk Loads

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <p>
          Something failed to load.{" "}
          <button onClick={() => this.setState({ hasError: false })}>Retry</button>
        </p>
      );
    }
    return this.props.children;
  }
}

const Widget = React.lazy(() => import("./Widget"));

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<p>Loading...</p>}>
        <Widget />
      </Suspense>
    </ErrorBoundary>
  );
}
```
