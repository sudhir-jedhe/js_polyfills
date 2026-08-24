# Output-Based: Effect Cleanup Removes Listeners on Unmount

```jsx
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  useEffect(() => {
    function update() { setIsOnline(navigator.onLine); }
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);
  return isOnline;
}

function StatusBanner() {
  const isOnline = useOnlineStatus();
  return <p>{isOnline ? 'Online' : 'Offline'}</p>;
}

function App() {
  const [showBanner, setShowBanner] = useState(true);
  return (
    <>
      <button onClick={() => setShowBanner((s) => !s)}>Toggle</button>
      {showBanner && <StatusBanner />}
    </>
  );
}
```

The user toggles `showBanner` off then on again. Are the `online`/`offline` event listeners from the first mount still attached after that?

**Answer:** No — they were properly removed, and a fresh pair was added on remount.

**Why:** Toggling `showBanner` off unmounts `StatusBanner`, which runs the `useEffect` cleanup function, removing both listeners. Toggling it back on mounts a brand-new instance of `StatusBanner`, running the effect again and attaching new listeners. This is correct, leak-free behavior — proper cleanup in a custom hook's `useEffect` ensures unmounting a component that uses it doesn't leave dangling subscriptions.
