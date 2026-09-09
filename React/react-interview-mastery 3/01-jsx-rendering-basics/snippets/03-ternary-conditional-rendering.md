***  03-ternary-conditional-rendering.md ***

# Ternary for Two-Branch Conditional Rendering

```jsx
function StatusBadge({ isOnline }) {
  return <span>{isOnline ? '🟢 Online' : '⚪ Offline'}</span>;
}
```
