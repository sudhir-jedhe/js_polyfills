# A Deploy Breaks Lazy-Loaded Chunks for Users with Old Tabs Open

After a new deploy, users who had the app open in a browser tab before the deploy get a hard crash when they navigate to a lazily-loaded route, because the old chunk filename (with its content hash) no longer exists on the server.

**Approach:** This is a chunk-loading error, not a "not ready yet" state, so it needs an error boundary above the Suspense boundary. The recovery action should be a hard reload (to fetch the new app shell and asset manifest), not just "try again," since the client-side module reference is permanently broken.

```jsx
class ChunkErrorBoundary extends React.Component {
  state = { failed: false };

  static getDerivedStateFromError(error) {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div>
          <p>A new version of the app is available.</p>
          <button onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppRoutes() {
  return (
    <ChunkErrorBoundary>
      <Suspense fallback={<PageSkeleton />}>
        <Router />
      </Suspense>
    </ChunkErrorBoundary>
  );
}
```

A full reload gets the user a fresh `index.html` with correct chunk references, resolving the mismatch that a component-level retry can't fix.
