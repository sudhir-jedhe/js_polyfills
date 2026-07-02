# `useTodo` Custom Hook (Production-Ready)

This is a common **React machine coding + custom hook interview** question.

Features:

```text
✅ Add Todo
✅ Delete Todo
✅ Toggle Todo
✅ Edit Todo
✅ Search Todo
✅ Persist to LocalStorage
✅ useReducer
✅ Custom Hook
✅ Memoized Selectors
✅ Reusable Architecture
```

The pattern of combining a custom hook with `useReducer` is commonly used to centralise todo logic and keep components clean and maintainable. [\[github.com\]](https://github.com/githarsh7/USEREDUCER-TODO), [\[github.com\]](https://github.com/githarsh7/REACT-TODO-USEREDUCER)

***

# Folder Structure

```text
src/
│
├── hooks/
│   └── useTodo.js
│
├── components/
│   ├── TodoForm.jsx
│   ├── TodoList.jsx
│   └── TodoItem.jsx
│
├── App.jsx
└── styles.css
```

***

# useTodo.js

```jsx
import {
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

const STORAGE_KEY = "TODOS";

const initialState = [];

function todoReducer(
  state,
  action
) {
  switch (action.type) {
    case "ADD_TODO":
      return [
        ...state,
        {
          id:
            Date.now(),
          text:
            action.payload,
          completed:
            false,
        },
      ];

    case "DELETE_TODO":
      return state.filter(
        todo =>
          todo.id !==
          action.payload
      );

    case "TOGGLE_TODO":
      return state.map(
        todo =>
          todo.id ===
          action.payload
            ? {
                ...todo,
                completed:
                  !todo.completed,
              }
            : todo
      );

    case "UPDATE_TODO":
      return state.map(
        todo =>
          todo.id ===
          action.payload.id
            ? {
                ...todo,
                text:
                  action.payload
                    .text,
              }
            : todo
      );

    case "SET_TODOS":
      return action.payload;

    default:
      return state;
  }
}

export function useTodo() {
  const [
    todos,
    dispatch,
  ] = useReducer(
    todoReducer,
    initialState
  );

  const [
    search,
    setSearch,
  ] = useState("");

  useEffect(() => {
    const stored =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (stored) {
      dispatch({
        type:
          "SET_TODOS",
        payload:
          JSON.parse(
            stored
          ),
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        todos
      )
    );
  }, [todos]);

  const addTodo =
    text => {
      if (
        !text.trim()
      )
        return;

      dispatch({
        type:
          "ADD_TODO",
        payload:
          text,
      });
    };

  const deleteTodo =
    id => {
      dispatch({
        type:
          "DELETE_TODO",
        payload: id,
      });
    };

  const toggleTodo =
    id => {
      dispatch({
        type:
          "TOGGLE_TODO",
        payload: id,
      });
    };

  const updateTodo =
    (
      id,
      text
    ) => {
      dispatch({
        type:
          "UPDATE_TODO",
        payload: {
          id,
          text,
        },
      });
    };

  const filteredTodos =
    useMemo(() => {
      return todos.filter(
        todo =>
          todo.text
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [
      todos,
      search,
    ]);

  const stats =
    useMemo(() => {
      return {
        total:
          todos.length,

        completed:
          todos.filter(
            t =>
              t.completed
          ).length,

        pending:
          todos.filter(
            t =>
              !t.completed
          ).length,
      };
    }, [todos]);

  return {
    todos:
      filteredTodos,
    search,
    setSearch,
    addTodo,
    deleteTodo,
    toggleTodo,
    updateTodo,
    stats,
  };
}
```

***

# TodoForm.jsx

```jsx
import {
  useState,
} from "react";

export default function TodoForm(
  { addTodo }
) {
  const [
    text,
    setText,
  ] = useState("");

  const handleSubmit =
    e => {
      e.preventDefault();

      addTodo(text);

      setText("");
    };

  return (
    <form
      onSubmit={
        handleSubmit
      }
    >
      <input
        value={text}
        placeholder="Add Todo..."
        onChange={e =>
          setText(
            e.target.value
          )
        }
      />

      <button
        type="submit"
      >
        Add
      </button>
    </form>
  );
}
```

***

# TodoItem.jsx

```jsx
import {
  useState,
} from "react";

export default function TodoItem({
  todo,
  toggleTodo,
  deleteTodo,
  updateTodo,
}) {
  const [
    editing,
    setEditing,
  ] = useState(false);

  const [
    value,
    setValue,
  ] = useState(
    todo.text
  );

  return (
    <li>
      <input
        type="checkbox"
        checked={
          todo.completed
        }
        onChange={() =>
          toggleTodo(
            todo.id
          )
        }
      />

      {editing ? (
        <input
          value={value}
          onChange={e =>
            setValue(
              e.target.value
            )
          }
        />
      ) : (
        <span
          style={{
            textDecoration:
              todo.completed
                ? "line-through"
                : "none",
          }}
        >
          {todo.text}
        </span>
      )}

      {editing ? (
        <button
          onClick={() => {
            updateTodo(
              todo.id,
              value
            );

            setEditing(
              false
            );
          }}
        >
          Save
        </button>
      ) : (
        <button
          onClick={() =>
            setEditing(
              true
            )
          }
        >
          Edit
        </button>
      )}

      <button
        onClick={() =>
          deleteTodo(
            todo.id
          )
        }
      >
        Delete
      </button>
    </li>
  );
}
```

***

# TodoList.jsx

```jsx
import TodoItem from "./TodoItem";

export default function TodoList({
  todos,
  toggleTodo,
  deleteTodo,
  updateTodo,
}) {
  return (
    <ul>
      {todos.map(
        todo => (
          <TodoItem
            key={
              todo.id
            }
            todo={todo}
            toggleTodo={
              toggleTodo
            }
            deleteTodo={
              deleteTodo
            }
            updateTodo={
              updateTodo
            }
          />
        )
      )}
    </ul>
  );
}
```

***

# App.jsx

```jsx
import {
  useTodo,
} from "./hooks/useTodo";

import TodoForm from "./components/TodoForm";

import TodoList from "./components/TodoList";

export default function App() {
  const {
    todos,
    search,
    setSearch,
    addTodo,
    deleteTodo,
    toggleTodo,
    updateTodo,
    stats,
  } = useTodo();

  return (
    <div>
      <h1>
        Todo App
      </h1>

      <input
        placeholder="Search..."
        value={search}
        onChange={e =>
          setSearch(
            e.target.value
          )
        }
      />

      <TodoForm
        addTodo={
          addTodo
        }
      />

      <h3>
        Total:
        {
          stats.total
        }
      </h3>
      <h3>
        Completed:
        {
          stats.completed
        }
      </h3>
      <h3>
        Pending:
        {
          stats.pending
        }
      </h3>

      <TodoList
        todos={todos}
        toggleTodo={
          toggleTodo
        }
        deleteTodo={
          deleteTodo
        }
        updateTodo={
          updateTodo
        }
      />
    </div>
  );
}
```

***

# Senior Interview Discussion

Why `useReducer` instead of `useState`?

```text
ADD_TODO
DELETE_TODO
UPDATE_TODO
TOGGLE_TODO
```

Multiple state transitions fit naturally into reducer-based state management. Examples of production todo implementations often use reducer actions for add, delete, and toggle operations. [\[github.com\]](https://github.com/githarsh7/USEREDUCER-TODO), [\[dev.to\]](https://dev.to/touhidulshawan/todo-using-usereducer-in-react-3d8m)

***

# Enterprise Enhancements

```text
✅ Server Sync
✅ Optimistic Updates
✅ Infinite Pagination
✅ Offline Support
✅ Undo / Redo
✅ Drag & Drop
✅ Due Dates
✅ Tags
✅ Filters
✅ Zustand / Redux Toolkit
✅ React Query
✅ WebSocket Updates
```

### Senior-Level Answer

> I typically encapsulate all todo business logic inside a reusable `useTodo` hook backed by `useReducer`. The hook exposes actions (`addTodo`, `deleteTodo`, `toggleTodo`, `updateTodo`) and derived selectors (`filteredTodos`, `stats`) while keeping UI components completely presentation-focused. This separation improves testability, maintainability, and scalability. [\[github.com\]](https://github.com/githarsh7/USEREDUCER-TODO), [\[github.com\]](https://github.com/githarsh7/REACT-TODO-USEREDUCER)
