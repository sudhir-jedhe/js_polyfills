# Scenario: Every Page Is Wrapped in `withAuth(withTheme(withAnalytics(PageComponent)))`

You inherit a codebase where every page component is wrapped like `withAuth(withTheme(withAnalytics(PageComponent)))`. A new engineer says the DevTools component tree is confusing and prop flow is hard to trace. How do you modernize this without a risky big-bang rewrite?

**Approach:** Migrate incrementally, one HOC at a time, starting with the least risky (analytics is a good first candidate since it's usually side-effect-only, not gating render).

```jsx
// Before: the analytics HOC injects nothing into render, just fires an effect
function withAnalytics(Wrapped) {
  return function WithAnalytics(props) {
    useEffect(() => { trackPageView(); }, []);
    return <Wrapped {...props} />;
  };
}

// After: extract to a hook, call it directly inside PageComponent (or a shared layout)
function useAnalytics() {
  useEffect(() => { trackPageView(); }, []);
}

function PageComponent(props) {
  useAnalytics();
  // ...rest of component, now one fewer wrapper in the tree
}
```

Repeat for `withTheme` (becomes `useTheme()` reading from context) and `withAuth` (becomes `useAuth()` plus an inline redirect/guard, or a `<ProtectedRoute>` wrapper at the routing layer instead of per-page). Do this page-by-page behind normal code review rather than a single sweeping refactor, since each HOC removal is independently testable and low-risk in isolation.
