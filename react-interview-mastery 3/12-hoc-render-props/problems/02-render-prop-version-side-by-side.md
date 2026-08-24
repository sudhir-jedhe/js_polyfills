# Problem 2: The Same Loading-Gate Functionality as a Render-Prop Component, Side by Side With the HOC Version

## The HOC version (from Problem 1)

```jsx
function withLoading(WrappedComponent) {
  function WithLoading({ loading, ...rest }) {
    return loading ? <Spinner /> : <WrappedComponent {...rest} />;
  }
  WithLoading.displayName = `withLoading(${WrappedComponent.displayName || WrappedComponent.name})`;
  return WithLoading;
}

const UserProfileWithLoading = withLoading(UserProfile);

// usage
<UserProfileWithLoading loading={loading} user={user} />;
```

## The render-prop version

```jsx
function LoadingGate({ loading, children }) {
  return loading ? <Spinner /> : children();
}

// usage
<LoadingGate loading={loading}>
  {() => <UserProfile user={user} />}
</LoadingGate>;
```

## Side-by-side comparison

| Aspect | HOC (`withLoading`) | Render prop (`LoadingGate`) |
|---|---|---|
| How it's applied | Wraps the component once, ahead of time: `withLoading(UserProfile)` produces a new, reusable component | Wraps at the JSX call site, every time it's used: `<LoadingGate>{() => <UserProfile .../>}</LoadingGate>` |
| Component tree impact | Adds one extra node (`WithLoading`) to the tree, visible in DevTools | Adds one extra node (`LoadingGate`) to the tree — same cost, just expressed differently |
| Passing the gated component's own props | Passed as regular props on the enhanced component: `<UserProfileWithLoading user={user} />` | Passed explicitly inside the child function's closure: `<UserProfile user={user} />` inside `children()` |
| Reusability across different wrapped components | One `withLoading(X)` call per component to enhance, each producing a distinct enhanced component | One shared `LoadingGate` component, reused directly in JSX for any children — no per-component wrapping step needed |
| Readability at the call site | Enhancement is invisible at the render call site — you have to know `UserProfileWithLoading` is `withLoading(UserProfile)` | Enhancement is visible directly in the JSX tree — obvious that a loading gate wraps this content |

## When each shape is more natural here

The render-prop version is arguably a better fit for this *specific* case — a one-off conditional gate — because it doesn't require pre-declaring an enhanced component (`UserProfileWithLoading`) that only exists to be used once. The HOC version pays off more when the same gate needs to be applied to many different components in the codebase without repeating the `<LoadingGate>...</LoadingGate>` wrapper at every call site.

In modern React, neither is usually the first choice for something this simple — see `snippets/06-modern-replacement-usetoggle-hook.md` for the equivalent reasoning applied to a different example: the condition can often just be inlined directly (`if (loading) return <Spinner />;` at the top of `UserProfile` itself, or in the parent before rendering it), avoiding the extra component layer both patterns introduce.
