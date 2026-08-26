*** copy 01-basic-list-with-stable-key.md ***

# Snippet: Basic list rendering with a stable key

```jsx
function Fruits() {
  const fruits = [
    { id: 'a1', name: 'Apple' },
    { id: 'a2', name: 'Banana' },
  ];
  return (
    <ul>
      {fruits.map((f) => (
        <li key={f.id}>{f.name}</li>
      ))}
    </ul>
  );
}
```
