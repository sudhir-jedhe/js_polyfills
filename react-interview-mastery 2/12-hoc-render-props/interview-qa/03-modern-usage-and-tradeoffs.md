# Interview Q&A: Modern Usage and Trade-Offs

**Q: Are HOCs and render props still used in modern React codebases? Where?**
Yes, mainly at library integration boundaries where the library itself hasn't exposed a hook API — e.g., some older Redux (`connect()`), certain component libraries, or error boundaries, which must be class components and therefore can't be pure hooks. For application-level shared logic you write yourself, custom hooks are the default choice today.

---

**Q: Why can't error boundaries be replaced by a hook the way most HOCs have been?**
Error boundaries rely on the class component lifecycle methods `static getDerivedStateFromError` and `componentDidCatch`, which have no hook equivalent — there is no `useErrorBoundary` hook in React because catching render errors requires intercepting the render/commit cycle at a level hooks don't expose. A HOC like `withErrorBoundary(Component)` is a legitimate, still-current pattern because it wraps a class-based boundary around any function component.

---

**Q: What's a subtle bug that can occur with render props and `React.memo`?**
If the provider component wraps the render-prop function's invocation in something meant to be memoized (or a child of it is `memo`-wrapped), passing a new inline arrow function as the render prop every render defeats that memoization, since the function reference changes every time — identical to the inline-function-as-prop issue outside of render props.

---

**Q: What's the practical difference in the DevTools component tree between using a hook and using a HOC for the same shared logic?**
A hook adds zero extra entries to the tree — the logic executes inside the existing component's call frame. A HOC adds one extra named component per wrapper (e.g., `WithLoading`) that appears as a real node in the tree, which is directly inspectable but also adds visual/structural noise as more wrappers stack.

---

**Q: If you must support both React DevTools clarity and cross-cutting concerns like theming, which would you choose today — a hook or a HOC — and why?**
A hook (`useTheme()` reading from a context) — it keeps the tree flat, avoids naming collisions if combined with other hooks, and is trivially composable with other hooks in the same component without any wrapper nesting. Reach for a HOC only if the concern must operate as a wrapper for reasons hooks structurally can't address, like error boundaries.
