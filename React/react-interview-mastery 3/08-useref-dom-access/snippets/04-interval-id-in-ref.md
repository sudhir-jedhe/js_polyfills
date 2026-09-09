***  04-interval-id-in-ref.md ***

# Snippet: Storing an interval ID in a ref to clear it from a different handler

```jsx
function StopwatchButton() {
  const intervalRef = useRef(null);
  const [seconds, setSeconds] = useState(0);

  const start = () => {
    if (intervalRef.current) return; // already running
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };
  const stop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
  };

  return (
    <div>
      <p>{seconds}s</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```
