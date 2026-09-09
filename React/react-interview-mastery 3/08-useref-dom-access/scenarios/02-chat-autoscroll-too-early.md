***  02-chat-autoscroll-too-early.md ***

# Scenario: A chat app's auto-scroll-to-bottom feature scrolls too early, before new messages are painted

You're building a chat window that should auto-scroll to the latest message whenever a new one arrives. Currently it calls `scrollIntoView` directly in the message-add handler, and it intermittently scrolls to the *second-to-last* message instead of the newest one.

**Approach:** The DOM hasn't been updated with the new message's node yet at the moment the handler runs (state updates are async and the DOM commit happens afterward). Use a ref on the "bottom marker" and trigger the scroll from a `useEffect` that depends on the messages array, which runs after React has committed the new DOM:

```jsx
function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // runs after messages (and the DOM) update

  return (
    <div className="chat-window">
      {messages.map((m) => (
        <Message key={m.id} message={m} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
```

Scrolling from `useEffect` guarantees the DOM has already been updated with the newly rendered message before the scroll calculation happens, fixing the off-by-one scroll target.
