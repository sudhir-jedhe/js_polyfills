***  01-reorderable-task-list-loses-focus.md ***

# Reorderable Task List Loses Input Focus and Shows Wrong Text

**Scenario:** You're building a drag-to-reorder task list where each task has an editable `<input>` for its title. Users report that after dragging a task to a new position, the wrong title appears in the input, and their cursor/focus jumps unexpectedly.

**Approach:** This is the index-as-key problem. If the list is rendered with `key={index}`, reordering changes which index each task occupies, so React reuses the DOM `<input>` at each index for whatever task now sits there — including its uncontrolled `defaultValue` or controlled `value` state — rather than moving the actual DOM node with its task. Fix by keying on the task's stable id:

```jsx
function TaskList({ tasks, onReorder }) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>
          <input
            value={task.title}
            onChange={e => updateTitle(task.id, e.target.value)}
          />
        </li>
      ))}
    </ul>
  );
}
```

With `key={task.id}`, React tracks each `<input>` by the task it belongs to, so reordering moves the actual DOM nodes (and their focus/selection state) along with the data instead of reusing them positionally.
