***  How do I implement multi-row selection checkboxes with indeterminate master state and batch action bars in React and Tailwind?.md ***

To build multi-row selection with an **indeterminate master checkbox** and a floating **batch action bar** in React and Tailwind CSS, you need to manage:

1. **The Indeterminate DOM Property:** The HTML checkbox `indeterminate` state is a DOM property (`input.indeterminate = true`), not an HTML attribute, requiring a `ref` or a dedicated wrapper.
2. **Efficient Selection State:** Using a `Set<string>` of row IDs for $O(1)$ lookups, additions, and deletions.
3. **Floating Batch Action Bar:** An accessible toolbar (`role="toolbar"`) that animates into view whenever `selectedIds.size > 0`.
4. **Master Checkbox Logic:**

* **Checked:** All selectable (or current page) items are selected.
* **Indeterminate:** Some (but not all) selectable items are selected.
* **Unchecked:** Zero items are selected.

---

### Step 1: Create an Indeterminate Checkbox Component

Create `components/ui/IndeterminateCheckbox.tsx` to handle setting the raw DOM `indeterminate` property via `useEffect`:

```tsx
// components/ui/IndeterminateCheckbox.tsx
"use client";

import * as React from "react";

export interface IndeterminateCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  indeterminate?: boolean;
}

export const IndeterminateCheckbox = React.forwardRef<
  HTMLInputElement,
  IndeterminateCheckboxProps
>(({ indeterminate = false, className = "", ...props }, ref) => {
  const defaultRef = React.useRef<HTMLInputElement | null>(null);
  const resolvedRef = (ref || defaultRef) as React.MutableRefObject<HTMLInputElement | null>;

  React.useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.indeterminate = Boolean(indeterminate);
    }
  }, [resolvedRef, indeterminate]);

  return (
    <input
      type="checkbox"
      ref={resolvedRef}
      className={`h-4 w-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-indigo-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${className}`}
      {...props}
    />
  );
});

IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

```

---

### Step 2: Build the Multi-Row Selectable Table with Batch Toolbar

```tsx
// components/SelectableTable.tsx
"use client";

import * as React from "react";
import { IndeterminateCheckbox } from "./ui/IndeterminateCheckbox";
import {
  Trash2,
  Download,
  CheckCircle2,
  X,
  Archive,
  MoreHorizontal,
} from "lucide-react";

export interface RecordItem {
  id: string;
  invoice: string;
  customer: string;
  email: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  date: string;
}

export function SelectableTable({ initialData }: { initialData: RecordItem[] }) {
  const [data, setData] = React.useState<RecordItem[]>(initialData);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

  // 1. Selection State Calculations
  const allIds = React.useMemo(() => data.map((item) => item.id), [data]);
  const isAllSelected = data.length > 0 && selectedIds.size === data.length;
  const isSomeSelected = selectedIds.size > 0 && selectedIds.size < data.length;

  // 2. Master Checkbox Handler
  const toggleSelectAll = () => {
    if (isAllSelected || isSomeSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allIds));
    }
  };

  // 3. Single Row Checkbox Handler
  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // 4. Batch Actions
  const handleBatchDelete = () => {
    if (confirm(`Delete ${selectedIds.size} selected item(s)?`)) {
      setData((prev) => prev.filter((item) => !selectedIds.has(item.id)));
      setSelectedIds(new Set());
    }
  };

  const handleBatchExport = () => {
    const selectedRecords = data.filter((item) => selectedIds.has(item.id));
    const blob = new Blob([JSON.stringify(selectedRecords, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exported-records-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="@container relative w-full space-y-4">
      
      {/* ------------------------------------------------------------------ */}
      {/* 1. TABLE STRUCTURE                                                 */}
      {/* ------------------------------------------------------------------ */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="w-full text-left border-collapse">
          
          {/* Header */}
          <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <tr>
              {/* Master Checkbox Column */}
              <th scope="col" className="w-12 px-4 py-3.5 text-center">
                <div className="flex items-center justify-center">
                  <IndeterminateCheckbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onChange={toggleSelectAll}
                    aria-label={
                      isAllSelected
                        ? "Deselect all rows"
                        : "Select all rows in table"
                    }
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

          {/* Body */}
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No records available.
                </td>
              </tr>
            ) : (
              data.map((row) => {
                const isSelected = selectedIds.has(row.id);

                return (
                  <tr
                    key={row.id}
                    onClick={() => toggleSelectRow(row.id)}
                    aria-selected={isSelected}
                    className={`transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-indigo-50/80 dark:bg-indigo-950/30"
                        : "hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    {/* Row Checkbox */}
                    <td
                      className="w-12 px-4 py-3.5 text-center"
                      onClick={(e) => e.stopPropagation()} // Prevent double triggers on row click
                    >
                      <div className="flex items-center justify-center">
                        <IndeterminateCheckbox
                          checked={isSelected}
                          onChange={() => toggleSelectRow(row.id)}
                          aria-label={`Select invoice ${row.invoice}`}
                        />
                      </div>
                    </td>

                    {/* Data Cells */}
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900 dark:text-white">
                      {row.invoice}
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {row.customer}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {row.email}
                      </div>
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
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. FLOATING BATCH ACTION BAR (TOOLBAR)                             */}
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
          aria-label="Bulk actions for selected rows"
          className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900 dark:bg-slate-800 text-white shadow-2xl border border-slate-700/60 backdrop-blur-lg"
        >
          {/* Selected Counter & Clear Button */}
          <div className="flex items-center gap-2 pr-3 border-r border-slate-700">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-[11px] font-bold">
              {selectedIds.size}
            </span>
            <span className="text-xs font-medium text-slate-300">
              Selected
            </span>
            <button
              type="button"
              onClick={() => setSelectedIds(new Set())}
              aria-label="Clear row selection"
              className="ml-1 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Action Triggers */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleBatchExport}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <Download className="h-3.5 w-3.5 text-indigo-400" aria-hidden="true" />
              <span>Export</span>
            </button>

            <button
              type="button"
              onClick={() => alert(`Archived ${selectedIds.size} records`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <Archive className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>Archive</span>
            </button>

            <button
              type="button"
              onClick={handleBatchDelete}
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

### Step 3: Usage Example

```tsx
// app/records/page.tsx
import { SelectableTable, RecordItem } from "@/components/SelectableTable";

const SAMPLE_RECORDS: RecordItem[] = [
  {
    id: "tx-1",
    invoice: "INV-2026-001",
    customer: "Elena Rostova",
    email: "elena@acme.io",
    amount: "$1,450.00",
    status: "Paid",
    date: "2026-08-19",
  },
  {
    id: "tx-2",
    invoice: "INV-2026-002",
    customer: "Marcus Chen",
    email: "m.chen@hyper.dev",
    amount: "$840.00",
    status: "Pending",
    date: "2026-08-20",
  },
  {
    id: "tx-3",
    invoice: "INV-2026-003",
    customer: "Sarah Jenkins",
    email: "s.jenkins@cloud.co",
    amount: "$3,200.50",
    status: "Failed",
    date: "2026-08-21",
  },
  {
    id: "tx-4",
    invoice: "INV-2026-004",
    customer: "Liam Thorne",
    email: "thorne@apex.corp",
    amount: "$5,120.00",
    status: "Paid",
    date: "2026-08-21",
  },
];

export default function RecordsPage() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-black text-slate-900 dark:text-white">
        Batch Management
      </h1>
      <SelectableTable initialData={SAMPLE_RECORDS} />
    </main>
  );
}

```

---

### Key Technical Details

* **`aria-selected` & Row Click Propagation:** Clicking anywhere on a table row toggles selection, while `e.stopPropagation()` on the checkbox cell prevents firing conflicting double-toggle events.
* **Floating Fixed Bar (`fixed bottom-6 left-1/2 -translate-x-1/2`):** Stays anchored in view regardless of how far the user has scrolled down a large table.
* **`pointer-events-none` on Dismiss:** Ensures the hidden action bar does not block mouse clicks on bottom table rows or pagination controls when `selectedIds.size === 0`.
* **Accessibility Live Feedback:** The polite `role="status"` live region announces selection count shifts to screen reader users without shifting cursor focus.
