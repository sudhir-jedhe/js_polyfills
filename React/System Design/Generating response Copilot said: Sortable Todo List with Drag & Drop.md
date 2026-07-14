# Sortable Todo List with Drag & Drop in React

This is a **very common frontend interview problem** for Senior React roles.

## Requirements

✅ Add Todo

✅ Delete Todo

✅ Toggle Complete

✅ Drag and Drop to Reorder

✅ Persist Order in State

✅ Reusable Components

✅ Accessible

---

# Approach

Two common approaches:

1. **Native HTML5 Drag & Drop API** (no libraries)

2. **react-dnd / dnd-kit** (production-grade)

For interviews, native HTML5 API is preferred because it demonstrates:

```txt
✅ Core JavaScript knowledge
✅ Event handling
✅ State management
```

---

# Component Structure

```txt
App
│
└── TodoList
     │
     ├── Add Todo Input
     │
     └── TodoItem
          ├── Drag Handle
          ├── Checkbox
          ├── Text
          └── Delete Button
```

---

# Data Model

```js
{
  id: "1",
  text: "Buy Groceries",
  completed: false
}
```

---

# Complete Code

## App.jsx

```jsx
import { useState } from "react";
import "./styles.css";

export default function App() {
  const [todos, setTodos] = useState([
    {
      id: "1",
      text: "Buy Groceries",
      completed: false,
    },
    {
      id: "2",
      text: "Complete React Task",
      completed: false,
    },
    {
      id: "3",
      text: "Read Book",
      completed: false,
    },
  ]);

  const [newText, setNewText] = useState("");

  const [draggedItem, setDraggedItem] = useState(null);

  function handleAdd() {
    if (!newText.trim()) return;

    setTodos((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        text: newText,
        completed: false,
      },
    ]);

    setNewText("");
  }

  function handleDelete(id) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }

  function handleToggle(id) {
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

  function handleDragStart(id) {
    setDraggedItem(id);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(targetId) {
    if (!draggedItem || draggedItem === targetId) {
      return;
    }

    const draggedIndex = todos.findIndex((item) => item.id === draggedItem);

    const targetIndex = todos.findIndex((item) => item.id === targetId);

    const updated = [...todos];

    const [movedItem] = updated.splice(draggedIndex, 1);

    updated.splice(targetIndex, 0, movedItem);

    setTodos(updated);

    setDraggedItem(null);
  }

  return (
    <div className="container">
      <h1>Sortable Todo List</h1>

      <div className="input-row">
        <input
          type="text"
          placeholder="Add a task..."
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />

        <button onClick={handleAdd}>Add</button>
      </div>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo.id}
            draggable
            className={`todo-item ${todo.completed ? "completed" : ""}`}
            onDragStart={() => handleDragStart(todo.id)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(todo.id)}
          >
            <span className="drag-handle">⠿</span>

            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />

            <span>{todo.text}</span>

            <button
              className="delete-btn"
              onClick={() => handleDelete(todo.id)}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## styles.css

```css
* {
  box-sizing: border-box;
}

body {
  font-family: Arial;
  background: #f4f6f8;
}

.container {
  width: 500px;
  margin: 40px auto;

  background: white;
  padding: 20px;

  border-radius: 8px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.input-row {
  display: flex;
  gap: 8px;

  margin-bottom: 20px;
}

.input-row input {
  flex: 1;
  padding: 10px;
}

.input-row button {
  padding: 10px 20px;
  cursor: pointer;

  background: #2563eb;
  color: white;
  border: none;

  border-radius: 6px;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 12px;

  border: 1px solid #ccc;
  border-radius: 6px;

  margin-bottom: 8px;

  cursor: grab;

  background: #f9fafb;
}

.todo-item.completed span {
  text-decoration: line-through;
  color: gray;
}

.drag-handle {
  cursor: grab;
  color: #6b7280;
}

.delete-btn {
  margin-left: auto;

  background: transparent;
  border: none;

  color: red;

  cursor: pointer;

  font-size: 16px;
}
```

---

# How Drag and Drop Works

Native HTML5 events used:

```txt
onDragStart
onDragOver
onDrop
```

---

## onDragStart

Store dragged item ID.

```js
setDraggedItem(id);
```

---

## onDragOver

Prevent default browser behaviour to allow dropping.

```js
event.preventDefault();
```

---

## onDrop

Reorder array.

```js
splice;
```

move item.

---

# Reordering Logic

Suppose:

```txt
[A, B, C, D]
```

Drag `A`.

Drop on `C`.

Result:

```txt
[B, C, A, D]
```

---

# Interview Follow-Up

### Why HTML5 Drag & Drop?

Fast, native, no dependencies.

But limited on mobile.

---

### For Production Use

Prefer:

```txt
dnd-kit
react-beautiful-dnd
```

Because they support:

```txt
✅ Touch
✅ Accessibility
✅ Keyboard reorder
✅ Auto-scroll
✅ Animations
```

---

### For Large Lists?

Combine drag-and-drop with:

```txt
Virtualization
react-window
```

Only visible items are rendered.

---

# Extensions (Interview Impressions)

### Filter Todos

```txt
All
Active
Completed
```

---

### Persist To LocalStorage

```js
useEffect(() => {
  localStorage.setItem("todos", JSON.stringify(todos));
}, [todos]);
```

---

### Add Reordering Animation

```txt
framer-motion
```

---

### Multi-Select Drag

Select multiple items, then drag.

---

# Senior React Interview Answer

> I would design a sortable todo list using controlled state for the todo array and native HTML5 drag-and-drop events (`onDragStart`, `onDragOver`, `onDrop`). Drag state is tracked using the item's ID, and reordering is done by splicing the dragged item into the target position. Each todo supports toggling completion and deletion. For accessibility, keyboard-based reordering can be added, and for enterprise-grade apps, I would use `dnd-kit` or `react-beautiful-dnd` because they support touch devices, screen readers, keyboard interactions, and auto-scroll. For scalability, drag-and-drop can be combined with virtualization using `react-window` to handle very large lists.

These are the **three most common Senior React interview follow-ups** after implementing a sortable Todo list.

---

# 1. Keyboard Accessibility for Drag & Drop

Native HTML5 drag & drop **does not support keyboard**.

This is a big accessibility issue.

Users must be able to reorder using:

```txt
Tab       → Move focus
Space     → Grab item
ArrowUp   → Move up
ArrowDown → Move down
Space     → Drop item
Escape    → Cancel
```

This aligns with:

```txt
WCAG
ARIA
Keyboard-only navigation
```

---

## State

```jsx
const [focusedIndex, setFocusedIndex] = useState(-1);

const [isGrabbed, setIsGrabbed] = useState(false);
```

---

## Keyboard Handler

```jsx
function handleKeyDown(event, index) {
  switch (event.key) {
    case " ":
      event.preventDefault();

      setIsGrabbed((prev) => !prev);
      break;

    case "ArrowDown":
      event.preventDefault();

      if (isGrabbed) {
        moveTodo(index, index + 1);

        setFocusedIndex(index + 1);
      } else {
        setFocusedIndex(Math.min(index + 1, todos.length - 1));
      }

      break;

    case "ArrowUp":
      event.preventDefault();

      if (isGrabbed) {
        moveTodo(index, index - 1);

        setFocusedIndex(index - 1);
      } else {
        setFocusedIndex(Math.max(index - 1, 0));
      }

      break;

    case "Escape":
      setIsGrabbed(false);
      break;

    default:
      break;
  }
}
```

---

## Reorder Utility

```jsx
function moveTodo(fromIndex, toIndex) {
  if (toIndex < 0 || toIndex >= todos.length) {
    return;
  }

  const updated = [...todos];

  const [item] = updated.splice(fromIndex, 1);

  updated.splice(toIndex, 0, item);

  setTodos(updated);
}
```

---

## Accessible Todo Item

```jsx
<li
  key={todo.id}
  tabIndex={0}
  role="option"
  aria-grabbed={isGrabbed && focusedIndex === index}
  className={focusedIndex === index ? "focused" : ""}
  onKeyDown={(e) => handleKeyDown(e, index)}
  onFocus={() => setFocusedIndex(index)}
>
  {todo.text}
</li>
```

---

## Instructions For Users

Announce keyboard usage:

```jsx
<p aria-live="polite">
  {isGrabbed
    ? "Item grabbed. Use arrow keys to reorder."
    : "Use space to grab an item."}
</p>
```

---

## Example

Steps:

```txt
Tab       → Focus Todo
Space     → Grab
ArrowDown → Move down
Space     → Drop
```

---

# 2. Persist Todo List in localStorage

Requirement:

> Preserve todos across page refresh.

---

## Save on Update

```jsx
useEffect(() => {
  localStorage.setItem("todos", JSON.stringify(todos));
}, [todos]);
```

---

## Load on Mount

```jsx
const [todos, setTodos] = useState(() => {
  const saved = localStorage.getItem("todos");

  return saved ? JSON.parse(saved) : [];
});
```

---

## Flow

```txt
User Reorders
      ↓
State Updates
      ↓
useEffect Runs
      ↓
LocalStorage Updated

Refresh Page
      ↓
Load From LocalStorage
      ↓
UI Restored
```

---

## Improvements

Add:

```txt
Version Control
Migration Layer
Error Handling
```

Example:

```jsx
try {
  const saved = localStorage.getItem("todos");

  return saved ? JSON.parse(saved) : [];
} catch (error) {
  console.error("Corrupt Todos", error);

  return [];
}
```

---

# 3. Drag and Drop with Touch Support

Native HTML5 drag & drop **does not work on mobile devices**.

Interview follow-up:

> How would you make it touch-friendly?

---

## Option 1: Pointer Events (Modern & Best)

`pointerdown`, `pointermove`, and `pointerup` work for:

```txt
Mouse
Touch
Stylus
```

---

## State

```jsx
const [dragIndex, setDragIndex] = useState(null);
```

---

## Pointer Events

```jsx
function handlePointerDown(index) {
  setDragIndex(index);
}

function handlePointerEnter(index) {
  if (dragIndex === null || dragIndex === index) {
    return;
  }

  const updated = [...todos];

  const [item] = updated.splice(dragIndex, 1);

  updated.splice(index, 0, item);

  setDragIndex(index);
  setTodos(updated);
}

function handlePointerUp() {
  setDragIndex(null);
}
```

---

## Bind Events

```jsx
<li
  onPointerDown={() => handlePointerDown(index)}
  onPointerEnter={() => handlePointerEnter(index)}
  onPointerUp={handlePointerUp}
>
  {todo.text}
</li>
```

---

## Add CSS

```css
.todo-item {
  touch-action: none;
}
```

`touch-action: none` prevents page scrolling while dragging.

---

## Result

Works on:

```txt
Desktop
Android
iOS
Tablet
Stylus
```

---

## Option 2: Use dnd-kit (Production Best Practice)

For production, prefer:

```bash
npm install @dnd-kit/core
```

Because it supports:

```txt
✅ Touch
✅ Keyboard
✅ Accessibility
✅ Screen readers
✅ Auto-scroll
✅ Animations
✅ Nested lists
✅ Multi-select drag
```

---

# Comparison Table

| Feature       | HTML5 | Pointer Events | dnd-kit |
| ------------- | ----- | -------------- | ------- |
| Mouse         | ✅    | ✅             | ✅      |
| Touch         | ❌    | ✅             | ✅      |
| Keyboard      | ❌    | ❌             | ✅      |
| Screen Reader | ❌    | ❌             | ✅      |
| Animation     | ❌    | ❌             | ✅      |

---

# Interview Bonus: Combine All Features

Final architecture:

```txt
Todo List
   │
   ├── Add Todo
   ├── Delete Todo
   ├── Toggle Complete
   │
   ├── Drag & Drop
   │   ├── Mouse
   │   ├── Touch (Pointer Events)
   │   └── Keyboard Reorder
   │
   ├── LocalStorage Persistence
   │
   └── ARIA Accessibility
```

---

# Senior React Interview Answer

> To make the sortable todo list production-ready, I add three critical features. First, keyboard accessibility using Space to grab, Arrow keys to move, and Escape to cancel, along with ARIA attributes for screen readers. Second, persistence using `localStorage`, updated inside `useEffect` and hydrated during initial state creation, ensuring order is preserved across page refreshes. Third, touch support using `pointerdown`, `pointermove`, and `pointerup` events (or `dnd-kit` in production), which unifies mouse, touch, and stylus input. This design guarantees accessibility, reliability, and cross-device usability similar to production applications like Notion, Trello, and Jira.
