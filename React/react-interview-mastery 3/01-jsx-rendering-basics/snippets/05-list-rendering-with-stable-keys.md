*** copy 05-list-rendering-with-stable-keys.md ***

# Rendering a List With Stable Keys Derived From Data, Not Index

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map(todo => (
        <li key={todo.id}>{todo.text}</li>
      ))}
    </ul>
  );
}
```
