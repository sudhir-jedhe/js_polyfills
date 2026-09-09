***  03-index-as-key-bug.md ***

# The index-as-key bug, concretely

```jsx
function TodoList({ todos }) {
  return (
    <ul>
      {todos.map((todo, index) => (
        <TodoRow key={index} todo={todo} />
      ))}
    </ul>
  );
}

function TodoRow({ todo }) {
  const [editing, setEditing] = useState(false);
  return editing ? (
    <input defaultValue={todo.text} onBlur={() => setEditing(false)} />
  ) : (
    <li onClick={() => setEditing(true)}>{todo.text}</li>
  );
}
```

Say you click row 2 to edit it (`editing` becomes `true` for the component instance at index `2`). Now the user deletes row 0. Every item shifts up by one index. React sees "index 2 still exists" and reuses that same component instance — including its `editing === true` state — but now it's rendering a *different todo's* text in edit mode. The edit UI appears to have jumped to the wrong row. This is the single most common key-related bug in React interviews and real code.

The fix: key by something stable and unique to the data, like `todo.id` from your database, not the array position.

## Key uniqueness scope

Keys only need to be unique **among siblings** — not globally across the whole app. Two different `.map()` calls in two different lists can reuse the same key values without conflict, because React compares keys within a single parent's children, not across the whole tree.

```jsx
// fine — these are two separate sibling groups
<div>
  {users.map((u) => <UserCard key={u.id} user={u} />)}
</div>
<div>
  {posts.map((p) => <PostCard key={p.id} post={p} />)}
</div>
```

## Gotchas checklist

- Never use array index as key when the list can reorder, filter, or insert/delete from the middle.
- It's fine to use index as key for a genuinely static list that never changes (rare in practice — treat it as a code smell).
- Keys are not passed to your component as a prop — if you need the id inside the component, pass it explicitly (`<Row key={id} id={id} />`).
