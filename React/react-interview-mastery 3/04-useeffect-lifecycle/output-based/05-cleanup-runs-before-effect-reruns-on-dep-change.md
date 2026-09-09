***  05-cleanup-runs-before-effect-reruns-on-dep-change.md ***

# What Happens When `roomId` Changes From `"lobby"` to `"general"`?

```jsx
function ChatRoom({ roomId }) {
  React.useEffect(() => {
    console.log('connecting to', roomId);
    return () => console.log('disconnecting from', roomId);
  }, [roomId]);
  return <div>{roomId}</div>;
}
```

**Answer:** Logs, in order: `disconnecting from lobby`, then `connecting to general`.

**Why:** When a dependency changes, React first runs the cleanup function from the *previous* effect run (closing over the old `roomId`, `"lobby"`), and only then runs the new effect body with the updated `roomId`. This "clean up, then re-run" sequencing is what lets each effect run treat itself as a fresh, self-contained synchronization rather than an incremental patch.
