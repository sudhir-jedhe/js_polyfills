# Snippet: Controlled input

```jsx
// React state is the single source of truth
function ControlledInput() {
  const [value, setValue] = React.useState('');
  return (
    <input value={value} onChange={e => setValue(e.target.value)} placeholder="Type here" />
  );
}
```
