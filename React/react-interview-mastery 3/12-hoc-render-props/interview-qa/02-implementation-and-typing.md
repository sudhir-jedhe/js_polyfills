# Interview Q&A: Implementation and Typing

**Q: Rewrite a simple `withLoading` HOC as a custom hook usage instead.**
```jsx
// HOC version
function withLoading(Wrapped) {
  return ({ isLoading, ...rest }) => isLoading ? <Spinner /> : <Wrapped {...rest} />;
}

// Hook version — no extra wrapper component needed
function Profile({ isLoading, user }) {
  if (isLoading) return <Spinner />;
  return <h1>{user.name}</h1>;
}
```
The hook version just inlines the condition; no separate enhancer function or wrapper component is needed since there's no cross-component state to share.

---

**Q: What must a well-behaved HOC do to avoid breaking the components it wraps?**
Pass through unrelated props via `{...rest}`, avoid mutating the wrapped component (never do `Wrapped.someProperty = x`), copy static methods if the wrapped component has any (historically via `hoist-non-react-statics`), and set a `displayName` so DevTools shows something readable instead of an anonymous function.

---

**Q: How would you type a HOC in TypeScript, at a high level, and why is it more awkward than typing a hook?**
You need generics to preserve the wrapped component's prop type while adding/removing the props the HOC injects, e.g. `function withLoading<P>(Wrapped: ComponentType<P>): ComponentType<P & { isLoading: boolean }>`. It's more awkward than a hook because a hook just declares its own input/output types directly, while a HOC has to correctly merge, subtract, and forward generic prop types across two component boundaries.
