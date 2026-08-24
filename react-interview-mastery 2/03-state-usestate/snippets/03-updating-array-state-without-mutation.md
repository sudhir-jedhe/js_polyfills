# Updating an Array in State Without Mutating It

```jsx
function TodoList() {
  const [todos, setTodos] = React.useState([]);
  function addTodo(text) {
    setTodos(prev => [...prev, { id: Date.now(), text }]);
  }
  return (
    <>
      <button onClick={() => addTodo('New task')}>Add</button>
      <ul>{todos.map(t => <li key={t.id}>{t.text}</li>)}</ul>
    </>
  );
}
```
