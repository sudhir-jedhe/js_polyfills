*** copy How do I add full WCAG grid keyboard navigation with Arrow keys and Shift+Space selection to a React data table?.md ***

To make a data table compliant with the **WAI-ARIA Grid Design Pattern**, you must implement:

1. **Roving `tabIndex**`: Only one cell in the entire grid has `tabIndex={0}` at any time. All other cells have `tabIndex={-1}`.
2. **2D Coordinate Navigation**:

* **Arrow Left / Right**: Moves focus between adjacent cells in the same row.
* **Arrow Up / Down**: Moves focus between adjacent cells in the same column (including column headers).
* **Home / End**: Moves focus to the first/last cell in the current row.
* **Ctrl + Home / Ctrl + End**: Moves focus to the top-left/bottom-right cell of the grid.

1. **Keyboard Range Selection**:

* **Space**: Toggles selection for the current row.
* **Shift + Space**: Extends selection from the anchor row to the active row.
* **Shift + Arrow Up / Down**: Moves active focus and extends the selected range simultaneously.

1. **ARIA Grid Roles**: `role="grid"`, `role="row"`, `role="columnheader"`, `role="gridcell"`, `aria-multiselectable="true"`, and `aria-selected` on selected rows/cells.

---

### Step 1: Complete Accessible Grid Component

```tsx
// components/AccessibleGridTable.tsx
"use client";

import * as React from "react";
import { IndeterminateCheckbox } from "./ui/IndeterminateCheckbox";

export interface TransactionRecord {
  id: string;
  invoice: string;
  customer: string;
  email: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  date: string;
}

const COLUMNS = [
  { key: "select", label: "Select", width: "w-12 text-center" },
  { key: "invoice", label: "Invoice", width: "w-36 font-mono" },
  { key: "customer", label: "Customer", width: "w-48" },
  { key: "date", label: "Date", width: "w-32" },
  { key: "amount", label: "Amount", width: "w-28" },
  { key: "status", label: "Status", width: "w-28" },
];

export function AccessibleGridTable({ initialData }: { initialData: TransactionRecord[] }) {
  const [data, setData] = React.useState<TransactionRecord[]>(initialData);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  
  // 2D Focus Coordinates: [rowIndex, colIndex]
  // Row 0 is the header row; Rows 1..N are data rows.
  const [activeCell, setActiveCell] = React.useState<[number, number]>([1, 0]);
  const [anchorIndex, setAnchorIndex] = React.useState<number | null>(null);

  const gridRef = React.useRef<HTMLTableElement>(null);
  const totalRows = data.length + 1; // +1 for header
  const totalCols = COLUMNS.length;

  const isAllSelected = data.length > 0 && selectedIds.size === data.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < data.length;

  // 1. Move DOM focus when activeCell changes via keyboard
  React.useEffect(() => {
    const [r, c] = activeCell;
    const cellEl = gridRef.current?.querySelector<HTMLElement>(
      `[data-row="${r}"][data-col="${c}"]`
    );
    cellEl?.focus();
  }, [activeCell]);

  // 2. Range Selection Helper
  const selectRange = (fromIndex: number, toIndex: number, shouldAdd = true) => {
    const start = Math.min(fromIndex, toIndex);
    const end = Math.max(fromIndex, toIndex);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (let i = start; i <= end; i++) {
        if (data[i]) {
          if (shouldAdd) next.add(data[i].id);
          else next.delete(data[i].id);
        }
      }
      return next;
    });
  };

  // 3. Grid Keydown Engine (WAI-ARIA Pattern)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTableElement>) => {
    const [r, c] = activeCell;
    const isDataRow = r > 0;
    const dataIndex = r - 1;

    switch (e.key) {
      // --- Directional Navigation ---
      case "ArrowRight": {
        e.preventDefault();
        if (c < totalCols - 1) setActiveCell([r, c + 1]);
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        if (c > 0) setActiveCell([r, c - 1]);
        break;
      }
      case "ArrowDown": {
        e.preventDefault();
        if (r < totalRows - 1) {
          const nextRow = r + 1;
          setActiveCell([nextRow, c]);

          // Shift + ArrowDown expands selection
          if (e.shiftKey && nextRow > 0) {
            const anchor = anchorIndex ?? (isDataRow ? dataIndex : 0);
            if (anchorIndex === null) setAnchorIndex(anchor);
            selectRange(anchor, nextRow - 1, true);
          }
        }
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (r > 0) {
          const prevRow = r - 1;
          setActiveCell([prevRow, c]);

          // Shift + ArrowUp expands selection
          if (e.shiftKey && prevRow > 0) {
            const anchor = anchorIndex ?? (isDataRow ? dataIndex : 0);
            if (anchorIndex === null) setAnchorIndex(anchor);
            selectRange(anchor, prevRow - 1, true);
          }
        }
        break;
      }

      // --- Boundary Jumps ---
      case "Home": {
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
          setActiveCell([0, 0]); // Top-left
        } else {
          setActiveCell([r, 0]); // Row start
        }
        break;
      }
      case "End": {
        e.preventDefault();
        if (e.ctrlKey || e.metaKey) {
          setActiveCell([totalRows - 1, totalCols - 1]); // Bottom-right
        } else {
          setActiveCell([r, totalCols - 1]); // Row end
        }
        break;
      }

      // --- Selection Controls (Space & Shift+Space) ---
      case " ": {
        e.preventDefault();
        if (r === 0) {
          // Header Spacebar: Toggle all
          if (isAllSelected || isSomeSelected) {
            setSelectedIds(new Set());
          } else {
            setSelectedIds(new Set(data.map((d) => d.id)));
          }
        } else {
          const targetId = data[dataIndex].id;

          if (e.shiftKey && anchorIndex !== null) {
            // Shift + Space: Select from anchor to current
            selectRange(anchorIndex, dataIndex, true);
          } else {
            // Single Space: Toggle single row & set anchor
            setSelectedIds((prev) => {
              const next = new Set(prev);
              if (next.has(targetId)) next.delete(targetId);
              else next.add(targetId);
              return next;
            });
            setAnchorIndex(dataIndex);
          }
        }
        break;
      }

      // --- Select All Shortcut ---
      case "a":
      case "A": {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          setSelectedIds(new Set(data.map((d) => d.id)));
        }
        break;
      }
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Visual Instruction Banner for Screen Readers & Keyboard Users */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Use <strong>Arrow keys</strong> to navigate cells, <strong>Space</strong> to select, <strong>Shift+Space</strong> for ranges.</span>
        <span>{selectedIds.size} of {data.length} selected</span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table
          ref={gridRef}
          role="grid"
          aria-multiselectable="true"
          aria-label="Transactions Grid"
          onKeyDown={handleKeyDown}
          className="w-full text-left border-collapse text-xs select-none"
        >
          {/* ---------------------------------------------------------------- */}
          {/* HEADER ROW (Row 0)                                              */}
          {/* ---------------------------------------------------------------- */}
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <tr role="row" aria-rowindex={1}>
              {COLUMNS.map((col, cIdx) => {
                const isFocused = activeCell[0] === 0 && activeCell[1] === cIdx;
                return (
                  <th
                    key={col.key}
                    role="columnheader"
                    scope="col"
                    aria-colindex={cIdx + 1}
                    data-row={0}
                    data-col={cIdx}
                    tabIndex={isFocused ? 0 : -1}
                    onClick={() => setActiveCell([0, cIdx])}
                    className={`px-4 py-3.5 outline-none transition-shadow ${col.width} ${
                      isFocused ? "ring-2 ring-inset ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40" : ""
                    }`}
                  >
                    {col.key === "select" ? (
                      <div className="flex items-center justify-center pointer-events-none">
                        <IndeterminateCheckbox
                          checked={isAllSelected}
                          indeterminate={isSomeSelected}
                          tabIndex={-1}
                          readOnly
                          aria-label="Select all rows"
                        />
                      </div>
                    ) : (
                      col.label
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* ---------------------------------------------------------------- */}
          {/* DATA ROWS (Rows 1..N)                                           */}
          {/* ---------------------------------------------------------------- */}
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {data.map((row, dIdx) => {
              const rIdx = dIdx + 1; // 1-based grid row index (accounting for header)
              const isSelected = selectedIds.has(row.id);

              return (
                <tr
                  key={row.id}
                  role="row"
                  aria-rowindex={rIdx + 1}
                  aria-selected={isSelected}
                  className={`transition-colors ${
                    isSelected
                      ? "bg-indigo-50/80 dark:bg-indigo-950/40"
                      : "hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                  }`}
                >
                  {COLUMNS.map((col, cIdx) => {
                    const isFocused = activeCell[0] === rIdx && activeCell[1] === cIdx;

                    return (
                      <td
                        key={col.key}
                        role="gridcell"
                        aria-colindex={cIdx + 1}
                        data-row={rIdx}
                        data-col={cIdx}
                        tabIndex={isFocused ? 0 : -1}
                        onClick={() => {
                          setActiveCell([rIdx, cIdx]);
                          setAnchorIndex(dIdx);
                        }}
                        className={`px-4 py-3.5 outline-none transition-shadow ${col.width} ${
                          isFocused
                            ? "ring-2 ring-inset ring-indigo-500 bg-indigo-100/60 dark:bg-indigo-900/60"
                            : ""
                        }`}
                      >
                        {/* Cell Contents */}
                        {col.key === "select" && (
                          <div className="flex items-center justify-center pointer-events-none">
                            <IndeterminateCheckbox
                              checked={isSelected}
                              tabIndex={-1}
                              readOnly
                              aria-label={`Select row for ${row.invoice}`}
                            />
                          </div>
                        )}
                        {col.key === "invoice" && (
                          <span className="font-bold text-slate-900 dark:text-white">{row.invoice}</span>
                        )}
                        {col.key === "customer" && (
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-white">{row.customer}</div>
                            <div className="text-[11px] text-slate-500">{row.email}</div>
                          </div>
                        )}
                        {col.key === "date" && <span className="text-slate-600 dark:text-slate-300">{row.date}</span>}
                        {col.key === "amount" && <span className="font-bold text-slate-900 dark:text-white">{row.amount}</span>}
                        {col.key === "status" && (
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                              row.status === "Paid"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                                : row.status === "Pending"
                                ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                                : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                            }`}
                          >
                            {row.status}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Screen Reader ARIA Live Region */}
      <div className="sr-only" role="status" aria-live="polite">
        {selectedIds.size} rows selected.
      </div>
    </div>
  );
}

```

---

### Step 2: Keyboard Interaction Matrix

| Key Combo                    | Action                                                               | ARIA Specification Rule             |
| ---------------------------- | -------------------------------------------------------------------- | ----------------------------------- |
| **`Tab` / `Shift+Tab**`      | Enters/exits the grid as a single composite control                  | Standard Roving Tabindex            |
| **`Arrow Left / Right`**     | Moves active cell focus horizontally within current row              | WAI-ARIA Grid Navigation            |
| **`Arrow Up / Down`**        | Moves active cell focus vertically between rows/headers              | WAI-ARIA Grid Navigation            |
| **`Home` / `End**`           | Jumps focus to first or last cell in the current row                 | `aria-rowindex` Boundary Navigation |
| **`Ctrl+Home` / `Ctrl+End**` | Jumps focus to cell `(0,0)` or `(lastRow, lastCol)`                  | Grid Extents Navigation             |
| **`Space`**                  | Toggles selection state of active data row and sets selection anchor | Grid Selection Pattern              |
| **`Shift+Space`**            | Selects all rows from anchor index through active row                | Contiguous Multi-Selection          |
| **`Shift+ArrowUp/Down`**     | Moves focus and expands contiguous row selection                     | Contiguous Range Navigation         |
| **`Ctrl+A` / `Cmd+A**`       | Selects all rows in the dataset                                      | `aria-multiselectable` Batch Action |

---

### Step 3: Accessibility Architecture & Nuances

* **Composite Widget Encapsulation (`tabIndex={-1}` on nested inputs):** The native checkbox inputs have `tabIndex={-1}` and `pointer-events-none` so keyboard `Tab` does not get trapped within each cell. Selection is controlled strictly via `Space` and `Shift+Space` on the grid cell itself.
* **`ring-inset` Focus Styles:** Using `ring-2 ring-inset ring-indigo-500` ensures high-contrast focus rings render crisply inside `border-collapse` tables without shifting pixel dimensions or overflowing container bounds.
* **Synchronized DOM Focus:** `gridRef.current.querySelector('[data-row=...][data-col=...]').focus()` synchronizes physical browser focus alongside React state changes on every arrow keystroke.
