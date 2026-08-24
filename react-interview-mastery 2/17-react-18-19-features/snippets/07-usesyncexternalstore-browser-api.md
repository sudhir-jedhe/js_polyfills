# useSyncExternalStore Subscribing to a Browser API

```jsx
function useOnlineStatus() {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener("online", callback);
      window.addEventListener("offline", callback);
      return () => {
        window.removeEventListener("online", callback);
        window.removeEventListener("offline", callback);
      };
    },
    () => navigator.onLine, // client snapshot
    () => true // server snapshot (SSR fallback)
  );
}

function StatusBanner() {
  const online = useOnlineStatus();
  return online ? null : <p>You're offline</p>;
}
```
