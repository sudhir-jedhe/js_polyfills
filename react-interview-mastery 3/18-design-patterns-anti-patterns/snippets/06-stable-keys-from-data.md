# Stable Keys Derived from Data, Not Index

```jsx
function TodoList({ todos, onRemove }) {
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.text}
          <button onClick={() => onRemove(todo.id)}>x</button>
        </li>
      ))}
    </ul>
  );
}
```
