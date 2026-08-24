# Interview Q&A: React.memo and Stable Props

**Q: What does `React.memo` actually compare, and what's the most common way it fails to help?**
It does a shallow comparison (`Object.is`) of each prop against the previous render's value. It fails most often when the parent passes inline object/array/function literals (`style={{...}}`, `onClick={() => ...}`), which create a new reference on every render even if the contents are identical, so the comparison always reports "changed."

---

**Q: When should you reach for `React.memo`, and when is it a waste of effort?**
Reach for it on components that render frequently with genuinely stable props — typically leaf components or list rows where the parent re-renders often but a given row's data rarely changes. It's a waste on components that render cheaply anyway, or whose props are unstable references from the parent (you'd need `useMemo`/`useCallback` upstream too, which adds its own overhead) — measure with the Profiler first.

---

**Q: Give an example of an inline prop that silently breaks memoization, and how to fix it.**
`<Row style={{ padding: 8 }} />` passed to a `memo`-wrapped `Row` creates a new object every render, so `memo`'s shallow comparison never matches. Fix by hoisting the object to a module-level constant (if truly static) or wrapping it in `useMemo(() => ({ padding: 8 }), [])` if it depends on props/state.

---

**Q: Why doesn't `useCallback` alone guarantee a component avoids re-rendering?**
`useCallback` only stabilizes the *function reference* passed as a prop — the child still needs to be wrapped in `React.memo` to actually skip re-rendering when that prop (and all others) is unchanged. Using `useCallback` without `memo` on the receiving component has no effect on whether that component re-renders.

---

**Q: A context provider's `value` is `{ theme, setTheme }` created inline in the provider component's body. What's the performance problem, and how do you fix it?**
Every render of the provider creates a new `value` object, so every consumer of that context re-renders on every provider render, even if `theme` itself hasn't changed. Fix by memoizing the value: `const value = useMemo(() => ({ theme, setTheme }), [theme])` (with `setTheme` from `useState`, which is already stable).
