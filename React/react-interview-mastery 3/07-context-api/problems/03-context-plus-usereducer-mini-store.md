***  03-context-plus-usereducer-mini-store.md ***

# Problem: Context + `useReducer` as a mini global store for a small app

## Task

Build a small todo-app store using Context + `useReducer` — centralized state transitions, action creators to avoid typo'd action-type strings, and separate state/dispatch contexts so components that only dispatch don't re-render when state changes.

## Solution

```jsx
import { createContext, useContext, useReducer, useCallback } from 'react';

const TodosStateContext = createContext(undefined);
const TodosDispatchContext = createContext(undefined);

const initialState = { todos: [], filter: 'all' };

function todosReducer(state, action) {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...state,
        todos: [...state.todos, { id: action.payload.id, text: action.payload.text, done: false }],
      };
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map((t) =>
          t.id === action.payload.id ? { ...t, done: !t.done } : t
        ),
      };
    case 'SET_FILTER':
      return { ...state, filter: action.payload.filter };
    default:
      if (process.env.NODE_ENV !== 'production') {
        throw new Error(`Unknown todos action: ${action.type}`);
      }
      return state;
  }
}

// Action creators — the sanctioned, typo-proof way to build actions.
const todosActions = {
  addTodo: (text) => ({ type: 'ADD_TODO', payload: { id: crypto.randomUUID(), text } }),
  toggleTodo: (id) => ({ type: 'TOGGLE_TODO', payload: { id } }),
  setFilter: (filter) => ({ type: 'SET_FILTER', payload: { filter } }),
};

function TodosProvider({ children }) {
  const [state, dispatch] = useReducer(todosReducer, initialState);
  return (
    <TodosStateContext.Provider value={state}>
      <TodosDispatchContext.Provider value={dispatch}>
        {children}
      </TodosDispatchContext.Provider>
    </TodosStateContext.Provider>
  );
}

function useTodosState() {
  const ctx = useContext(TodosStateContext);
  if (ctx === undefined) throw new Error('useTodosState must be used within TodosProvider');
  return ctx;
}

function useTodosDispatch() {
  const ctx = useContext(TodosDispatchContext);
  if (ctx === undefined) throw new Error('useTodosDispatch must be used within TodosProvider');
  return ctx;
}

function AddTodoForm() {
  // Only reads dispatch (which useReducer guarantees is referentially
  // stable) — never re-renders when `state` changes.
  const dispatch = useTodosDispatch();

  function handleSubmit(e) {
    e.preventDefault();
    const text = new FormData(e.target).get('text');
    if (!text) return;
    dispatch(todosActions.addTodo(text));
    e.target.reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="text" placeholder="Add a todo…" />
      <button type="submit">Add</button>
    </form>
  );
}

function TodoList() {
  const { todos, filter } = useTodosState();
  const dispatch = useTodosDispatch();

  const visible =
    filter === 'active' ? todos.filter((t) => !t.done) :
    filter === 'done' ? todos.filter((t) => t.done) :
    todos;

  return (
    <ul>
      {visible.map((todo) => (
        <li key={todo.id}>
          <label>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={() => dispatch(todosActions.toggleTodo(todo.id))}
            />
            <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>
              {todo.text}
            </span>
          </label>
        </li>
      ))}
    </ul>
  );
}

function FilterBar() {
  const { filter } = useTodosState();
  const dispatch = useTodosDispatch();
  return (
    <div>
      {['all', 'active', 'done'].map((f) => (
        <button
          key={f}
          onClick={() => dispatch(todosActions.setFilter(f))}
          disabled={filter === f}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

function TodoApp() {
  return (
    <TodosProvider>
      <AddTodoForm />
      <FilterBar />
      <TodoList />
    </TodosProvider>
  );
}

export default TodoApp;
```

## Why this works

- `useReducer` centralizes every state transition (`ADD_TODO`, `TOGGLE_TODO`, `SET_FILTER`) into one pure reducer function, instead of scattering multiple `setX` calls across components — this is the "why `useReducer` over `useState`" argument for anything with more than one or two related pieces of state.
- Splitting `TodosStateContext` from `TodosDispatchContext` means `AddTodoForm`, which only ever dispatches and never reads `todos`/`filter`, never re-renders when state changes — `dispatch` from `useReducer` is referentially stable across renders by React's guarantee, so `TodosDispatchContext`'s value never changes reference at all.
- `todosActions` (action creators) are the only sanctioned way to build an action object — a typo like `dispatch({ type: 'ADD_TODOO' })` would be a call to a function that doesn't exist and fails at the call site, versus a raw string typo that the reducer's `default` case would silently swallow.
- `useTodosState`/`useTodosDispatch` each guard against being called outside `TodosProvider`, following the same defensive pattern as `useTheme` in problem 1 — this is worth doing for every context in a real app, not just the "showcase" one.
