*** copy 01-usetoggle.md ***

# Snippet: useToggle — Boolean State With a Stable Toggle Function

```jsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  const toggle = useCallback(() => setValue((v) => !v), []);
  return [value, toggle];
}

function Accordion() {
  const [expanded, toggleExpanded] = useToggle(false);
  return (
    <button onClick={toggleExpanded}>{expanded ? 'Collapse' : 'Expand'}</button>
  );
}
```
