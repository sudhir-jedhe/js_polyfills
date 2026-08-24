# Live Notification Badge Shows a Count That's Always One Behind

**Scenario:** You're building a notification bell that polls for unread count and displays it, but users report the badge always seems to lag by exactly one update behind reality, even though network requests look correct in the dev tools.

**Approach:** This smells like a stale closure inside a `setInterval` effect that reads state directly instead of using the functional update form, or an effect with an incomplete dependency array that's comparing against a captured old value. Rewrite so the polling effect either has no dependency on stale local state or uses the functional form for any state derived from the previous value:

```jsx
function NotificationBell({ userId }) {
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    const id = setInterval(async () => {
      const count = await fetchUnreadCount(userId);
      if (!cancelled) setUnreadCount(count); // always sets the freshly-fetched value directly
    }, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [userId]);

  return <span className="badge">{unreadCount}</span>;
}
```

Because `setUnreadCount(count)` here sets state to a freshly-fetched value (not derived from stale local state), there's no closure staleness to worry about — the badge always reflects the latest poll result. The `cancelled` flag also prevents a slow, in-flight fetch from a previous poll from overwriting a more recent state update.
