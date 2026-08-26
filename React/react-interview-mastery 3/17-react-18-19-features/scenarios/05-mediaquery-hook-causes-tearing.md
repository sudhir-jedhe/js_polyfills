# A Shared Hook Subscribing to window.matchMedia Causes Inconsistent UI Under Concurrent Rendering

You have a custom `useMediaQuery` hook implemented with `useEffect` + `useState` that subscribes to a media query and updates layout-dependent components. Under React 18's concurrent rendering (used via a transition elsewhere on the page), some components briefly render with a stale media-query result while others show the updated one, causing a layout mismatch mid-interaction.

**Approach:** This is textbook "tearing" — different components reading an external store at slightly different points in a concurrent render see inconsistent snapshots. Replace the manual `useEffect`/`useState` subscription with `useSyncExternalStore`, which is specifically designed to keep all consumers of an external store consistent during concurrent rendering.

```jsx
function useMediaQuery(query) {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches, // client snapshot
    () => false // server snapshot (SSR default)
  );
}
```

This guarantees every component calling `useMediaQuery(query)` in the same render sees the same value, eliminating the layout mismatch that the ad hoc `useEffect` version was prone to under concurrent features.
