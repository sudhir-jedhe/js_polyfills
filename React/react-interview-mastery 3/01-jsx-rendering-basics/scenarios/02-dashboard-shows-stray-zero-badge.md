***  02-dashboard-shows-stray-zero-badge.md ***

# Dashboard Shows a Stray "0" Instead of Staying Blank

**Scenario:** You're building a notifications dropdown that should show a badge count only when there are unread notifications, but QA reports a bare `0` character appearing in the corner when the inbox is empty.

**Approach:** The render logic is almost certainly `{unreadCount && <Badge count={unreadCount} />}`. When `unreadCount` is `0`, `&&` short-circuits and returns `0` itself, and React renders that number as text. Fix by forcing a real boolean:

```jsx
function NotificationIcon({ unreadCount }) {
  return (
    <div className="icon">
      <BellSvg />
      {unreadCount > 0 && <Badge count={unreadCount} />}
    </div>
  );
}
```

More generally, treat any `&&` guard in JSX as suspect unless the left-hand value is already a boolean; convert with a comparison (`> 0`, `!!value`, `Boolean(value)`) rather than relying on truthiness of numbers or strings.
