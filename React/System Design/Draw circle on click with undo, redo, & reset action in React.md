# Draw Circle on Click with Undo, Redo & Reset in React

## Frontend System Design + Complete Interview-Ready Code

This is one of the most popular **React Machine Coding Interview** problems.

Examples asked at:

```txt
Amazon
Flipkart
Uber
Atlassian
Adobe
Zomato
```

Interviewers ask this because it covers:

✅ State management

✅ Event handling

✅ Immutable data updates

✅ Undo / Redo logic (stack-based)

✅ Reset functionality

✅ Time-travel debugging

✅ SVG / DOM rendering

✅ Performance considerations

✅ Interview-friendly incremental design

---

# 1. Requirements

## Functional

✅ Click on canvas → draw a circle

✅ Click Undo → remove last circle

✅ Click Redo → restore last undone circle

✅ Click Reset → clear all circles

✅ Circles stay after undo/redo

✅ Buttons disabled when unavailable

---

# 2. System Design

## State Model

Two stacks:

```txt
history[]  → committed circles
future[]   → undone circles ready to redo
```

Example after 3 clicks:

```txt
history = [C1, C2, C3]
future  = []
```

Undo:

```txt
history = [C1, C2]
future  = [C3]
```

Redo:

```txt
history = [C1, C2, C3]
future  = []
```

Click new circle after undo:

```txt
history = [C1, C2, C4]
future  = []    ← redo history cleared
```

Reset:

```txt
history = []
future  = []
```

---

## Data Model

```js
{
  id: "c1",
  x: 100,
  y: 200
}
```

---

# 3. Component Design

```txt
App
│
├── Toolbar
│    ├── Undo Button
│    ├── Redo Button
│    └── Reset Button
│
└── Canvas
     └── Circle (SVG or Absolute Div)
```

---

# 4. Project Structure

```txt
src/
│
├── App.jsx
├── components/
│   ├── Canvas.jsx
│   └── Toolbar.jsx
│
└── styles.css
```

---

# 5. State

```jsx
const [history, setHistory] = useState([]);

const [future, setFuture] = useState([]);
```

---

# 6. Draw Circle on Click

```jsx
function handleCanvasClick(e) {
  const rect = e.currentTarget.getBoundingClientRect();

  const x = e.clientX - rect.left;

  const y = e.clientY - rect.top;

  const newCircle = {
    id: Date.now().toString(),
    x,
    y,
  };

  setHistory((prev) => [...prev, newCircle]);

  setFuture([]);
}
```

Whenever a new circle is drawn:

Redo history must be cleared because the timeline changes.

---

# 7. Undo Logic

```jsx
function handleUndo() {
  if (history.length === 0) return;

  const last = history[history.length - 1];

  setHistory((prev) => prev.slice(0, -1));

  setFuture((prev) => [last, ...prev]);
}
```

---

# 8. Redo Logic

```jsx
function handleRedo() {
  if (future.length === 0) return;

  const [first, ...rest] = future;

  setHistory((prev) => [...prev, first]);

  setFuture(rest);
}
```

---

# 9. Reset Logic

```jsx
function handleReset() {
  setHistory([]);
  setFuture([]);
}
```

---

# 10. Canvas Component

```jsx
export default function Canvas({ circles, onClick }) {
  return (
    <div className="canvas" onClick={onClick}>
      {circles.map((c) => (
        <div
          key={c.id}
          className="circle"
          style={{
            left: c.x - 20,
            top: c.y - 20,
          }}
        />
      ))}
    </div>
  );
}
```

---

# 11. Toolbar Component

```jsx
export default function Toolbar({ onUndo, onRedo, onReset, canUndo, canRedo }) {
  return (
    <div className="toolbar">
      <button onClick={onUndo} disabled={!canUndo}>
        Undo
      </button>

      <button onClick={onRedo} disabled={!canRedo}>
        Redo
      </button>

      <button onClick={onReset}>Reset</button>
    </div>
  );
}
```

---

# 12. Full App.jsx

```jsx
import { useState } from "react";
import Canvas from "./components/Canvas";
import Toolbar from "./components/Toolbar";
import "./styles.css";

export default function App() {
  const [history, setHistory] = useState([]);

  const [future, setFuture] = useState([]);

  function handleCanvasClick(e) {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;

    const y = e.clientY - rect.top;

    const newCircle = {
      id: Date.now().toString(),
      x,
      y,
    };

    setHistory((prev) => [...prev, newCircle]);

    setFuture([]);
  }

  function handleUndo() {
    if (history.length === 0) return;

    const last = history[history.length - 1];

    setHistory((prev) => prev.slice(0, -1));

    setFuture((prev) => [last, ...prev]);
  }

  function handleRedo() {
    if (future.length === 0) return;

    const [first, ...rest] = future;

    setHistory((prev) => [...prev, first]);

    setFuture(rest);
  }

  function handleReset() {
    setHistory([]);
    setFuture([]);
  }

  return (
    <div className="container">
      <h1>Circle Drawing App</h1>

      <Toolbar
        onUndo={handleUndo}
        onRedo={handleRedo}
        onReset={handleReset}
        canUndo={history.length > 0}
        canRedo={future.length > 0}
      />

      <Canvas circles={history} onClick={handleCanvasClick} />
    </div>
  );
}
```

---

# 13. CSS

```css
body {
  font-family: Arial;
}

.container {
  padding: 20px;
  text-align: center;
}

.toolbar {
  display: flex;
  gap: 10px;
  justify-content: center;

  margin-bottom: 20px;
}

.toolbar button {
  padding: 8px 14px;
  background: #2563eb;
  color: white;

  border: none;
  border-radius: 6px;

  cursor: pointer;
}

.toolbar button:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}

.canvas {
  position: relative;

  width: 600px;
  height: 400px;

  margin: 0 auto;

  background: #f3f4f6;
  border: 1px solid #d1d5db;

  border-radius: 8px;
  cursor: crosshair;
}

.circle {
  position: absolute;
  width: 40px;
  height: 40px;

  background: #3b82f6;
  border-radius: 50%;
  pointer-events: none;
}
```

---

# 14. Behaviour

## Click on Canvas

```txt
history = [C1]
future  = []
```

Click again:

```txt
history = [C1, C2]
future  = []
```

---

## Undo

```txt
history = [C1]
future  = [C2]
```

Undo again:

```txt
history = []
future  = [C1, C2]
```

---

## Redo

```txt
history = [C1]
future  = [C2]
```

Redo again:

```txt
history = [C1, C2]
future  = []
```

---

## New Click After Undo

```txt
history = [C1, C3]
future  = []    ← redo cleared
```

Perfect time-travel semantics.

---

## Reset

```txt
history = []
future  = []
```

Cleared.

---

# 15. Complexity Analysis

## Undo

```txt
O(1)
```

Only pointer moves.

## Redo

```txt
O(1)
```

Only pointer moves.

## Draw

```txt
O(1)
```

Add one circle.

## Reset

```txt
O(1)
```

Two state changes.

## Rendering

```txt
O(n)
```

Where n = circles.

Very efficient.

---

# 16. Interview Follow-Up Questions

### Q1. Why two stacks?

`history` maintains current drawings.

`future` allows redo.

Similar to VS Code, Notion, Figma.

---

### Q2. What if user draws after undo?

Redo history cleared:

```jsx
setFuture([]);
```

Matches real-world behaviour of undo/redo systems.

---

### Q3. What if we want undo up to N steps only?

Add limit:

```jsx
history.slice(-50);
```

---

### Q4. What if user drags to draw?

Track:

```txt
onMouseDown
onMouseMove
onMouseUp
```

Update coordinates continuously.

---

### Q5. What if we want animations?

Use:

```txt
framer-motion
CSS transitions
```

---

# 17. Extensions (Senior Level)

✅ Draw shapes (rectangles, lines, polygons)

✅ Color picker

✅ Persist drawings in localStorage

✅ Persist drawings in backend

✅ Multi-user drawings (collaborative canvas)

✅ SVG export

✅ Real-time collaboration using WebSockets

✅ Keyboard shortcuts (Ctrl+Z / Ctrl+Y)

✅ Layered drawings

✅ Zoom & Pan

✅ Undo entire strokes (grouping)

---

# 18. Keyboard Shortcuts (Optional)

```jsx
useEffect(() => {
  function handleKey(event) {
    if (event.ctrlKey && event.key === "z") {
      handleUndo();
    }

    if (event.ctrlKey && event.key === "y") {
      handleRedo();
    }
  }

  window.addEventListener("keydown", handleKey);

  return () => window.removeEventListener("keydown", handleKey);
}, [handleUndo, handleRedo]);
```

---

# 19. Persistence (Optional)

```jsx
useEffect(() => {
  localStorage.setItem("history", JSON.stringify(history));
}, [history]);
```

Load on mount:

```jsx
const [history, setHistory] = useState(() => {
  const saved = localStorage.getItem("history");

  return saved ? JSON.parse(saved) : [];
});
```

---

# 20. Data Flow Diagram

```txt
Click Canvas
     ↓
Push Circle to History
     ↓
Clear Future
     ↓
Render Circles

Undo:
     ↓
Pop from History
     ↓
Push to Future

Redo:
     ↓
Pop from Future
     ↓
Push to History

Reset:
     ↓
Clear Both Stacks
```

---

# 21. Senior React Interview Answer

> I would model the drawing state using two stacks: `history` (drawn circles) and `future` (undone circles). Clicking on the canvas records the click coordinates and pushes a new circle to `history`, while clearing `future` because the timeline changes. Undo moves the last circle from `history` to `future`, while Redo moves it back. Reset clears both stacks. This design produces O(1) undo, redo, and draw operations. To enhance UX, I would add keyboard shortcuts (Ctrl+Z / Ctrl+Y), disable buttons based on availability, animate transitions with framer-motion, and persist state in localStorage or a backend for collaboration. This time-travel approach mirrors how Figma, Notion, VS Code, and Excalidraw implement drawing history.
