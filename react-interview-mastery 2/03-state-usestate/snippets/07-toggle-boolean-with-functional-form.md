# Toggling Boolean State With the Functional Form (Avoids Stale Closures in Rapid Toggles)

```jsx
function ToggleButton() {
  const [isOn, setIsOn] = React.useState(false);
  return (
    <button onClick={() => setIsOn(prev => !prev)}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
}
```
