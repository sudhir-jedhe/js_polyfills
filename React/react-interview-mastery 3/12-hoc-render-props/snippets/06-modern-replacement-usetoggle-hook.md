# Snippet: The Equivalent Logic as a Custom Hook (the Modern Replacement)

```jsx
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = useCallback(() => setOn(o => !o), []);
  return [on, toggle];
}
function ToggleButton() {
  const [on, toggle] = useToggle();
  return <button onClick={toggle}>{on ? 'ON' : 'OFF'}</button>;
}
```
