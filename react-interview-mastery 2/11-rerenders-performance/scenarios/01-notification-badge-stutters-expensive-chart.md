# Scenario: A Live Notification Counter Causes an Expensive Chart to Stutter

You're building a dashboard with a live-updating "notifications" counter in the header. Every time a notification arrives (every few seconds via websocket), the entire page — including a large, expensive `<ReportChart>` component — visibly re-renders and stutters. How do you fix it?

**Approach:** The root cause is almost certainly that the notification state lives in a top-level provider/component that also renders `ReportChart` as a child, so every state update cascades down. Two complementary fixes:

```jsx
// 1. Isolate the fast-changing state into its own component so only it re-renders.
function NotificationBadge() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const sub = subscribeToNotifications(() => setCount(c => c + 1));
    return () => sub.unsubscribe();
  }, []);
  return <span className="badge">{count}</span>;
}

function Header() {
  return (
    <header>
      <Logo />
      <NotificationBadge /> {/* only this re-renders on new notifications */}
    </header>
  );
}

// 2. If ReportChart must stay a sibling under a shared re-rendering ancestor, memoize it.
const ReportChart = React.memo(function ReportChart({ data }) {
  /* expensive render */
  return <canvas ref={/* ... */} />;
});
```

Verify with the Profiler that `ReportChart` no longer shows up in the commit triggered by a notification. If `ReportChart`'s props include inline objects/arrays from the parent, stabilize those with `useMemo` too — otherwise `memo` won't help.
