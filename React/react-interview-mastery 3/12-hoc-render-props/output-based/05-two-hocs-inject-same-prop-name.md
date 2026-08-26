# Output-Based: Two HOCs Both Inject a Prop Called `status`. What Does the Button Show?

```jsx
function withAuthStatus(Wrapped) {
  return (props) => <Wrapped {...props} status="authenticated" />;
}
function withNetworkStatus(Wrapped) {
  return (props) => <Wrapped {...props} status="offline" />;
}
const Display = ({ status }) => <p>{status}</p>;
const Enhanced = withAuthStatus(withNetworkStatus(Display));
```
**Answer:** `"offline"` — the innermost HOC's value wins.

**Why:** `Enhanced` renders `<WithNetworkStatus {...props} status="authenticated" />` (the outer `withAuthStatus` wrapper spreads its incoming props, then sets `status="authenticated"` after — that attribute order means "authenticated" wins *at that layer*). `WithNetworkStatus` then receives `status: "authenticated"` as an incoming prop, but its own JSX is `<Display {...props} status="offline" />` — it spreads the incoming props (including the "authenticated" it just received) and then overwrites `status` with its own hardcoded `"offline"` *after* the spread. Since explicit attributes placed after a spread always win in JSX, the innermost wrapper's hardcoded value overrides whatever the outer wrapper injected. This ordering-dependent, silent overwrite is exactly the naming-collision problem hooks avoid — the "winner" depends on wrapper nesting order and where each HOC places its attribute relative to its spread, which is easy to get backwards and has no compile-time warning.
