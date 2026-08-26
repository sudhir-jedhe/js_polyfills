# Resettable Boundary With a "Try Again" Button

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  reset = () => this.setState({ hasError: false });
  render() {
    if (this.state.hasError) {
      return <button onClick={this.reset}>Try again</button>;
    }
    return this.props.children;
  }
}
```
