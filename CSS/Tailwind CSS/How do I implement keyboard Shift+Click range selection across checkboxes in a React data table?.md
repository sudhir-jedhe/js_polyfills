*** copy How do I implement keyboard Shift+Click range selection across checkboxes in a React data table?.md ***

To implement **Shift+Click range selection** across table rows in React, you need to track the index of the **last clicked row** (an "anchor" reference) and capture the native `event.shiftKey` flag on selection events.

When a user clicks a checkbox with the Shift key held down, the handler selects or deselects every row in the index range between the anchor index and the target index.

---

### Step 1: Selection Range Algorithm

1. **Track Anchor Index:** Store `lastSelectedIndex: number | null` in React state.
2. **Standard Click:** Toggle the clicked row's ID in the `Set<string>` and update `lastSelectedIndex` to the current row index.
3. **Shift + Click:**

* Compute `startIndex = Math.min(lastSelectedIndex, currentIndex)`
* Compute `endIndex = Math.max(lastSelectedIndex, currentIndex)`
* Extract all row IDs from `data.slice(startIndex, endIndex + 1)`
* Add (or remove) that entire batch of IDs to/from the `selectedIds` state.

---

### Step 2: Implementation

```tsx
// components/ShiftSelectableTable.tsx
"use client";

import * as React from "react";
import { IndeterminateCheckbox } from "./ui/IndeterminateCheckbox";
import { Trash2, Download, X } from "lucide-react";

export interface TransactionRecord {
  id: string;
  invoice: string;
  customer: string;
  email: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  date: string;
}

export function ShiftSelectableTable({
  initialData,
}: {
  initialData: TransactionRecord[];
}) {
  const [data, setData] = React.useState<TransactionRecord[]>(initialData);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [lastSelectedIndex, setLastSelectedIndex] = React.useState<number | null>(null);

  const allIds = React.useMemo(() => data.map((d) => d.id), [data]);
  const isAllSelected = data.length > 0 && selectedIds.size === data.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < data.length;

  // Master Select All / Deselect All
  const toggleSelectAll = () => {
    if (isAllSelected || isSomeSelected) {
      setSelectedIds(new Set());
      setLastSelectedIndex(null);
    } else {
      setSelectedIds(new Set(allIds));
    }
  };

  // Row Selection Handler with Shift+Click Range Support
  const handleRowSelect = (
    index: number,
    id: string,
    event: React.MouseEvent<HTMLElement>
  ) => {
    // Prevent text highlighting on rapid Shift+Clicks
    if (event.shiftKey) {
      window.getSelection()?.removeAllRanges();
    }

    setSelectedIds((prev) => {
      const next = new Set(prev);

      // Scenario A: Shift + Click with an established anchor index
      if (event.shiftKey && lastSelectedIndex !== null) {
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);

        // Determine if we are selecting or deselecting the range based on anchor state
        const anchorId = data[lastSelectedIndex]?.id;
        const shouldSelect = anchorId ? prev.has(anchorId) : true;

        const sliceRange = data.slice(start, end + 1);
        sliceRange.forEach((item) => {
          if (shouldSelect) {
            next.add(item.id);
          } else {
            next.delete(item.id);
          }
        });
      } 
      // Scenario B: Standard Click (toggle single item)
      else {
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        // Establish new anchor
        setLastSelectedIndex(index);
      }

      return next;
    });
  };

  return (
    <div className="@container relative w-full select-none space-y-4">
      {/* ------------------------------------------------------------------ */}
      {/* 1. TABLE STRUCTURE                                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <tr>
              <th scope="col" className="w-12 px-4 py-3.5 text-center">
                <div className="flex items-center justify-center">
                  <IndeterminateCheckbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onChange={toggleSelectAll}
                    aria-label={isAllSelected ? "Deselect all rows" : "Select all rows"}
                  />
                </div>
              </th>
              <th scope="col" className="px-4 py-3.5">Invoice</th>
              <th scope="col" className="px-4 py-3.5">Customer</th>
              <th scope="col" className="px-4 py-3.5">Date</th>
              <th scope="col" className="px-4 py-3.5">Amount</th>
              <th scope="col" className="px-4 py-3.5">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {data.map((row, index) => {
              const isSelected = selectedIds.has(row.id);

              return (
                <tr
                  key={row.id}
                  onClick={(e) => handleRowSelect(index, row.id, e)}
                  aria-selected={isSelected}
                  className={`transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-indigo-50/80 dark:bg-indigo-950/40"
                      : "hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                  }`}
                >
                  {/* Row Checkbox */}
                  <td
                    className="w-12 px-4 py-3.5 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-center">
                      <IndeterminateCheckbox
                        checked={isSelected}
                        onChange={() => {}} // Handled by onClick on the wrapper for Shift+Click capture
                        onClick={(e) => handleRowSelect(index, row.id, e)}
                        aria-label={`Select invoice ${row.invoice}`}
                      />
                    </div>
                  </td>

                  <td className="px-4 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                    {row.invoice}
                  </td>

                  <td className="px-4 py-3.5">
                    <div className="font-semibold text-slate-900 dark:text-white">{row.customer}</div>
                    <div className="text-[11px] text-slate-500">{row.email}</div>
                  </td>

                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                    {row.date}
                  </td>

                  <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-white">
                    {row.amount}
                  </td>

                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        row.status === "Paid"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                          : row.status === "Pending"
                          ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                          : "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. FLOATING BATCH ACTION BAR                                       */}
      {/* ------------------------------------------------------------------ */}
      <div
        aria-hidden={selectedIds.size === 0}
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
          selectedIds.size > 0
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-12 opacity-0 pointer-events-none"
        }`}
      >
        <aside
          role="toolbar"
          aria-label="Bulk actions toolbar"
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white shadow-2xl border border-slate-700/60 backdrop-blur-lg"
        >
          <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-bold">
              {selectedIds.size}
            </span>
            <span className="text-xs font-medium text-slate-300">Selected</span>
            <button
              type="button"
              onClick={() => {
                setSelectedIds(new Set());
                setLastSelectedIndex(null);
              }}
              aria-label="Clear selection"
              className="ml-1 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                const selectedRows = data.filter((item) => selectedIds.has(item.id));
                const blob = new Blob([JSON.stringify(selectedRows, null, 2)], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `export-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <Download className="h-3.5 w-3.5 text-indigo-400" aria-hidden="true" />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm(`Delete ${selectedIds.size} selected rows?`)) {
                  setData((prev) => prev.filter((item) => !selectedIds.has(item.id)));
                  setSelectedIds(new Set());
                  setLastSelectedIndex(null);
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Delete</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Screen Reader Live Region */}
      <div className="sr-only" role="status" aria-live="polite">
        {selectedIds.size} out of {data.length} items selected.
      </div>
    </div>
  );
}

```

---

### Step 3: Important Implementation Nuances

| Issue                                       | Cause                                                                     | Solution                                                                                                |
| ------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Native Text Highlighting on Shift+Click** | Browsers default to selecting body text when Shift is held during clicks. | Call `window.getSelection()?.removeAllRanges()` and apply `select-none` to the container wrapper.       |
| **Double-Toggle Events**                    | Checkbox click bubbles to the row `<tr>` element.                         | Isolate the checkbox with `e.stopPropagation()` and pass the click event directly to `handleRowSelect`. |
| **Selection Range Anchor Memory**           | Deleting items or sorting changes the underlying array positions.         | Reset `lastSelectedIndex` to `null` whenever data is filtered, sorted, or deleted.                      |
