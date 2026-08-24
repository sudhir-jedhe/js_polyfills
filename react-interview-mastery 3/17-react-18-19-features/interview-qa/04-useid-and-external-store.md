# Interview Q&A: useId and useSyncExternalStore

**Q: What is `useId` for, and why shouldn't you use it as a list key?**
It generates a stable, unique ID string per component instance, primarily intended for linking accessibility attributes like `htmlFor`/`id` or `aria-describedby`, and it's designed to match consistently between server-rendered and client-hydrated markup. It's unsuitable as a list `key` because it's tied to a component instance's position/identity in the tree, not to the identity of a specific data item — list keys should come from stable data (like an item's database ID), not from `useId`.

**Q: What problem does `useSyncExternalStore` solve that `useEffect` + `useState` doesn't fully solve?**
It guarantees a consistent snapshot of an external (non-React) data source across all components reading it within the same concurrent render, preventing "tearing" — a bug where different parts of the UI briefly show inconsistent values from the same store during a concurrent update. A manual `useEffect`/`useState` subscription can't make that same consistency guarantee under concurrent rendering.

**Q: If you're not writing a state management library, do you need to reach for `useSyncExternalStore` yourself?**
Rarely — it's a low-level primitive mostly used internally by library authors (e.g., Redux, Zustand bindings) or for direct subscriptions to browser APIs (`navigator.onLine`, `matchMedia`). Most application code either uses React's own state or a library that already wraps `useSyncExternalStore` correctly.
