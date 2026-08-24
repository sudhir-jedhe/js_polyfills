# Problem: Split one large context into two narrower contexts to fix an unnecessary re-render problem

## Task

Start from a single `AppContext` bundling `user` and `notifications`, where updating `notifications` (e.g. a new notification arriving every few seconds) forces an unrelated `UserBadge` component to re-render too. Demonstrate the problem, then fix it by splitting into `UserContext` and `NotificationsContext`.

## Before: one bundled context (the problem)

```jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

function AppProviderBefore({ children }) {
  const [user] = useState({ name: 'Priya' });
  const [notifications, setNotifications] = useState([]);

  // Simulate notifications arriving periodically — this is the update that
  // should NOT affect anything that only cares about `user`.
  useEffect(() => {
    const id = setInterval(() => {
      setNotifications((prev) => [...prev, `Notification ${prev.length + 1}`]);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  // BUG: one object holding both — any change to either field creates a new
  // `value` reference, re-rendering every consumer regardless of which
  // field it actually reads.
  const value = { user, notifications };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

function UserBadge() {
  const { user } = useContext(AppContext);
  console.log('UserBadge render'); // logs every ~2s, even though `user` never changes
  return <span>{user.name}</span>;
}

function NotificationBell() {
  const { notifications } = useContext(AppContext);
  return <span>🔔 {notifications.length}</span>;
}
```

Every time a notification arrives, `UserBadge` re-renders in the console log even though `user` is untouched — because `value` is a brand-new object every time `AppProviderBefore` re-renders, and Context re-renders *every* consumer on any value-reference change.

## After: split contexts (the fix)

```jsx
import { createContext, useContext, useState, useEffect, useMemo } from 'react';

const UserContext = createContext();
const NotificationsContext = createContext();

function AppProviderAfter({ children }) {
  const [user] = useState({ name: 'Priya' });
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const id = setInterval(() => {
      setNotifications((prev) => [...prev, `Notification ${prev.length + 1}`]);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const userValue = useMemo(() => ({ user }), [user]);
  const notificationsValue = useMemo(() => ({ notifications }), [notifications]);

  return (
    <UserContext.Provider value={userValue}>
      <NotificationsContext.Provider value={notificationsValue}>
        {children}
      </NotificationsContext.Provider>
    </UserContext.Provider>
  );
}

function UserBadge() {
  const { user } = useContext(UserContext);
  console.log('UserBadge render'); // now only logs once — never re-renders from notifications
  return <span>{user.name}</span>;
}

function NotificationBell() {
  const { notifications } = useContext(NotificationsContext);
  return <span>🔔 {notifications.length}</span>;
}

function App() {
  return (
    <AppProviderAfter>
      <UserBadge />
      <NotificationBell />
    </AppProviderAfter>
  );
}

export default App;
```

## Why this works

- In the "before" version, `user` and `notifications` share one `value` object, so `Object.is` comparison on the Provider's `value` fails on *every* render of `AppProviderBefore` (a new literal every time) — and even with `useMemo`, it would still fail whenever `notifications` changes, since both fields live in the same object.
- Splitting into `UserContext` and `NotificationsContext` means each has its own `value`, independently memoized. `UserBadge` only subscribes to `UserContext`, so `NotificationsContext`'s value changing (on every new notification) has zero effect on it — React only re-renders consumers of the context whose value actually changed.
- `useMemo` on each split value is still necessary — splitting alone doesn't help if each provider recreates its own object literal every render; the two techniques (splitting + memoizing) address two different problems (blast radius vs. reference stability) and are typically both needed.
- This is the standard fix cited in `theory/03-splitting-contexts.md` and `scenarios/01-bundled-context-laggy-search.md` — grouping unrelated pieces of state into one context is the single most common cause of "why does this unrelated component keep re-rendering" bugs with Context.
