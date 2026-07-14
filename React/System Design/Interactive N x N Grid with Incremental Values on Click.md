# Interactive N x N Grid with Incremental Values on Click

### React Frontend System Design + Complete Interview-Ready Code

This is a very popular **React machine coding interview problem** because it tests:

✅ Dynamic grid rendering

✅ State management for a matrix

✅ Immutable updates

✅ Event handling per cell

✅ Different mutation rules per click type

✅ Reusability

✅ Performance optimizations

✅ Reset functionality

✅ Optional undo/redo

Real-world use cases:

```txt
Sudoku
Chess
Minesweeper
Reactive Dashboards
Data grid editors
Puzzle games
Excel-like sheets
Heatmaps
```

---

# 1. Requirements

We need to:

✅ Generate `N x N` grid

✅ Each cell shows incremental value: 1, 2, 3, ... N²

✅ Left click → +1

✅ Right click → -1

✅ Shift + click → ×2

✅ Ctrl + click → ÷2

✅ Double click → reset that cell

✅ Reset entire grid

✅ Reusable & interactive

We can adjust click behaviours based on the interview.

The example below uses:

```txt
Left click      → +1
Right click     → -1
Shift + click   → *2
Double click    → Reset
Reset button    → clears grid
```

---

# 2. System Design

## Grid Data

Grid is stored as a 2D array:

```txt
[
  [ 1,  2,  3,  4],
  [ 5,  6,  7,  8],
  [ 9, 10, 11, 12],
  [13, 14, 15, 16]
]
```

For N = 4.

---

## Data Flow

```txt
User Clicks Cell
      ↓
Detect Click Type
      ↓
Apply Update Rule
      ↓
Update grid immutably
      ↓
Rerender Cell (React memo)
```

---

# 3. Component Structure

```txt
App
│
├── Toolbar
│    ├── Grid Size Input
│    └── Reset Button
│
├── Grid
│    ├── Row
│    │    └── Cell
```

---

# 4. State Design

```jsx
const [size, setSize] = useState(4);

const [grid, setGrid] = useState(generateGrid(4));
```

---

# 5. Generate Initial Grid

Incremental values:

```txt
1, 2, 3
4, 5, 6
7, 8, 9
```

Utility:

```jsx
function generateGrid(n) {
  const grid = [];

  let value = 1;

  for (let r = 0; r < n; r++) {
    const row = [];

    for (let c = 0; c < n; c++) {
      row.push(value++);
    }

    grid.push(row);
  }

  return grid;
}
```

---

# 6. Immutable Cell Update

Never mutate directly.

```jsx
function updateCell(grid, rowIndex, colIndex, updater) {
  return grid.map((row, r) =>
    r === rowIndex
      ? row.map((val, c) => (c === colIndex ? updater(val) : val))
      : row,
  );
}
```

Two-level immutability.

---

# 7. Click Rules

```jsx
function handleClick(event, rowIndex, colIndex) {
  // Different behaviour per click
  if (event.shiftKey) {
    setGrid((prev) => updateCell(prev, rowIndex, colIndex, (val) => val * 2));
  } else {
    setGrid((prev) => updateCell(prev, rowIndex, colIndex, (val) => val + 1));
  }
}

function handleRightClick(event, rowIndex, colIndex) {
  event.preventDefault();

  setGrid((prev) => updateCell(prev, rowIndex, colIndex, (val) => val - 1));
}

function handleDoubleClick(rowIndex, colIndex) {
  const original = generateGrid(size);

  setGrid((prev) =>
    updateCell(prev, rowIndex, colIndex, () => original[rowIndex][colIndex]),
  );
}
```

---

# 8. Reset Grid

```jsx
function resetGrid() {
  setGrid(generateGrid(size));
}
```

---

# 9. Full App.jsx

```jsx
import { useState } from "react";
import "./styles.css";

function generateGrid(n) {
  const grid = [];
  let value = 1;

  for (let r = 0; r < n; r++) {
    const row = [];

    for (let c = 0; c < n; c++) {
      row.push(value++);
    }

    grid.push(row);
  }

  return grid;
}

function updateCell(grid, r, c, updater) {
  return grid.map((row, ri) =>
    ri === r ? row.map((val, ci) => (ci === c ? updater(val) : val)) : row,
  );
}

export default function App() {
  const [size, setSize] = useState(4);

  const [grid, setGrid] = useState(generateGrid(4));

  function handleSizeChange(event) {
    const value = Number(event.target.value);

    if (isNaN(value) || value < 1) {
      return;
    }

    setSize(value);
    setGrid(generateGrid(value));
  }

  function handleClick(event, r, c) {
    if (event.shiftKey) {
      setGrid((prev) => updateCell(prev, r, c, (val) => val * 2));
    } else {
      setGrid((prev) => updateCell(prev, r, c, (val) => val + 1));
    }
  }

  function handleRightClick(event, r, c) {
    event.preventDefault();

    setGrid((prev) => updateCell(prev, r, c, (val) => val - 1));
  }

  function handleDoubleClick(r, c) {
    const original = generateGrid(size);

    setGrid((prev) => updateCell(prev, r, c, () => original[r][c]));
  }

  function resetGrid() {
    setGrid(generateGrid(size));
  }

  return (
    <div className="container">
      <h2>Interactive N x N Grid</h2>

      <div className="toolbar">
        <label>Size:</label>

        <input type="number" value={size} min={1} onChange={handleSizeChange} />

        <button onClick={resetGrid}>Reset</button>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${size}, 50px)`,
        }}
      >
        {grid.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className="cell"
              onClick={(e) => handleClick(e, r, c)}
              onContextMenu={(e) => handleRightClick(e, r, c)}
              onDoubleClick={() => handleDoubleClick(r, c)}
            >
              {val}
            </div>
          )),
        )}
      </div>

      <ul className="help">
        <li>Click → +1</li>
        <li>Right Click → -1</li>
        <li>Shift + Click → x2</li>
        <li>Double Click → Reset Cell</li>
        <li>Reset Button → Reset Grid</li>
      </ul>
    </div>
  );
}
```

---

# 10. CSS

```css
body {
  font-family: Arial;
}

.container {
  padding: 20px;
}

.toolbar {
  display: flex;
  gap: 10px;
  align-items: center;

  margin-bottom: 12px;
}

.toolbar input {
  width: 60px;
  padding: 4px;
}

.grid {
  display: grid;
  gap: 4px;
}

.cell {
  width: 50px;
  height: 50px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: #f3f4f6;
  border: 1px solid #d1d5db;

  border-radius: 6px;

  cursor: pointer;

  transition: transform 0.1s ease;
}

.cell:hover {
  background: #e0e7ff;
}

.cell:active {
  transform: scale(0.95);
}

.help {
  margin-top: 12px;
  color: #374151;
}
```

---

# 11. Behavior Examples

## Grid Size = 3

Initial:

```txt
1 2 3
4 5 6
7 8 9
```

## Click Cell (0, 0)

Value increases:

```txt
2 2 3
4 5 6
7 8 9
```

## Right Click Cell (0, 0)

Value decreases:

```txt
1 2 3
4 5 6
7 8 9
```

## Shift + Click Cell (1, 1)

Value doubles:

```txt
1 2 3
4 10 6
7 8 9
```

## Double Click Cell (1, 1)

Value resets to original:

```txt
1 2 3
4 5 6
7 8 9
```

## Reset Grid

All cells reset to incremental values.

---

# 12. Complexity

## Cell Update

```txt
O(N) for row copy
O(N) for cell copy
Total: O(N)
```

For N x N grid:

```txt
O(N)
```

Efficient with React state.

## Render

```txt
O(N²)
```

For very large grids, use `React.memo(Cell)` to prevent unnecessary rerenders.

---

# 13. Interview Follow-Up Questions

### Q1. Why immutable updates?

Because React uses reference comparison.

Immutable updates ensure React detects changes efficiently.

---

### Q2. Why not mutate directly?

Direct mutation:

```txt
❌ React may skip rerender
❌ Breaks time-travel
❌ Breaks memoization
❌ Breaks undo/redo
```

---

### Q3. How to scale to 100x100?

- Use `React.memo(Cell)`
- Use `useCallback` for handlers
- Store grid as a flat array
- Use virtualization for very large grids

---

### Q4. How to persist state?

LocalStorage:

```jsx
useEffect(() => {
  localStorage.setItem("grid", JSON.stringify(grid));
}, [grid]);
```

---

### Q5. Add undo/redo?

Store history:

```jsx
const [history, setHistory] = useState([grid]);

const [current, setCurrent] = useState(0);
```

Same time-travel pattern used in:

```txt
Excel
VS Code
Notion
Photoshop
```

---

# 14. Extensions (Senior Level)

✅ Undo/Redo

✅ Different rules per row/column

✅ Persist grid

✅ Time-travel history

✅ Save & load configurations

✅ Multi-select cells

✅ Range update (drag-select)

✅ Animations on click

✅ Heatmap coloring

✅ Real-time collaboration

✅ Cell input editing

✅ Formula evaluation (Excel-like)

---

# 15. Data Flow Diagram

```txt
User Clicks Cell
      │
      ▼
Detect Modifier Keys
      │
      ▼
Choose Update Rule
      │
      ▼
Update Grid Immutably
      │
      ▼
React Reconciles
      │
      ▼
Cell Rerenders
```

---

# 16. Senior React Interview Answer

> I would generate the grid as a 2D array using nested loops with sequential values. Grid updates are performed immutably by copying only the affected row and cell, which allows React to efficiently reconcile changes and enables `React.memo` for optimization. Different click behaviors are implemented by inspecting keyboard modifiers (Shift, Ctrl) or event types (contextmenu, dblclick), each mapping to a distinct update rule. A reset button restores the incremental values, while double-click resets a specific cell to its original value. For scale, I would use `useCallback`, memoized cells, virtualization for large grids, undo/redo history, and persistence in localStorage. This design mirrors the interaction models found in Excel, Notion databases, Chess.com, and Minesweeper-style applications.

# N x N Interactive Grid – Advanced Features

### Undo / Redo • Performance Optimization • Persistence

These are the **three most common Senior React interview follow-ups** after building the interactive grid.

They convert a basic component into a **scalable, resilient, enterprise-grade grid** similar to:

```txt
Excel
Notion Databases
Airtable
Photoshop
Chess.com
Figma canvas
```

---

# 1. Add Undo / Redo Functionality

## Concept

Use two stacks:

```txt
history[]  → past states
future[]   → undone states
```

Or simpler:

Use one **history array** with a pointer.

```txt
history = [G0, G1, G2, G3]
current = 3
```

Undo:

```txt
current = 2
```

Redo:

```txt
current = 3
```

New action after undo → truncate future:

```txt
history = [G0, G1, G2, G4]
current = 3
```

This mirrors:

```txt
Excel
VS Code
Notion
Figma
Google Docs
```

---

## State Design

```jsx
const [history, setHistory] = useState([generateGrid(size)]);

const [current, setCurrent] = useState(0);
```

---

## Get Current Grid

```jsx
const grid = history[current];
```

---

## Immutable Grid Update

```jsx
function applyUpdate(updater, r, c) {
  const nextGrid = updateCell(grid, r, c, updater);

  const nextHistory = history.slice(0, current + 1);

  setHistory([...nextHistory, nextGrid]);

  setCurrent(nextHistory.length);
}
```

Whenever a new state is added:

✅ Older redo history is discarded

---

## Undo

```jsx
function handleUndo() {
  if (current > 0) {
    setCurrent(current - 1);
  }
}
```

---

## Redo

```jsx
function handleRedo() {
  if (current < history.length - 1) {
    setCurrent(current + 1);
  }
}
```

---

## Reset

```jsx
function handleReset() {
  const fresh = generateGrid(size);

  setHistory([fresh]);

  setCurrent(0);
}
```

---

## Toolbar

```jsx
<button
  disabled={
    current === 0
  }
  onClick={handleUndo}
>
  Undo
</button>

<button
  disabled={
    current ===
    history.length - 1
  }
  onClick={handleRedo}
>
  Redo
</button>

<button
  onClick={handleReset}
>
  Reset
</button>
```

---

## Update Click Handlers to Use `applyUpdate`

```jsx
function handleClick(event, r, c) {
  if (event.shiftKey) {
    applyUpdate((val) => val * 2, r, c);
  } else {
    applyUpdate((val) => val + 1, r, c);
  }
}
```

---

## Complexity

- Undo → O(1)
- Redo → O(1)
- Update → O(N) for row/column copy

---

## Keyboard Shortcuts (Interview Bonus)

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
}, [current, history]);
```

---

# 2. Optimize Grid Rendering for Large N

For N ≥ 30, rendering thousands of cells causes performance issues:

```txt
❌ Slow renders
❌ Long paint times
❌ High memory usage
❌ Janky updates
```

Optimizations required:

---

## Optimization 1: React.memo(Cell)

Prevent unnecessary re-renders.

```jsx
const Cell = React.memo(function Cell({
  value,
  onClick,
  onContextMenu,
  onDoubleClick,
}) {
  return (
    <div
      className="cell"
      onClick={onClick}
      onContextMenu={onContextMenu}
      onDoubleClick={onDoubleClick}
    >
      {value}
    </div>
  );
});
```

Only re-renders when props change.

---

## Optimization 2: Stable Handlers with useCallback

Otherwise, `React.memo` won't help.

```jsx
const handleCellClick = useCallback(
  (r, c) => (event) => handleClick(event, r, c),
  [],
);
```

---

## Optimization 3: Flat Array Instead of 2D

Convert grid to a 1D array:

```jsx
const flat = useMemo(() => grid.flat(), [grid]);
```

React reconciles simpler data structures faster.

---

## Optimization 4: Use CSS Grid

```css
.grid {
  display: grid;
  grid-template-columns: repeat(var(--size), 40px);
}
```

Better than manual `flex` layout for large grids.

---

## Optimization 5: Virtualization for HUGE N

If N ≥ 100 or 1000:

```txt
Render 10,000+ cells
= extremely slow
```

Use:

```bash
npm install react-window
```

Example:

```jsx
import { FixedSizeGrid } from "react-window";

<FixedSizeGrid
  columnCount={size}
  rowCount={size}
  columnWidth={40}
  rowHeight={40}
  height={600}
  width={800}
>
  {({ columnIndex, rowIndex, style }) => (
    <div style={style} onClick={(e) => handleClick(e, rowIndex, columnIndex)}>
      {grid[rowIndex][columnIndex]}
    </div>
  )}
</FixedSizeGrid>;
```

Only visible cells render.

Used by:

```txt
Google Sheets
Airtable
Notion tables
Datagrid libraries
```

---

## Optimization 6: Batch Updates

React 18 automatically batches state updates.

For heavy operations:

```jsx
import { startTransition } from "react";

startTransition(() => {
  setGrid(nextGrid);
});
```

Prevents UI freezes for large updates.

---

## Optimization 7: Web Workers (Advanced)

If cell updates need heavy computation:

```txt
Formula parsing
Custom rules
Formula recalculation
```

Move to Web Workers.

---

## Optimization 8: Avoid Anonymous Functions

This is expensive:

```jsx
onClick={(e) =>
  handleClick(e, r, c)
}
```

Create optimized handler factory:

```jsx
const clickHandlerFactory = useMemo(() => {
  return (r, c) => (event) => handleClick(event, r, c);
}, []);
```

For very large grids.

---

# 3. Persist Grid State in LocalStorage

## Why?

State survives:

```txt
Page refresh
Browser restart
Tab close
Session expiry
```

Real applications like Notion, Excel, Google Sheets rely on it.

---

## Load on Mount

```jsx
const [size, setSize] = useState(() => {
  const saved = localStorage.getItem("grid-size");

  return saved ? Number(saved) : 4;
});

const [history, setHistory] = useState(() => {
  const saved = localStorage.getItem("grid-history");

  return saved ? JSON.parse(saved) : [generateGrid(size)];
});

const [current, setCurrent] = useState(() => {
  const saved = localStorage.getItem("grid-current");

  return saved ? Number(saved) : 0;
});
```

---

## Save on Change

Persist grid + history:

```jsx
useEffect(() => {
  try {
    localStorage.setItem("grid-history", JSON.stringify(history));

    localStorage.setItem("grid-current", current);

    localStorage.setItem("grid-size", size);
  } catch (error) {
    console.warn("Storage limit reached");
  }
}, [history, current, size]);
```

---

## Handle Storage Failure

```jsx
try {
  localStorage.setItem(...);
} catch (error) {
  ...
}
```

localStorage limit is \~5MB.

For large grids, use IndexedDB.

---

## Persistence Best Practices

✅ Debounce writes for large grids

✅ Store minimal history

✅ Store max N states

✅ Versioning schema

✅ Handle corrupt data

Example limits:

```jsx
const MAX_HISTORY = 50;

setHistory((prev) => prev.slice(-MAX_HISTORY));
```

Prevents localStorage bloat.

---

## Reset Persistence

Add:

```jsx
function handleReset() {
  const fresh = generateGrid(size);

  setHistory([fresh]);
  setCurrent(0);

  localStorage.removeItem("grid-history");

  localStorage.removeItem("grid-current");
}
```

---

# Full Data Flow Diagram

```txt
User Interaction
        │
        ▼
Apply Update
        │
        ▼
Immutable Grid Change
        │
        ▼
Push to History
        │
        ▼
Update Current Pointer
        │
        ▼
Persist to LocalStorage
        │
        ▼
Rerender only affected cells (React.memo)
        │
        ▼
Undo / Redo Available
        │
        ▼
Reset if needed
```

---

# Extensions (Senior Level)

✅ Undo/Redo via `useReducer`

✅ Time travel debugging

✅ Save/Load presets

✅ Debounced persistence

✅ IndexedDB for large data

✅ Virtualized rendering

✅ Collaborative editing (WebSocket)

✅ Multiple grids

✅ Grid formulas

✅ Cell formatting

✅ Copy/paste range

---

# Senior React Interview Answer

> To make the grid production-grade, I add three enhancements. First, **undo/redo** is implemented using a history array and a current pointer, allowing O(1) navigation while immutable grid updates ensure clean state transitions. Any new update after undo automatically discards the redo history to maintain timeline correctness. Second, **rendering performance** is optimized using `React.memo` for cells, `useCallback` for stable click handlers, `useMemo` for derived data, CSS grid for layout, `startTransition` for large state updates, and virtualization using `react-window` for grids larger than 100x100. Third, **persistence** is implemented using localStorage — hydrating the grid on mount and saving grid, history, and current index on updates, with error handling and history size limits to avoid overflow. This design mirrors the interaction and performance patterns used in Excel, Notion databases, Google Sheets, and enterprise datagrid systems.
