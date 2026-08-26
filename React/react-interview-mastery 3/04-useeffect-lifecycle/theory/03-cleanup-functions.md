*** copy 03-cleanup-functions.md ***

# Cleanup Functions

If the effect function returns a function, React treats that as cleanup and calls it: right before the effect re-runs (due to a dependency changing), and when the component unmounts.

```jsx
function ChatRoom({ roomId }) {
  React.useEffect(() => {
    const connection = createConnection(roomId);
    connection.connect();
    return () => connection.disconnect(); // cleanup
  }, [roomId]);
  return <div>Connected to {roomId}</div>;
}
```

Sequence when `roomId` changes from `'a'` to `'b'`: cleanup for `'a'` runs first (disconnect), then the effect body runs again with the new `roomId` (connect to `'b'`). This "clean up before re-running" pattern is why effects are described as synchronizing state, not one-time setup — each run should leave things exactly as if it were the only run.

## When cleanup runs, precisely

Cleanup runs in two distinct circumstances: right before the effect re-runs due to a dependency changing (cleanup for the *old* values happens first, then the new effect body runs with the new values), and once more when the component unmounts entirely. This "clean up, then re-run" pattern lets each effect execution be treated as fully self-contained, rather than as an incremental patch on top of the previous run.
