# Interview Q&A: The Re-render Cost & Memoization

**Q: What happens to consumers when a Context's Provider value changes?**

Every component that calls `useContext` on that context re-renders, regardless of whether it reads the specific part of the value that actually changed. React does a reference equality check (`Object.is`) on the whole `value` — if it's a new object/array, every consumer re-renders even if the fields they individually care about are unchanged.

**Q: Why is it important to memoize the object passed to a Provider's `value` prop?**

Because an inline object literal (`value={{ user, setUser }}`) is a new reference on every render of the Provider component, which forces every consumer to re-render even when `user` hasn't actually changed. Wrapping it in `useMemo(() => ({ user, setUser }), [user])` keeps the reference stable across renders where the dependencies haven't changed, letting consumers skip unnecessary re-renders.

**Q: Does wrapping a component in `React.memo` prevent it from re-rendering when a context it consumes changes?**

No. `React.memo` only affects re-renders triggered by prop changes from the parent — it has no effect on re-renders triggered by a subscribed context's value changing. A memoized component that calls `useContext` still re-renders whenever that context's value reference changes, regardless of its memo status.

**Q: How do you avoid unrelated components re-rendering when only part of your context's value changes?**

Split one large context into several smaller, focused contexts, each holding only related data, and consume only the one(s) each component actually needs. A common variant: split a `useReducer`-backed context into a state context and a dispatch context, since `dispatch` is referentially stable and consumers that only dispatch actions (and never read state) won't re-render when state changes.
