# When You'd Still Reach for a HOC Today

- **Library integration** where the library's own API is HOC-based (e.g., older Redux `connect()`, some routing libraries' legacy APIs, React Router v5's `withRouter`).
- **Cross-cutting concerns that must wrap at the component (not hook) level**, such as error boundaries — a HOC like `withErrorBoundary(Component)` is reasonable because error boundaries *must* be class components and can't be expressed as a hook at all.
- **Enhancing components you don't own** (e.g., wrapping a third-party component to inject analytics tracking) where you can't add a hook call inside it.

## Gating HOC vs library-integration HOC

| Aspect | Gating HOC (e.g. `withLoading`) | Library-integration HOC (e.g. legacy `connect()`, `withRouter`) |
|---|---|---|
| Replaceable by hooks today? | Yes, trivially — `if (isLoading) return <Spinner/>` inline, or a custom hook | Only if the library itself exposes a hook API; otherwise the HOC is the library's supported integration point |
| Common mistake | Writing new gating HOCs today instead of just inlining the condition or using a hook | Trying to force a hook-only rewrite of a HOC that a third-party library requires, causing brittle workarounds |

Write gating logic inline or as a hook; keep using library-provided HOCs as-is when the library hasn't shipped a hook equivalent.

## Are HOCs and render props still used in modern React codebases? Where?

Yes, mainly at library integration boundaries where the library itself hasn't exposed a hook API — e.g., some older Redux (`connect()`), certain component libraries, or error boundaries, which must be class components and therefore can't be pure hooks. For application-level shared logic you write yourself, custom hooks are the default choice today.

## Why can't error boundaries be replaced by a hook the way most HOCs have been?

Error boundaries rely on the class component lifecycle methods `static getDerivedStateFromError` and `componentDidCatch`, which have no hook equivalent — there is no `useErrorBoundary` hook in React because catching render errors requires intercepting the render/commit cycle at a level hooks don't expose. A HOC like `withErrorBoundary(Component)` is a legitimate, still-current pattern because it wraps a class-based boundary around any function component. See `13-error-boundaries` for the full treatment of error boundaries themselves, and `problems/03-witherrorboundary-hoc.md` in this topic for a worked implementation.

## If you must support both React DevTools clarity and cross-cutting concerns like theming, which would you choose today — a hook or a HOC — and why?

A hook (`useTheme()` reading from a context) — it keeps the tree flat, avoids naming collisions if combined with other hooks, and is trivially composable with other hooks in the same component without any wrapper nesting. Reach for a HOC only if the concern must operate as a wrapper for reasons hooks structurally can't address, like error boundaries.
