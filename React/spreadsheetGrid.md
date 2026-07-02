Below is a **React + TypeScript Spreadsheet Grid** implementation suitable for frontend interview/system-design practice.

It covers:

* Editable cells
* Row/column headers
* Keyboard navigation
* Cell selection
* Formula support like `=A1+B1`
* Copy-friendly state structure
* Scalable architecture discussion

***

# Spreadsheet Grid Requirements

## Functional Requirements

* Display grid with rows and columns
* User can edit any cell
* Support keyboard navigation:
  * `ArrowUp`
  * `ArrowDown`
  * `ArrowLeft`
  * `ArrowRight`
  * `Enter`
  * `Tab`
* Support formulas:
  * `=A1+B1`
  * `=A1*B1`
  * `=A1-B1`
  * `=A1/B1`
* Show computed value when cell is not editing
* Show raw value while editing

## Non-Functional Requirements

* Efficient rendering
* Extensible for large data
* Easy formula evaluation
* Accessible table-like layout
* Can be enhanced with virtualisation

***

# Data Model

```ts
type Cell = {
  rawValue: string;
  computedValue: string;
};

type GridData = Record<string, Cell>;
```

Example:

```ts
{
  A1: {
    rawValue: "10",
    computedValue: "10"
  },
  B1: {
    rawValue: "=A1+20",
    computedValue: "30"
  }
}
```

***

# Helper Functions

## `spreadsheetUtils.ts`

```ts
export function getColumnName(index: number): string {
  let columnName = "";
  let current = index;

  while (current >= 0) {
    columnName = String.fromCharCode((current % 26) + 65) + columnName;
    current = Math.floor(current / 26) - 1;
  }

  return columnName;
}

export function getCellId(rowIndex: number, colIndex: number): string {
  return `${getColumnName(colIndex)}${rowIndex + 1}`;
}

export function isFormula(value: string): boolean {
  return value.startsWith("=");
}

export function getCellNumericValue(
  cellId: string,
  gridData: Record<string, { rawValue: string; computedValue: string }>
): number {
  const cell = gridData[cellId];

  if (!cell) return 0;

  const value = Number(cell.computedValue);

  return Number.isNaN(value) ? 0 : value;
}
```

***

# Formula Evaluator

This is a simple interview-friendly evaluator.

## `formulaEvaluator.ts`

```ts
import { getCellNumericValue } from "./spreadsheetUtils";

type Cell = {
  rawValue: string;
  computedValue: string;
};

type GridData = Record<string, Cell>;

export function evaluateFormula(
  formula: string,
  gridData: GridData
): string {
  try {
    let expression = formula.slice(1);

    expression = expression.replace(/[A-Z]+[0-9]+/g, (cellId) => {
      return String(getCellNumericValue(cellId, gridData));
    });

    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
      return "ERROR";
    }

    const result = Function(`"use strict"; return (${expression})`)();

    if (
      typeof result !== "number" ||
      Number.isNaN(result) ||
      !Number.isFinite(result)
    ) {
      return "ERROR";
    }

    return String(result);
  } catch {
    return "ERROR";
  }
}

export function computeCellValue(
  rawValue: string,
  gridData: GridData
): string {
  if (!rawValue) return "";

  if (rawValue.startsWith("=")) {
    return evaluateFormula(rawValue, gridData);
  }

  return rawValue;
}
```

> Interview note: In production, avoid `Function()` and use a real parser or expression evaluator. For interviews, this is acceptable if you mention the security trade-off.

***

# Spreadsheet Component

## `SpreadsheetGrid.tsx`

```tsx
import React, { KeyboardEvent, useMemo, useState } from "react";
import "./SpreadsheetGrid.css";
import { computeCellValue } from "./formulaEvaluator";
import { getCellId, getColumnName } from "./spreadsheetUtils";

type Cell = {
  rawValue: string;
  computedValue: string;
};

type GridData = Record<string, Cell>;

type SelectedCell = {
  row: number;
  col: number;
};

type SpreadsheetGridProps = {
  rows?: number;
  columns?: number;
};

const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  rows = 20,
  columns = 10,
}) => {
  const [gridData, setGridData] = useState<GridData>({});
  const [selectedCell, setSelectedCell] = useState<SelectedCell>({
    row: 0,
    col: 0,
  });
  const [editingCell, setEditingCell] = useState<string | null>(null);

  const rowIndexes = useMemo(
    () => Array.from({ length: rows }, (_, index) => index),
    [rows]
  );

  const columnIndexes = useMemo(
    () => Array.from({ length: columns }, (_, index) => index),
    [columns]
  );

  const recalculateGrid = (updatedGrid: GridData): GridData => {
    const recalculatedGrid: GridData = { ...updatedGrid };

    Object.keys(recalculatedGrid).forEach((cellId) => {
      const rawValue = recalculatedGrid[cellId].rawValue;

      recalculatedGrid[cellId] = {
        rawValue,
        computedValue: computeCellValue(rawValue, recalculatedGrid),
      };
    });

    return recalculatedGrid;
  };

  const updateCell = (cellId: string, value: string) => {
    setGridData((prev) => {
      const nextGrid: GridData = {
        ...prev,
        {
          rawValue: value,
          computedValue: value,
        },
      };

      nextGrid[cellId].computedValue = computeCellValue(value, nextGrid);

      return recalculateGrid(nextGrid);
    });
  };

  const moveSelection = (rowDelta: number, colDelta: number) => {
    setSelectedCell((prev) => {
      const nextRow = Math.max(0, Math.min(rows - 1, prev.row + rowDelta));
      const nextCol = Math.max(0, Math.min(columns - 1, prev.col + colDelta));

      return {
        row: nextRow,
        col: nextCol,
      };
    });
  };

  const handleKeyDown = (
    event: KeyboardEvent<HTMLInputElement>,
    rowIndex: number,
    colIndex: number
  ) => {
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        setEditingCell(null);
        moveSelection(1, 0);
        break;

      case "Tab":
        event.preventDefault();
        setEditingCell(null);
        moveSelection(0, event.shiftKey ? -1 : 1);
        break;

      case "ArrowUp":
        if (!editingCell) {
          event.preventDefault();
          moveSelection(-1, 0);
        }
        break;

      case "ArrowDown":
        if (!editingCell) {
          event.preventDefault();
          moveSelection(1, 0);
        }
        break;

      case "ArrowLeft":
        if (!editingCell) {
          event.preventDefault();
          moveSelection(0, -1);
        }
        break;

      case "ArrowRight":
        if (!editingCell) {
          event.preventDefault();
          moveSelection(0, 1);
        }
        break;

      case "Escape":
        setEditingCell(null);
        break;

      default:
        break;
    }
  };

  return (
    <div className="spreadsheet">
      <div
        className="spreadsheet__grid"
        style={{
          gridTemplateColumns: `48px repeat(${columns}, 120px)`,
        }}
      >
        <div className="spreadsheet__corner" />

        {columnIndexes.map((colIndex) => (
          <div key={colIndex} className="spreadsheet__column-header">
            {getColumnName(colIndex)}
          </div>
        ))}

        {rowIndexes.map((rowIndex) => (
          <React.Fragment key={rowIndex}>
            <div className="spreadsheet__row-header">{rowIndex + 1}</div>

            {columnIndexes.map((colIndex) => {
              const cellId = getCellId(rowIndex, colIndex);
              const cell = gridData[cellId];

              const isSelected =
                selectedCell.row === rowIndex && selectedCell.col === colIndex;

              const isEditing = editingCell === cellId;

              const displayValue = isEditing
                ? cell?.rawValue ?? ""
                : cell?.computedValue ?? "";

              return (
                <input
                  key={cellId}
                  className={[
                    "spreadsheet__cell",
                    isSelected ? "spreadsheet__cell--selected" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  value={displayValue}
                  onFocus={() => {
                    setSelectedCell({
                      row: rowIndex,
                      col: colIndex,
                    });
                  }}
                  onDoubleClick={() => {
                    setEditingCell(cellId);
                  }}
                  onChange={(event) => {
                    updateCell(cellId, event.target.value);
                  }}
                  onKeyDown={(event) =>
                    handleKeyDown(event, rowIndex, colIndex)
                  }
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default SpreadsheetGrid;
```

***

# CSS

## `SpreadsheetGrid.css`

```css
.spreadsheet {
  width: 100%;
  height: 600px;
  overflow: auto;
  border: 1px solid #d1d5db;
  font-family: Arial, sans-serif;
  background: #ffffff;
}

.spreadsheet__grid {
  display: grid;
  width: max-content;
}

.spreadsheet__corner,
.spreadsheet__column-header,
.spreadsheet__row-header {
  height: 32px;
  background: #f3f4f6;
  border-right: 1px solid #d1d5db;
  border-bottom: 1px solid #d1d5db;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  position: sticky;
  z-index: 2;
}

.spreadsheet__corner {
  left: 0;
  top: 0;
  z-index: 4;
}

.spreadsheet__column-header {
  top: 0;
  position: sticky;
}

.spreadsheet__row-header {
  left: 0;
  position: sticky;
}

.spreadsheet__cell {
  width: 120px;
  height: 32px;
  padding: 4px 8px;
  border: none;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
  outline: none;
  font-size: 13px;
  box-sizing: border-box;
}

.spreadsheet__cell:focus {
  background: #eff6ff;
}

.spreadsheet__cell--selected {
  box-shadow: inset 0 0 0 2px #2563eb;
  background: #eff6ff;
}
```

***

# Usage

## `App.tsx`

```tsx
import SpreadsheetGrid from "./SpreadsheetGrid";

export default function App() {
  return (
    <div style={{ padding: "24px" }}>
      <h2>Spreadsheet Grid</h2>

      <SpreadsheetGrid rows={30} columns={12} />
    </div>
  );
}
```

***

# Example Inputs

| Cell | Value    |
| ---- | -------- |
| A1   | `10`     |
| B1   | `20`     |
| C1   | `=A1+B1` |
| D1   | `=C1*2`  |

Result:

```text
A1 = 10
B1 = 20
C1 = 30
D1 = 60
```

***

# Key Design Decisions

## 1. Sparse Data Model

Instead of storing every empty cell:

```ts
Cell[][]
```

we store only edited cells:

```ts
Record<string, Cell>
```

This is memory efficient.

```ts
{
  A1: { rawValue: "10", computedValue: "10" },
  B1: { rawValue: "=A1+5", computedValue: "15" }
}
```

Useful for large spreadsheets where most cells are empty.

***

## 2. Raw Value vs Computed Value

Each cell stores:

```ts
rawValue
computedValue
```

Example:

```ts
{
  rawValue: "=A1+B1",
  computedValue: "30"
}
```

This allows:

* Editing formulas
* Displaying calculated results
* Recalculating dependent cells

***

## 3. Formula Evaluation

Simple formula:

```text
=A1+B1
```

is converted into:

```text
10+20
```

Then evaluated.

In production, you would use:

* Formula parser
* Dependency graph
* Cycle detection
* Topological sorting
* Worker thread for heavy calculation

***

# Important Interview Follow-Ups

## 1. How to Handle Large Grids?

For a huge grid like:

```text
100,000 rows × 100 columns
```

do not render all cells.

Use virtualisation:

```bash
npm install react-window
```

Architecture:

```text
Visible viewport only
        ↓
Virtualised rows
        ↓
Virtualised columns
        ↓
Render only visible cells
```

Libraries:

* `react-window`
* `react-virtualized`
* `@tanstack/react-virtual`

***

## 2. How to Handle Formula Dependencies?

For this:

```text
A1 = 10
B1 = =A1+5
C1 = =B1*2
```

When `A1` changes, both `B1` and `C1` must recalculate.

Use a dependency graph:

```text
A1 → B1 → C1
```

Then recalculate in topological order.

***

## 3. How to Detect Circular References?

Example:

```text
A1 = B1 + 1
B1 = A1 + 1
```

This creates a cycle.

Use DFS cycle detection:

```text
WHITE = unvisited
GREY = visiting
BLACK = visited
```

If we revisit a `GREY` node, there is a circular dependency.

***

# Production Architecture

```text
Spreadsheet UI
     |
     v
Selection Manager
     |
     v
Cell Editor
     |
     v
Formula Engine
     |
     v
Dependency Graph
     |
     v
Grid Store
     |
     v
Virtualised Renderer
```

***

# Senior Interview Explanation

You can explain it like this:

> I would model the spreadsheet using a sparse object map where each key is a cell ID like `A1` or `B2`. Each cell keeps both the raw input and computed value. For simple formulas, I parse references like `A1`, replace them with computed values, and evaluate the expression. For production scale, I would introduce a formula parser, dependency graph, cycle detection, and virtualised rendering to support thousands of rows efficiently.

***

# Features to Add Next

If you want to make this more advanced, add:

* Cell range selection
* Drag fill handle
* Copy/paste support
* Undo/redo stack
* Formula autocomplete
* Frozen rows and columns
* Column resizing
* Row resizing
* Cell formatting
* CSV import/export
* Virtual scrolling
