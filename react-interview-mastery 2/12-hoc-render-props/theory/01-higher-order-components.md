# Higher-Order Components (HOCs)

A HOC is a **function that takes a component and returns a new component**, wrapping the original with extra behavior or props. It's not a React API — it's just a function composition pattern applied to components, analogous to a decorator.

```jsx
function withLoading(WrappedComponent) {
  return function WithLoading({ isLoading, ...rest }) {
    if (isLoading) {
      return <div className="spinner">Loading...</div>;
    }
    return <WrappedComponent {...rest} />;
  };
}

function UserProfile({ user }) {
  return <h1>{user.name}</h1>;
}

const UserProfileWithLoading = withLoading(UserProfile);

// usage
<UserProfileWithLoading isLoading={isFetching} user={user} />;
```

## Conventions a well-behaved HOC follows

- **Does not mutate** the wrapped component.
- **Passes through unrelated props** (`...rest`).
- **Sets a `displayName`** for debugging — `WithLoading.displayName = \`withLoading(${WrappedComponent.displayName || WrappedComponent.name})\`` — otherwise React DevTools shows an anonymous component in the tree.
- **Copies static methods** if the wrapped component has any (historically via `hoist-non-react-statics`).

A more realistic HOC injects data rather than just gating render:

```jsx
function withUser(WrappedComponent) {
  return function WithUser(props) {
    const [user, setUser] = useState(null);
    useEffect(() => {
      fetchUser().then(setUser);
    }, []);
    return <WrappedComponent {...props} user={user} />;
  };
}
```

## What must a well-behaved HOC do to avoid breaking the components it wraps?

Pass through unrelated props via `{...rest}`, avoid mutating the wrapped component (never do `Wrapped.someProperty = x`), copy static methods if the wrapped component has any, and set a `displayName` so DevTools shows something readable instead of an anonymous function. Mutating the original component is especially dangerous: since the wrapped component is the *same reference* everywhere it's imported, mutating it leaks the HOC's behavior to every consumer, including ones that never call the HOC.
