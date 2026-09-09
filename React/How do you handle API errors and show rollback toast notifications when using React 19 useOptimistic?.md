***  How do you handle API errors and show rollback toast notifications when using React 19 useOptimistic?.md ***

When an async Action fails in React 19, `useOptimistic` automatically discards the temporary state and rolls back to the base state. To trigger a user-facing toast notification and restore form state on failure, you can intercept the error inside a custom action wrapper or return structured error states from `useActionState`.

---

### Recommended Architecture

```
[ User Submits Form ] 
         │
         ├── 1. `setOptimistic(newItem)` ──► Instant UI update (0ms)
         │
         └── 2. `formAction(formData)` (Background API call)
                   │
                   ├── Success ──► Base state updates; replaces optimistic item
                   └── Failure ──► 1. React automatically drops optimistic item (rolls back)
                                   2. Catch block triggers `toast.error(...)`
                                   3. (Optional) Restore failed text to input for retry

```

---

### Full Implementation Pattern

Here is a complete pattern integrating `useOptimistic`, `useActionState`, and a toast notification library (like `sonner` or `react-hot-toast`):

```jsx
import { useActionState, useOptimistic, useRef } from 'react';
import { toast } from 'sonner'; // Any toast library

// 1. Base Action: Handles actual network call and returns new state
async function addTodoAction(previousTodos, formData) {
  const title = formData.get('title');

  const res = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });

  if (!res.ok) {
    // Throw error to be caught by the wrapper
    throw new Error('Failed to save todo on the server.');
  }

  const savedTodo = await res.json();
  return [...previousTodos, savedTodo];
}

export function TodoList({ initialTodos = [] }) {
  const formRef = useRef(null);
  const inputRef = useRef(null);

  // 2. Base state managed by useActionState
  const [todos, formAction, isPending] = useActionState(
    addTodoAction,
    initialTodos
  );

  // 3. Optimistic state
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(
    todos,
    (currentTodos, newTitle) => [
      ...currentTodos,
      {
        id: `temp-${Date.now()}`,
        title: newTitle,
        isOptimistic: true, // Marker for temporary visual style
      },
    ]
  );

  // 4. Action Wrapper: Coordinates optimistic trigger, error catch, and toast
  const handleSubmit = async (formData) => {
    const title = formData.get('title');
    if (!title || !title.trim()) return;

    // Reset input immediately for good UX
    formRef.current?.reset();

    // Trigger instant optimistic update
    setOptimisticTodos(title);

    try {
      // Execute the underlying transition action
      await formAction(formData);
      toast.success('Todo added successfully!');
    } catch (err) {
      // Step A: Toast notification informs the user of the failure
      toast.error(err.message || 'Something went wrong. Changes rolled back.', {
        action: {
          label: 'Retry',
          onClick: () => {
            if (inputRef.current) inputRef.current.value = title;
          },
        },
      });

      // Step B: (Optional UX Polish) Re-populate input so user doesn't lose typed text
      if (inputRef.current) {
        inputRef.current.value = title;
        inputRef.current.focus();
      }
      
      // Step C: React automatically discards the optimistic item because
      // the base state never updated.
    }
  };

  return (
    <div className="todo-app">
      <form ref={formRef} action={handleSubmit} className="todo-form">
        <input
          ref={inputRef}
          name="title"
          type="text"
          placeholder="Add a new task..."
          required
        />
        <button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Add'}
        </button>
      </form>

      <ul className="todo-list">
        {optimisticTodos.map((todo) => (
          <li
            key={todo.id}
            style={{
              opacity: todo.isOptimistic ? 0.6 : 1,
              transition: 'opacity 0.2s ease',
            }}
          >
            <span>{todo.title}</span>
            {todo.isOptimistic && <span className="badge">Syncing...</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

```

---

### Key Rollback Mechanics

* **No Manual Array Splice:** You do not need to manually find and delete the temporary optimistic item on failure. `useOptimistic` derives its state from the `todos` base state. If `formAction` throws or rejects, `todos` remains unchanged, and React re-renders the list strictly using the unmodified `todos` array.
* **Preserving Failed Input Data:** When an error occurs, the most frustrating UX is losing what the user typed. Capturing the input value (`title`) before calling `formRef.current.reset()` allows you to restore the text to the input field inside the `catch` block.
* **Adding Retry Callbacks to Toasts:** Toast components with action buttons can bind the failed `title` value back into the form or re-invoke the action directly.
