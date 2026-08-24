# Problem: Refactor a Deeply-Nested Ternary into Clean, Readable Code

## Task

The component below renders a user profile card with four different visual states (loading, error, no-permission, and loaded) using a chain of nested ternaries. Refactor it into something readable, using early returns and extracted sub-components.

## Starting point (the anti-pattern)

```jsx
function ProfileCard({ status, error, hasPermission, user }) {
  return (
    <div className="card">
      {status === "loading" ? (
        <div className="spinner">Loading…</div>
      ) : status === "error" ? (
        <div className="error">
          Something went wrong: {error?.message ?? "Unknown error"}
        </div>
      ) : !hasPermission ? (
        <div className="locked">
          You don't have permission to view this profile.
        </div>
      ) : (
        <div className="profile">
          <img src={user.avatarUrl} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.bio}</p>
          {user.isVerified ? <span className="badge">Verified</span> : null}
        </div>
      )}
    </div>
  );
}
```

This is hard to scan (four states nested three ternaries deep), and the trailing `isVerified ? ... : null` ternary compounds the problem further.

## Refactored solution

```jsx
function ProfileCard({ status, error, hasPermission, user }) {
  if (status === "loading") {
    return (
      <div className="card">
        <LoadingState />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="card">
        <ErrorState message={error?.message} />
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="card">
        <LockedState />
      </div>
    );
  }

  return (
    <div className="card">
      <ProfileView user={user} />
    </div>
  );
}

function LoadingState() {
  return <div className="spinner">Loading…</div>;
}

function ErrorState({ message }) {
  return <div className="error">Something went wrong: {message ?? "Unknown error"}</div>;
}

function LockedState() {
  return <div className="locked">You don't have permission to view this profile.</div>;
}

function ProfileView({ user }) {
  return (
    <div className="profile">
      <img src={user.avatarUrl} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
      {user.isVerified && <span className="badge">Verified</span>}
    </div>
  );
}
```

## Why this is better

- Each state is handled by an early `return`, so at any point while reading `ProfileCard`, you're looking at exactly one condition and its outcome — no need to mentally track three levels of `? :` nesting to figure out which branch a given prop combination falls into.
- Each state got its own named component (`LoadingState`, `ErrorState`, `LockedState`, `ProfileView`), so each is independently readable, testable, and reusable elsewhere if another screen needs the same "locked" UI, for instance.
- The single remaining ternary-like construct (`user.isVerified && <span>...`) is a plain `&&` short-circuit, not a chained ternary — it has exactly one outcome to consider (render the badge, or nothing), which is a fundamentally simpler shape than a 3-way-or-more ternary chain.
- Adding a fifth state (say, a "profile deleted" state) means adding one more early `if` and one more component — a small, localized diff — rather than threading a fourth `? :` into an already-dense one-liner.

## Things to watch out for

- Early returns work well here because each state is *mutually exclusive* and each one fully replaces the UI. If states could combine (e.g., "loading" AND "has a warning banner"), early returns alone wouldn't fit — you'd need to compose independent pieces instead of branching to a single return.
- Don't over-extract — a two-branch ternary (`isOpen ? <A /> : <B />`) is usually fine as-is; the refactor is worth it once you're nesting three or more conditions, not for every single conditional in the codebase.
