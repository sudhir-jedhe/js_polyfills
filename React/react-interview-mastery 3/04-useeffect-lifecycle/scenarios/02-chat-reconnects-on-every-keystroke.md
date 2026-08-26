*** copy 02-chat-reconnects-on-every-keystroke.md ***

# Chat Component Reconnects on Every Keystroke in an Unrelated Typing Indicator Field

**Scenario:** You're building a chat room component that opens a WebSocket connection on mount and shows a "user is typing" indicator, but users report the connection drops and reconnects every time anyone types in the message box — visible as a connect/disconnect flicker in the room status.

**Approach:** The WebSocket effect's dependency array likely includes something that changes on every keystroke (e.g., an inline options object built fresh each render, or the draft message text itself accidentally included as a dependency). Isolate the connection effect so it only depends on the room id, and keep typing-related state completely separate:

```jsx
function ChatRoom({ roomId }) {
  const [draft, setDraft] = React.useState('');

  // Connection: depends ONLY on roomId, unaffected by typing
  React.useEffect(() => {
    const socket = createSocket(roomId);
    socket.connect();
    return () => socket.disconnect();
  }, [roomId]);

  return (
    <div>
      <MessageList roomId={roomId} />
      <input value={draft} onChange={e => setDraft(e.target.value)} />
    </div>
  );
}
```

The key fix is separating concerns: the connection-lifecycle effect and the typing-state should never share a dependency array. If typing needs to send "is typing" events over the same socket, that belongs in its own effect (or handler) that reads the socket via a ref, not one that reopens the connection.

## Follow-up: sending "is typing" events without reconnecting

**Approach:** Store the socket instance in a `ref` so other effects/handlers can use it without needing it as a dependency (refs are stable and don't trigger effect re-runs):

```jsx
function ChatRoom({ roomId }) {
  const socketRef = React.useRef(null);
  const [draft, setDraft] = React.useState('');

  React.useEffect(() => {
    const socket = createSocket(roomId);
    socket.connect();
    socketRef.current = socket;
    return () => socket.disconnect();
  }, [roomId]);

  function handleChange(e) {
    setDraft(e.target.value);
    socketRef.current?.emit('typing');
  }

  return <input value={draft} onChange={handleChange} />;
}
```
