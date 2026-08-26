# Problem 3: Implement a `withErrorBoundary(Component)` HOC

Wraps a component in a class-based error boundary. Error boundaries must be class components — `static getDerivedStateFromError` and `componentDidCatch` have no hook equivalent — so this is one of the few cases where reaching for a HOC (rather than a hook) is still the right call today. See `13-error-boundaries` for the full treatment of error boundary mechanics.

```jsx
import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  // Called during the render phase after a descendant throws — used to
  // update state so the next render shows the fallback UI.
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // Called during the commit phase — used for side effects like logging,
  // never for computing render output.
  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    } else {
      console.error('Uncaught error in component tree:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }
      return (
        <div className="error-boundary-fallback">
          <p>Something went wrong.</p>
          <button onClick={this.handleReset}>Try again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function withErrorBoundary(WrappedComponent, options = {}) {
  function WithErrorBoundary(props) {
    return (
      <ErrorBoundary fallback={options.fallback} onError={options.onError}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  }

  WithErrorBoundary.displayName = `withErrorBoundary(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithErrorBoundary;
}
```

## Usage

```jsx
function ProductWidget({ productId }) {
  const product = getProductSync(productId); // throws if productId is invalid
  return <p>{product.name}</p>;
}

const SafeProductWidget = withErrorBoundary(ProductWidget, {
  fallback: (error, reset) => (
    <div className="widget-error">
      <p>Couldn't load this product: {error.message}</p>
      <button onClick={reset}>Retry</button>
    </div>
  ),
  onError: (error, errorInfo) => {
    reportToErrorTrackingService(error, errorInfo);
  },
});

function ProductGrid({ productIds }) {
  return (
    <div className="grid">
      {productIds.map((id) => (
        <SafeProductWidget key={id} productId={id} />
      ))}
    </div>
  );
}
```

## Why this has to be a HOC (or at least a class boundary) rather than a hook

There is no `useErrorBoundary` hook in React — catching a render-phase error thrown by a descendant component requires `static getDerivedStateFromError` (updates state synchronously during the render phase, before the broken subtree commits) and `componentDidCatch` (fires during the commit phase for logging/side effects), both of which are class lifecycle methods with no functional-component equivalent. `withErrorBoundary` packages the mandatory class boundary into a reusable function so consumers never have to write `class ... extends Component` themselves — they get the ergonomics of a normal function-component-style enhancer while the actual error-catching mechanics live in the one `ErrorBoundary` class underneath.

## Isolating failures per-widget, not per-page

Notice each `SafeProductWidget` in `ProductGrid` gets its *own* `ErrorBoundary` instance (because `withErrorBoundary` wraps each render individually). This means one product failing to render only replaces that single widget with its fallback — it does not take down the entire grid, which is what would happen if a single `ErrorBoundary` wrapped the whole `ProductGrid` instead. This granularity (per-widget vs per-page boundaries) is a key design decision when placing error boundaries, covered further in `13-error-boundaries`.
