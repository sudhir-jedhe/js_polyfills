# Todo List with Tabs in React

### Frontend System Design + Complete Interview-Ready Code

A **Todo list with tabs** is a very common **React frontend machine coding interview** question.

Examples:

```txt
Google Tasks
Microsoft To Do
Notion
TickTick
Todoist
Apple Reminders
```

Interviewers ask this because it tests:

✅ React fundamentals

✅ State management

✅ Filtering / Categories

✅ Reusable Components

✅ Conditional Rendering

✅ Accessibility

✅ Optional persistence

✅ Optional drag and drop

✅ UI polish

---

# 1. Requirements

## Functional

✅ Add Todo

✅ Delete Todo

✅ Mark complete

✅ Show tabs:
All, Active, Completed

✅ Show todo count in each tab

✅ Persist in LocalStorage

✅ Keyboard support

✅ Empty state

Optional:

✅ Filter by tab

✅ Drag & drop reorder

✅ Edit todo

✅ Rating

✅ Priority

---

# 2. System Design

```txt
App
│
├── Tabs
│    ├── All
│    ├── Active
│    └── Completed
│
├── AddTodo
│
├── TodoList
│    └── TodoItem
│
└── TodoContext (Optional)
```

---

# 3. Data Model

```js
{
  id: "1",
  text: "Buy groceries",
  completed: false
}
```

---

# 4. State Design

```jsx
const [todos, setTodos] = useState([]);

const [activeTab, setActiveTab] = useState("all");

const [text, setText] = useState("");
```

---

# 5. Project Structure

```txt
src/
│
├── App.jsx
├── components/
│   ├── Tabs.jsx
│   ├── AddTodo.jsx
│   ├── TodoList.jsx
│   └── TodoItem.jsx
│
└── styles.css
```

---

# 6. Tabs Component

```jsx
const TABS = [
  {
    key: "all",
    label: "All",
  },
  {
    key: "active",
    label: "Active",
  },
  {
    key: "completed",
    label: "Completed",
  },
];

export default function Tabs({ activeTab, setActiveTab, todos }) {
  const counts = {
    all: todos.length,

    active: todos.filter((t) => !t.completed).length,

    completed: todos.filter((t) => t.completed).length,
  };

  return (
    <div className="tabs">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={activeTab === tab.key ? "active-tab" : ""}
          onClick={() => setActiveTab(tab.key)}
        >
          {tab.label} ({counts[tab.key]})
        </button>
      ))}
    </div>
  );
}
```

---

# 7. AddTodo Component

```jsx
import { useState } from "react";

export default function AddTodo({ onAdd }) {
  const [text, setText] = useState("");

  function handleAdd() {
    if (!text.trim()) return;

    onAdd(text);
    setText("");
  }

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      handleAdd();
    }
  }

  return (
    <div className="add-todo">
      <input
        placeholder="Add a task..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button onClick={handleAdd}>Add</button>
    </div>
  );
}
```

---

# 8. TodoItem Component

```jsx
export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />

      <span className={todo.completed ? "completed" : ""}>{todo.text}</span>

      <button className="delete" onClick={() => onDelete(todo.id)}>
        ✕
      </button>
    </li>
  );
}
```

---

# 9. TodoList Component

```jsx
import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onDelete }) {
  if (!todos.length) {
    return <p className="empty">No tasks yet.</p>;
  }

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
```

---

# 10. Main App

```jsx
import { useState, useEffect, useMemo } from "react";

import Tabs from "./components/Tabs";
import AddTodo from "./components/AddTodo";
import TodoList from "./components/TodoList";

import "./styles.css";

export default function App() {
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");

    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo(text) {
    setTodos((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text,
        completed: false,
      },
    ]);
  }

  function toggleTodo(id) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo,
      ),
    );
  }

  function deleteTodo(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  const filteredTodos = useMemo(() => {
    if (activeTab === "active") {
      return todos.filter((t) => !t.completed);
    }

    if (activeTab === "completed") {
      return todos.filter((t) => t.completed);
    }

    return todos;
  }, [todos, activeTab]);

  return (
    <div className="container">
      <h1>Todo List</h1>

      <AddTodo onAdd={addTodo} />

      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} todos={todos} />

      <TodoList
        todos={filteredTodos}
        onToggle={toggleTodo}
        onDelete={deleteTodo}
      />
    </div>
  );
}
```

---

# 11. CSS

```css
.container {
  max-width: 500px;
  margin: 30px auto;

  background: white;
  padding: 20px;

  border-radius: 8px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.add-todo {
  display: flex;
  gap: 8px;

  margin-bottom: 12px;
}

.add-todo input {
  flex: 1;
  padding: 8px;
}

.tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.tabs button {
  padding: 6px 10px;

  background: #f3f4f6;

  border: none;

  cursor: pointer;
  border-radius: 6px;
}

.active-tab {
  background: #2563eb !important;
  color: white;
}

.todo-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 8px;

  padding: 8px 6px;

  border-bottom: 1px solid #eee;
}

.todo-item .completed {
  text-decoration: line-through;
  color: gray;
}

.todo-item .delete {
  margin-left: auto;
  background: transparent;
  border: none;
  color: red;
  cursor: pointer;
}

.empty {
  text-align: center;
  color: gray;
}
```

---

# 12. How It Works

```txt
User Types
   ↓
State Updated
   ↓
Add Todo
   ↓
Rendered in All Tab

Toggle → Filter by tab

Delete → Removes from list

LocalStorage saves auto
```

---

# 13. Complexity

Add / Toggle / Delete:

```txt
O(n)
```

Filter:

```txt
O(n)
```

Storage:

```txt
O(n)
```

Very efficient.

---

# 14. Interview Follow-Up Questions

### Q1. Why tabs instead of dropdown filter?

Tabs improve:

✅ Discoverability

✅ Faster switching

✅ Better UX

✅ Familiar UI pattern

---

### Q2. Why use `useMemo` for filtering?

Because filtering runs on every render.

`useMemo` recalculates only if:

```txt
todos change
activeTab changes
```

Prevents unnecessary computation.

---

### Q3. Why persist in localStorage?

Data survives:

```txt
Refresh
Browser Close
```

Real-world apps do the same.

---

### Q4. Add drag and drop?

Use:

```txt
dnd-kit
react-beautiful-dnd
```

Or native pointer events.

---

# 15. Extensions (Senior Level)

✅ Edit Todo

✅ Rename inline

✅ Add priority (High / Medium / Low)

✅ Due dates

✅ Categories/tags

✅ Drag & Drop reorder

✅ Search functionality

✅ Async fetch from API

✅ Sync with backend

✅ Keyboard shortcuts

✅ Undo delete

✅ Bulk actions

✅ Auto-complete

✅ Voice input

---

# 16. Data Flow Diagram

```txt
User Input
     ↓
State Update
     ↓
LocalStorage Persist
     ↓
Filter Todos by Tab
     ↓
Render TodoList
     ↓
Toggle / Delete Actions
     ↓
Re-render Filtered View
```

---

# 17. Senior React Interview Answer

> I would design a Todo list with tabs using controlled React state where todos and the currently active tab are stored separately. The tab system supports "All", "Active", and "Completed" filters and displays real-time counts computed from the todos array. Filtering is memoized using `useMemo` to prevent unnecessary recomputation. Data is persisted using `localStorage`, hydrated at initialization, and updated inside `useEffect`. The component structure is decomposed into `Tabs`, `AddTodo`, `TodoList`, and `TodoItem` for reusability and testability. In production, I would extend this with priority, tags, drag-and-drop reordering, API sync, undo, and virtualization for large lists — the same design used by Google Tasks, Microsoft To Do, and Notion.

# Todo List with Tabs – Advanced Features

### Drag & Drop Reordering • Inline Edit • Backend API Persistence

These are the **three most common Senior React interview follow-ups** after building a basic Todo app with tabs.

They convert the simple app into a **production-grade, real-world todo application** similar to Todoist, Notion, Microsoft To Do, and TickTick.

---

# 1. Drag and Drop to Reorder Todos

## Two Approaches

### A) Native HTML5 Drag & Drop (Interview Preferred)

Zero libraries. Great for interviews.

### B) `dnd-kit` (Production Preferred)

Supports touch, keyboard, and accessibility.

---

## HTML5 Drag & Drop – Implementation

### State

```jsx
const [draggedId, setDraggedId] = useState(null);
```

---

### Handlers

```jsx
function handleDragStart(id) {
  setDraggedId(id);
}

function handleDragOver(event) {
  event.preventDefault();
}

function handleDrop(targetId) {
  if (!draggedId || draggedId === targetId) {
    setDraggedId(null);
    return;
  }

  const oldIndex = todos.findIndex((t) => t.id === draggedId);

  const newIndex = todos.findIndex((t) => t.id === targetId);

  const updated = [...todos];

  const [moved] = updated.splice(oldIndex, 1);

  updated.splice(newIndex, 0, moved);

  setTodos(updated);

  setDraggedId(null);
}
```

---

### Update Todo Item

```jsx
<li
  draggable
  onDragStart={() => handleDragStart(todo.id)}
  onDragOver={handleDragOver}
  onDrop={() => handleDrop(todo.id)}
>
  ⠿ {todo.text}
</li>
```

Grip handle `⠿` improves UX.

---

### CSS

```css
.todo-item {
  cursor: grab;
}

.todo-item:active {
  cursor: grabbing;
}
```

---

### Behaviour

```txt
Drag A → drop on C

Before: A B C D
After:  B C A D
```

Works on desktop.

---

## Production Approach: dnd-kit

Install:

```bash
npm install
@dnd-kit/core
@dnd-kit/sortable
@dnd-kit/utilities
```

### Setup Sortable Context

```jsx
import { DndContext, closestCenter } from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";
```

---

### Sortable Item

```jsx
function SortableTodo({ todo, onToggle, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: todo.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {todo.text}
    </li>
  );
}
```

---

### DnD Handler

```jsx
function handleDragEnd(event) {
  const { active, over } = event;

  if (!over || active.id === over.id) return;

  const oldIndex = todos.findIndex((t) => t.id === active.id);

  const newIndex = todos.findIndex((t) => t.id === over.id);

  setTodos(arrayMove(todos, oldIndex, newIndex));
}
```

---

### Wrap List

```jsx
<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext
    items={todos.map((t) => t.id)}
    strategy={verticalListSortingStrategy}
  >
    {todos.map((todo) => (
      <SortableTodo key={todo.id} todo={todo} />
    ))}
  </SortableContext>
</DndContext>
```

Now:

✅ Mouse

✅ Touch

✅ Keyboard

all supported.

---

# 2. Inline Edit for Todo Items

## Why?

Users expect:

```txt
Click text → edit
Press Enter → save
Press Escape → cancel
```

Common in:

```txt
Notion
Google Docs
Todoist
Microsoft To Do
```

---

## State

```jsx
const [editingId, setEditingId] = useState(null);

const [editText, setEditText] = useState("");
```

---

## Enter Edit Mode

```jsx
function startEdit(todo) {
  setEditingId(todo.id);
  setEditText(todo.text);
}
```

---

## Save Edit

```jsx
function saveEdit() {
  if (!editText.trim()) {
    cancelEdit();
    return;
  }

  setTodos((prev) =>
    prev.map((todo) =>
      todo.id === editingId
        ? {
            ...todo,
            text: editText,
          }
        : todo,
    ),
  );

  setEditingId(null);
}
```

---

## Cancel Edit

```jsx
function cancelEdit() {
  setEditingId(null);
  setEditText("");
}
```

---

## Handle Key Down

```jsx
function handleKeyDown(event) {
  if (event.key === "Enter") {
    saveEdit();
  }

  if (event.key === "Escape") {
    cancelEdit();
  }
}
```

---

## Update Todo Item

```jsx
{
  editingId === todo.id ? (
    <input
      value={editText}
      onChange={(e) => setEditText(e.target.value)}
      onBlur={saveEdit}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  ) : (
    <span onDoubleClick={() => startEdit(todo)}>{todo.text}</span>
  );
}
```

---

## UX Improvements

✅ Double-click to edit

✅ Auto focus

✅ Save on blur

✅ Enter / Escape

✅ Rename inline like Trello/Notion

---

# 3. Persist Todos in Backend API

Instead of localStorage, sync todos with server.

Real applications require this.

---

## Backend API Contract

### Get Todos

```http
GET /api/todos
```

### Create Todo

```http
POST /api/todos
{
  "text": "Buy Milk"
}
```

### Update Todo

```http
PUT /api/todos/:id
{
  "completed": true,
  "text": "Buy Bread"
}
```

### Delete Todo

```http
DELETE /api/todos/:id
```

### Reorder Todos

```http
PUT /api/todos/reorder
{
  "orderedIds": ["3","1","2"]
}
```

---

## API Layer

```js
export async function fetchTodos() {
  const res = await fetch("/api/todos");

  return res.json();
}

export async function createTodo(text) {
  const res = await fetch("/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });

  return res.json();
}

export async function updateTodo(id, updates) {
  const res = await fetch(`/api/todos/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  return res.json();
}

export async function deleteTodo(id) {
  await fetch(`/api/todos/${id}`, { method: "DELETE" });
}

export async function reorderTodos(orderedIds) {
  await fetch("/api/todos/reorder", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      orderedIds,
    }),
  });
}
```

---

## Load Todos on Mount

```jsx
useEffect(() => {
  fetchTodos()
    .then(setTodos)
    .catch((error) => console.error(error));
}, []);
```

---

## Add Todo (Optimistic UI)

```jsx
async function addTodo(text) {
  const tempTodo = {
    id: `temp-${Date.now()}`,
    text,
    completed: false,
  };

  setTodos((prev) => [...prev, tempTodo]);

  try {
    const saved = await createTodo(text);

    setTodos((prev) => prev.map((t) => (t.id === tempTodo.id ? saved : t)));
  } catch (error) {
    setTodos((prev) => prev.filter((t) => t.id !== tempTodo.id));
  }
}
```

---

## Toggle Complete

```jsx
async function toggleTodo(id) {
  const previous = todos;

  setTodos((prev) =>
    prev.map((todo) =>
      todo.id === id
        ? {
            ...todo,
            completed: !todo.completed,
          }
        : todo,
    ),
  );

  try {
    const target = todos.find((t) => t.id === id);

    await updateTodo(id, {
      completed: !target.completed,
    });
  } catch (error) {
    setTodos(previous);
  }
}
```

---

## Delete Todo

```jsx
async function removeTodo(id) {
  const previous = todos;

  setTodos((prev) => prev.filter((t) => t.id !== id));

  try {
    await deleteTodo(id);
  } catch (error) {
    setTodos(previous);
  }
}
```

---

## Reorder Sync

After drag ends:

```jsx
await reorderTodos(updated.map((t) => t.id));
```

Keeps backend in sync.

---

## Best Practices

✅ Optimistic UI

✅ Error rollback

✅ Debounced text updates

✅ Retry logic

✅ Offline queue (advanced)

✅ Loading indicator

✅ Skeleton UI

✅ Show sync status

---

# Full Enterprise Architecture

```txt
Todo App
   │
   ▼
Local State
   │
   ▼
Optimistic Updates
   │
   ▼
Backend API
   │
   ▼
Drag & Drop
   │
   ▼
Inline Edit
   │
   ▼
Persist
   │
   ▼
Retry / Rollback
   │
   ▼
Sync UI
```

---

# Senior React Interview Answer

> To make the todo app production-grade, I add three key features. First, **drag and drop reordering** using either native HTML5 events or `dnd-kit`, which provides better accessibility, touch support, and animations. Reordered items are updated in state and synced to the backend via an ordering endpoint. Second, **inline editing** using a double-click gesture that swaps the label with an editable input, supporting Enter to save, Escape to cancel, and blur-based auto-save. Third, **backend persistence** using a REST API layer with optimistic UI updates for instant feedback, rollback on failure, and eventual consistency. This mirrors real-world implementations used by Todoist, Notion, and Microsoft To Do, ensuring a fast, resilient, and enterprise-scalable experience.

# Debounce Inline Edit Updates in a Todo App

### Senior React Frontend System Design

Debouncing inline edits is crucial for **production-grade React apps** like:

```txt
Notion
Google Docs
Todoist
Trello
Microsoft To Do
Airtable
```

Every keystroke should **not** trigger:

```txt
API calls
Re-rendering
Database writes
UI flashes
```

Instead, wait until the user pauses typing.

---

# 1. Why Debounce Inline Edit?

## Without Debouncing

User types:

```txt
R
Re
Rea
React
```

Each keystroke fires:

```txt
API 1
API 2
API 3
API 4
```

Result:

```txt
❌ Too many network calls
❌ Server overload
❌ Wasted bandwidth
❌ Race conditions
❌ UI lag
```

---

## With Debouncing

User types:

```txt
React
```

After 500ms of inactivity:

```txt
Single API call
```

Efficient and smooth.

---

# 2. Debounce Concept

Debouncing means:

```txt
Wait until user stops typing
   ↓
Execute function
```

Not:

```txt
Wait every 500ms
Fire API
Continue typing
Fire API again
```

That is throttling.

---

# 3. Debounce Utility

```js
export function debounce(fn, delay = 500) {
  let timerId;

  return function (...args) {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

Reusable across app.

---

# 4. Debounce Custom Hook

More idiomatic React version:

```jsx
import { useEffect, useState } from "react";

export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
```

---

# 5. Apply to Inline Edit

## State

```jsx
const [editText, setEditText] = useState(todo.text);

const debouncedText = useDebounce(editText, 500);
```

---

## Editable Input

```jsx
<input value={editText} onChange={(e) => setEditText(e.target.value)} />
```

---

## Debounced Update Effect

```jsx
useEffect(() => {
  if (debouncedText === todo.text || !debouncedText.trim()) {
    return;
  }

  updateTodoText(todo.id, debouncedText);
}, [debouncedText]);
```

---

## Backend Call

```jsx
async function updateTodoText(id, text) {
  try {
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
      }),
    });
  } catch (error) {
    console.error("Failed to update", error);
  }
}
```

---

# 6. UX Improvements

## Show Save State

Add visual feedback:

```txt
Idle
Saving...
Saved
```

State:

```jsx
const [status, setStatus] = useState("idle");
```

Behavior:

```jsx
setStatus("saving");

await updateTodoText(...);

setStatus("saved");
```

Then reset after 2s:

```jsx
setTimeout(() => setStatus("idle"), 2000);
```

---

## Save Status UI

```jsx
{
  status === "saving" && <span>Saving...</span>;
}

{
  status === "saved" && <span>✓ Saved</span>;
}
```

Matches Google Docs UX.

---

# 7. Race Condition Handling

Rapid typing may fire multiple API calls.

Older call may finish LAST.

Solution:

Use AbortController.

---

## Cancel Older Requests

```jsx
const abortRef = useRef(null);

async function updateTodoText(id, text) {
  abortRef.current?.abort();

  const controller = new AbortController();

  abortRef.current = controller;

  try {
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
      }),
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error);
    }
  }
}
```

---

## Behaviour

```txt
Type "R"
Fire API
Type "Re"
Cancel first
Fire second API
Type "Rea"
Cancel second
Fire third API
User stops
Only last API is committed
```

Perfect.

---

# 8. Advanced Optimizations

## ✅ Skip Empty Text

```jsx
if (!debouncedText.trim()) return;
```

Avoids saving empty todos.

---

## ✅ Skip Same Value

```jsx
if (debouncedText === todo.text) {
  return;
}
```

Avoids duplicate saves.

---

## ✅ Retry on Failure

```jsx
async function retry(fn, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) {
        throw error;
      }
    }
  }
}
```

---

## ✅ Persist Draft in localStorage

If user refreshes mid-edit:

```jsx
useEffect(() => {
  localStorage.setItem(`todo-draft-${todo.id}`, editText);
}, [editText]);
```

Reload from draft:

```jsx
useEffect(() => {
  const draft = localStorage.getItem(`todo-draft-${todo.id}`);

  if (draft) {
    setEditText(draft);
  }
}, []);
```

---

# 9. Complexity

## Debounce

```txt
Time: O(1)
Space: O(1)
```

## API Call

```txt
Depends on network
```

## Rendering

```txt
Only on state change
```

Efficient and predictable.

---

# 10. Debounce vs Throttle

## Debounce

```txt
Wait until user stops
```

Perfect for:

```txt
Search
Inline Edit
Autosave
```

---

## Throttle

```txt
Run every N ms
```

Perfect for:

```txt
Scroll
Resize
Mousemove
```

---

# 11. Full Flow

```txt
User Types
     │
     ▼
setEditText()
     │
     ▼
Debounce Hook
     │
     ▼
debouncedText updated
     │
     ▼
useEffect runs
     │
     ▼
AbortController cancels old req
     │
     ▼
Fire API
     │
     ▼
Show Saving...
     │
     ▼
Success → Show Saved
     │
     ▼
Rollback if failed
```

---

# 12. Senior React Interview Answer

> To debounce inline edit updates, I create a custom `useDebounce` hook that delays state changes until the user stops typing for 500ms. The debounced value drives a `useEffect` block that fires the backend update. To prevent race conditions where earlier API responses overwrite newer ones, I use `AbortController` to cancel in-flight requests when a new one is triggered. Additionally, I skip updates for empty values and cases where the value hasn’t changed, saving unnecessary API calls. I also include save status indicators, retry logic, and optional draft persistence in localStorage. This design mirrors autosave patterns used in production apps like Notion, Google Docs, and Todoist — providing smooth, resilient, and efficient inline editing without excessive network traffic.
