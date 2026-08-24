# Interview Q&A — Prop Mutation Pitfalls and Validation

**Q: Why are props described as "read-only"?**
Because a component should never modify the `props` object it receives — that data is owned by the parent that passed it down. This is a discipline React relies on: it assumes that if the same props reference is passed again, nothing has changed (useful for optimizations like `React.memo`'s shallow comparison), and it only re-renders in response to `setState`/`useState` calls, not object mutations. Mutating props directly doesn't trigger a re-render and can corrupt state that other components share by reference.

**Q: Why does mutating an array or object prop not cause a re-render, even though the underlying data visibly changed?**
Because React only re-renders in response to a `setState`/reducer dispatch call — it never inspects prop or state values for changes on its own. Mutating an array with `.push()`/`.sort()` (etc.) in place changes the contents but keeps the same object reference, and nothing about that action calls a setter, so no re-render is scheduled. It's also unsafe for components using `React.memo`, whose shallow prop comparison would see the *same reference* and conclude nothing changed even if you did trigger a render some other way.

**Q: When would you reach for TypeScript instead of PropTypes for prop validation?**
Essentially always on a new project. PropTypes only validates at runtime, in development, and only when the component actually renders with a given set of props — it gives no compile-time safety or editor autocomplete. TypeScript validates prop shapes during development and at build time, catches mismatches before code ever runs, and provides full IDE autocomplete/refactor support, all with zero runtime cost since types are erased at compile time. PropTypes mostly persists in legacy JavaScript-only codebases not (yet) migrated to TypeScript.
