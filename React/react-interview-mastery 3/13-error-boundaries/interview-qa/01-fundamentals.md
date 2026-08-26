# Interview Q&A: Fundamentals

**Q: What is an error boundary and what problem does it solve?**
It's a component that catches JavaScript errors thrown during rendering anywhere in its child subtree, and shows a fallback UI instead of letting the error unmount the entire application. Without one, React 16+ unmounts the whole component tree on any uncaught render error, producing a blank white screen.

**Q: Why must error boundaries be class components?**
They rely on `static getDerivedStateFromError(error)` and `componentDidCatch(error, info)`, two lifecycle methods that only exist on class components. There is no hook equivalent — React hasn't shipped a `useErrorBoundary`-style hook, making this one of the last remaining cases where a class component is required in idiomatic modern React.

**Q: What's the difference between `getDerivedStateFromError` and `componentDidCatch`?**
`getDerivedStateFromError` runs during the render phase, must be pure, and returns the state update used to render the fallback UI. `componentDidCatch` runs during the commit phase, after the fallback has already rendered, and is where you perform side effects like logging the error to a monitoring service.

**Q: List the categories of errors an error boundary catches.**
Errors thrown during rendering, in lifecycle methods (e.g., `componentDidMount`), and in constructors of any component in the tree below the boundary.

**Q: List the categories of errors an error boundary does NOT catch, and how you'd handle each instead.**
Event handler errors (handle with `try/catch` inside the handler), asynchronous errors like rejected promises or `setTimeout` callbacks (catch manually and convert to state, optionally re-throw during render to funnel into a boundary), server-side rendering errors (handle separately around the SSR render call), and errors thrown by the boundary component itself (requires a separate parent boundary).

**Q: Can an error boundary catch an error thrown by its own fallback UI?**
No. A boundary cannot catch errors it produces itself, including errors in its fallback render path — that requires a different, ancestor error boundary above it. This is why fallback components should be kept minimal and not depend on the same state/context that may have caused the original crash.

**Q: What does `componentDidCatch`'s second argument, `errorInfo`, contain, and what's it used for?**
It contains a `componentStack` string showing which component in the tree threw the error, which is invaluable for logging/debugging in production since minified stack traces alone often aren't enough to locate the failing component.
