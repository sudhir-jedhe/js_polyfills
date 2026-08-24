# useId and useSyncExternalStore

Two smaller React 18 hooks worth knowing by name and purpose, even though they come up far less often than concurrency or RSC in day-to-day work.

## useId

`useId` generates a stable, unique ID string, primarily for accessibility attributes (`aria-describedby`, label/input pairing) that must match between server-rendered and client-hydrated HTML:

```jsx
function LabeledInput() {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Name</label>
      <input id={id} />
    </>
  );
}
```

Don't use it as a React `key` for list items — it's tied to a component instance's position/identity in the tree, not to the identity of a specific data item. List keys should come from stable data (like an item's database ID), not from `useId`.

## useSyncExternalStore (brief)

`useSyncExternalStore` lets you safely subscribe a component to an external (non-React) data store — like a browser API or a third-party state library — in a way that's compatible with concurrent rendering, avoiding "tearing" (different parts of the UI showing inconsistent snapshots of the store during a concurrent render).

Most app code doesn't call it directly; it's primarily a low-level primitive that state management library authors use internally, or that you reach for when subscribing directly to a browser API (`navigator.onLine`, `matchMedia`).

## useEffect vs. useSyncExternalStore for external stores

| Aspect | `useEffect` + `useState` (manual subscription) | `useSyncExternalStore` |
|---|---|---|
| Concurrent-rendering safety | Can "tear" — different components may read inconsistent snapshots mid-concurrent-render | Designed specifically to avoid tearing, guarantees a consistent snapshot |
| Boilerplate | You write subscribe/unsubscribe and state syncing yourself | Purpose-built hook, less code once you know the API |
| When to use | Rare cases where you're not actually reading a shared external mutable store | Any time you subscribe a component to state that lives outside React (browser APIs, external stores, some state libraries) |
| Common mistake | Using `useEffect` to sync external store state, which works most of the time but can subtly tear under concurrent features | Reaching for it for ordinary React state, where it's unnecessary — it's meant for genuinely external stores |

Most app developers won't call `useSyncExternalStore` directly — it mainly matters when writing or evaluating a state-management library's internals.
