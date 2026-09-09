***  07-presentational-component.md ***

# Presentational Component Receiving All Data/Behavior via Props

```jsx
function TodoItem({ text, done, onToggle }) {
  return (
    <li style={{ textDecoration: done ? 'line-through' : 'none' }}>
      <input type="checkbox" checked={done} onChange={onToggle} />
      {text}
    </li>
  );
}
```
