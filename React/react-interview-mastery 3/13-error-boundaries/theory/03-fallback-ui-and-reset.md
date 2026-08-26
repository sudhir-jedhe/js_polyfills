# Fallback UI Patterns and Resetting

Keep fallback UI simple and self-contained (don't rely on the same data/context that may have caused the crash — remember, a boundary can't catch errors thrown by its own fallback). Common patterns: a static "Something went wrong" message with a reload button, a "Try again" button that resets the boundary's state, or a more specific per-section message ("Couldn't load your recent orders") that doesn't take down the whole page.

```jsx
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  handleReset = () => this.setState({ hasError: false });
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <p>Something went wrong.</p>
          <button onClick={this.handleReset}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}
```

## The "Try Again" pitfall

Add a method that resets `hasError` to `false` via `setState`, which re-renders the (previously failing) children fresh. The pitfall: if the failure is deterministic (bad data, not a transient issue), simply resetting state and re-rendering the same children with the same bad input will throw again immediately.

A real fix often needs to also change the underlying input:

- refetch data,
- reset a `key` prop to force a full remount of the subtree,
- or navigate the user elsewhere.

"Try again" only re-renders the children — it doesn't magically fix bad state, a broken response shape, or a persistent bug. It's most useful for transient issues (a flaky network blip, a third-party script that failed to load once) rather than deterministic bugs.
