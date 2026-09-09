***  05-hydration-mismatch-flicker.md ***

# Server-Rendered Markup Mismatches Client Render, Causing a Console Warning and Flicker

**Scenario:** You're adding server-side rendering to an existing app, and after hydration you see a "Text content does not match server-rendered HTML" warning along with a visible flash of different content.

**Approach:** Hydration reuses the server-rendered DOM and only attaches event listeners/reconciles against it — it doesn't blindly trust that the client's first render will produce identical output. A common cause is rendering something environment-dependent (like `new Date().toLocaleString()` or `window`-based checks) directly in JSX during the initial render, which differs between server and client:

```jsx
// Bad: differs between server and first client render
function Timestamp() {
  return <span>{new Date().toLocaleTimeString()}</span>;
}

// Better: render a stable placeholder on first pass, fill in client-only value after mount
function Timestamp() {
  const [time, setTime] = React.useState(null);
  React.useEffect(() => {
    setTime(new Date().toLocaleTimeString());
  }, []);
  return <span>{time ?? '--:--:--'}</span>;
}
```

The fix is to keep the first client render's JSX output identical to what the server produced, and defer any environment-specific or non-deterministic content to an effect that runs post-hydration.
