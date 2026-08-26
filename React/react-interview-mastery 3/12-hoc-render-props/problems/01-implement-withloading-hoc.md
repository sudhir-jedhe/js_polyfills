# Problem 1: Implement a `withLoading(Component)` HOC

A HOC that shows a spinner while a `loading` prop is `true`, and otherwise renders the wrapped component with the rest of its props passed through untouched.

```jsx
function Spinner() {
  return <div className="spinner" role="status" aria-label="Loading">Loading…</div>;
}

function withLoading(WrappedComponent) {
  function WithLoading({ loading, ...rest }) {
    if (loading) {
      return <Spinner />;
    }
    return <WrappedComponent {...rest} />;
  }

  // Debuggable in React DevTools instead of showing up as an anonymous component.
  WithLoading.displayName = `withLoading(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return WithLoading;
}
```

## Usage

```jsx
function UserProfile({ user }) {
  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

const UserProfileWithLoading = withLoading(UserProfile);

function UserProfilePage({ userId }) {
  const { data: user, loading } = useFetch(`/api/users/${userId}`);
  // `loading` is intercepted by the HOC; `user` passes through as a normal prop.
  return <UserProfileWithLoading loading={loading} user={user} />;
}
```

While `loading` is `true`, `UserProfilePage` renders `<Spinner />` via the HOC and `UserProfile` never mounts at all — so it's safe for `UserProfile` to assume `user` is always defined by the time it actually renders, since the HOC gates that.

## Design notes

- **`loading` is consumed, not forwarded.** The wrapped component never sees a `loading` prop — the HOC destructures it out and only passes `...rest` down, so `UserProfile` doesn't need to know or care that a loading gate exists above it.
- **`displayName` is set** so React DevTools shows `withLoading(UserProfile)` instead of an anonymous `WithLoading` function, making the wrapped tree traceable.
- **No mutation of `WrappedComponent`.** The HOC only creates and configures the new `WithLoading` function; the original component is left completely untouched, so rendering `<UserProfile />` directly elsewhere still behaves normally.
