# Problem 2: Fix an Unnecessary Re-Render Caused by a New Object Literal Prop

## The problem

`UserCard` is wrapped in `React.memo` and does a moderately expensive render (formatting, computed styling). Its parent, `Dashboard`, has an unrelated `notifications` counter that ticks up periodically. Every tick re-renders `Dashboard`, which passes a brand-new `style` object literal to `UserCard` on every render — defeating `React.memo` entirely.

## Before: inline object literal defeats memo

```jsx
import { useState, useEffect } from 'react';

const UserCard = React.memo(function UserCard({ user, style }) {
  console.log('UserCard render');
  return (
    <div style={style}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
});

function DashboardBefore() {
  const [user] = useState({ name: 'Ada Lovelace', email: 'ada@example.com' });
  const [notifications, setNotifications] = useState(0);

  // Simulates an unrelated periodic update elsewhere in the app.
  useEffect(() => {
    const id = setInterval(() => setNotifications((n) => n + 1), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <p>Notifications: {notifications}</p>
      {/* New {} literal every DashboardBefore render — defeats UserCard's memo */}
      <UserCard user={user} style={{ border: '1px solid #ccc', padding: 12 }} />
    </div>
  );
}
```

Every 2 seconds, `notifications` changes, `DashboardBefore` re-renders, and `UserCard` re-renders right along with it — `"UserCard render"` logs every 2 seconds — even though neither `user` nor the *contents* of `style` ever change. `style` is a fresh object reference each time, so `React.memo`'s shallow prop comparison always reports "changed."

## After: hoist or memoize the object so its reference is stable

Two valid fixes, depending on whether the object is truly constant or derived from state/props:

**Option A — the object is a true constant: hoist it outside the component.**

```jsx
const CARD_STYLE = { border: '1px solid #ccc', padding: 12 }; // module-level, created once ever

function DashboardAfterHoisted() {
  const [user] = useState({ name: 'Ada Lovelace', email: 'ada@example.com' });
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setNotifications((n) => n + 1), 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <p>Notifications: {notifications}</p>
      <UserCard user={user} style={CARD_STYLE} />
    </div>
  );
}
```

**Option B — the object depends on component state/props: wrap it in `useMemo`.**

```jsx
import { useMemo } from 'react';

function DashboardAfterMemoized({ highlight }) {
  const [user] = useState({ name: 'Ada Lovelace', email: 'ada@example.com' });
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setNotifications((n) => n + 1), 2000);
    return () => clearInterval(id);
  }, []);

  // Only recreated when `highlight` actually changes — stable across the
  // notifications-driven re-renders.
  const style = useMemo(
    () => ({
      border: highlight ? '2px solid gold' : '1px solid #ccc',
      padding: 12,
    }),
    [highlight]
  );

  return (
    <div>
      <p>Notifications: {notifications}</p>
      <UserCard user={user} style={style} />
    </div>
  );
}
```

## Result

In both fixed versions, `"UserCard render"` logs exactly once (on mount) and never again as `notifications` ticks up — `style` (and `user`, which was already stable via `useState`) keep the same reference across `Dashboard` re-renders, so `React.memo`'s shallow comparison correctly sees "nothing changed" and skips re-rendering `UserCard`.

Prefer Option A whenever the object genuinely never changes — it's simpler and has zero per-render cost. Reach for Option B only when the object's contents legitimately depend on props/state that can change.
