*** copy 06-lifting-state-up.md ***

# Lifting State Up

When two sibling components need to share or stay in sync with the same piece of state, the state should live in their closest common ancestor, which then passes the value and updater callbacks down as props:

```jsx
function TemperatureConverter() {
  const [celsius, setCelsius] = React.useState(0);
  return (
    <>
      <CelsiusInput value={celsius} onChange={setCelsius} />
      <FahrenheitDisplay value={celsius * 9 / 5 + 32} />
    </>
  );
}
```

Neither `CelsiusInput` nor `FahrenheitDisplay` owns the state themselves — the parent is the single source of truth, which keeps the two views trivially in sync without needing to coordinate directly with each other.

## Local `useState` vs. lifting state up to a shared parent

| Aspect | State kept local in each component | State lifted to common ancestor |
|---|---|---|
| Sharing across siblings | Not possible — each instance has its own isolated copy | Both siblings read/write the same source of truth via props |
| Re-render scope | Only that component re-renders on change | Parent and all children receiving that state as a prop re-render |
| Complexity | Simple, no prop threading needed | Requires passing value + updater callback down as props |

Keep state local when only one component needs it; lift it up as soon as a sibling or ancestor needs to read or react to the same value. The common mistake is prematurely lifting all state to the top of the app "just in case," causing unnecessary re-renders of unrelated components — lift only as far up the tree as is actually needed.

## Resetting state via `key`

To reset a component's entire state when some identifying prop (like a record `id`) changes, without manually resetting every `useState` field, give the component a `key` prop tied to that id. When the `key` changes, React treats it as an entirely new component instance — unmounting the old one (discarding all its state) and mounting a fresh one that re-runs its `useState` initializers from scratch, rather than trying to reconcile/preserve the previous instance's state:

```jsx
<UserProfileForm key={selectedUserId} userId={selectedUserId} />
```
