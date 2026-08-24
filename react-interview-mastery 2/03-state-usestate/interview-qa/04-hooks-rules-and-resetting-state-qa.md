# Interview Q&A — Hooks Rules and Resetting State

**Q: How would you reset a component's entire state when a prop like a record `id` changes, without manually resetting every `useState` field?**
Give the component a `key` prop tied to that id. When the `key` changes, React treats it as an entirely new component instance — unmounting the old one (discarding all its state) and mounting a fresh one that re-runs its `useState` initializers from scratch, rather than trying to reconcile/preserve the previous instance's state.

```jsx
<UserProfileForm key={selectedUserId} userId={selectedUserId} />
```

**Q: Can `useState` be called conditionally, e.g., inside an `if` block?**
No — hooks must be called in the exact same order on every render, so `useState` (like all hooks) must be called unconditionally at the top level of the component, never inside conditions, loops, or nested functions. Calling it conditionally breaks React's internal mapping of hook calls to state slots between renders, causing state to become misaligned or React to throw an error.
