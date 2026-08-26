*** copy 03-use-previous-hook.md ***

# Snippet: Tracking a previous prop/state value across renders

```jsx
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function Score({ score }) {
  const prevScore = usePrevious(score);
  return <p>Now: {score}, before: {prevScore ?? 'n/a'}</p>;
}
```
