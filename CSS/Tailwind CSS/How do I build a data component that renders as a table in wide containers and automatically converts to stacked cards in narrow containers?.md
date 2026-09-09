***  How do I build a data component that renders as a table in wide containers and automatically converts to stacked cards in narrow containers?.md ***

To build an adaptive data view that renders as a structured tabular layout in wide containers and collapses into stacked key-value cards in narrow containers, combine `@container` on the wrapper with CSS `display` overrides on standard HTML table elements (`block`, `grid`, and `table-cell`).

---

### Step 1: Define Custom Container Breakpoints (Optional)

In Tailwind CSS v4, container queries are built-in. If you want an explicit container threshold for the table-to-card transition (e.g., $640\text{px}$), configure it inside `@theme` in `globals.css`:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --container-table-collapse: 40rem; /* 640px threshold */
}

```

---

### Step 2: Build the Adaptive Table Component

This component uses standard semantic `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, and `<td>` tags. In narrow containers (below `@container-table-collapse`), table rows and cells are reset with `block` and styled as stacked cards; in wide containers, they resume standard `table`, `table-header-group`, `table-row-group`, and `table-cell` behavior.

```tsx
// components/AdaptiveDataTable.tsx
import * as React from "react";

export interface Transaction {
  id: string;
  invoice: string;
  customer: string;
  email: string;
  amount: string;
  status: "Paid" | "Pending" | "Failed";
  date: string;
}

const STATUS_STYLES: Record<Transaction["status"], string> = {
  Paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  Pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  Failed: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800",
};

export function AdaptiveDataTable({ items }: { items: Transaction[] }) {
  return (
    // 1. Container Query Boundary Context
    <div className="@container w-full">
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        
        {/* Table container: Displays as stacked div structure on mobile, native table on wide container */}
        <table className="block @[40rem]:table w-full text-left border-collapse">
          
          {/* Table Header: Hidden on narrow cards, displayed on wide table */}
          <thead className="hidden @[40rem]:table-header-group bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <tr>
              <th scope="col" className="px-5 py-3.5">Invoice</th>
              <th scope="col" className="px-5 py-3.5">Customer</th>
              <th scope="col" className="px-5 py-3.5">Date</th>
              <th scope="col" className="px-5 py-3.5">Amount</th>
              <th scope="col" className="px-5 py-3.5">Status</th>
              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body: Stack of cards in narrow layout, row groups in wide layout */}
          <tbody className="block @[40rem]:table-row-group divide-y divide-slate-200 dark:divide-slate-800">
            {items.map((row) => (
              <tr
                key={row.id}
                className="block @[40rem]:table-row p-4 @[40rem]:p-0 space-y-3 @[40rem]:space-y-0 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
              >
                {/* 1. Invoice & ID */}
                <td
                  data-label="Invoice"
                  className="flex items-center justify-between @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-xs font-mono font-bold text-slate-900 dark:text-white"
                >
                  <span className="font-sans font-semibold text-slate-500 dark:text-slate-400 @[40rem]:hidden">
                    Invoice:
                  </span>
                  <span>{row.invoice}</span>
                </td>

                {/* 2. Customer details */}
                <td
                  data-label="Customer"
                  className="flex items-center justify-between @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-xs"
                >
                  <span className="font-semibold text-slate-500 dark:text-slate-400 @[40rem]:hidden">
                    Customer:
                  </span>
                  <div className="text-right @[40rem]:text-left">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {row.customer}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {row.email}
                    </p>
                  </div>
                </td>

                {/* 3. Date */}
                <td
                  data-label="Date"
                  className="flex items-center justify-between @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-xs text-slate-600 dark:text-slate-300"
                >
                  <span className="font-semibold text-slate-500 dark:text-slate-400 @[40rem]:hidden">
                    Date:
                  </span>
                  <span>{row.date}</span>
                </td>

                {/* 4. Amount */}
                <td
                  data-label="Amount"
                  className="flex items-center justify-between @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-xs font-bold text-slate-900 dark:text-white"
                >
                  <span className="font-semibold text-slate-500 dark:text-slate-400 @[40rem]:hidden">
                    Amount:
                  </span>
                  <span>{row.amount}</span>
                </td>

                {/* 5. Status Badge */}
                <td
                  data-label="Status"
                  className="flex items-center justify-between @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-xs"
                >
                  <span className="font-semibold text-slate-500 dark:text-slate-400 @[40rem]:hidden">
                    Status:
                  </span>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                      STATUS_STYLES[row.status]
                    }`}
                  >
                    {row.status}
                  </span>
                </td>

                {/* 6. Row Action */}
                <td className="flex items-center justify-end @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-right pt-2 @[40rem]:pt-0 border-t border-slate-100 dark:border-slate-800/60 @[40rem]:border-t-0">
                  <button
                    type="button"
                    className="w-full @[40rem]:w-auto px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-colors"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

```

---

### Step 3: Usage in Split Panes and Dashboards

Because this layout responds to parent width via `@container`, you can use the same component inside a narrow drawer or sidebar (where it automatically shows cards) and a wide main content panel (where it displays as a table):

```tsx
// app/dashboard/page.tsx
import { AdaptiveDataTable, Transaction } from "@/components/AdaptiveDataTable";

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    invoice: "INV-2026-001",
    customer: "Elena Rostova",
    email: "elena@acme.io",
    amount: "$1,450.00",
    status: "Paid",
    date: "Aug 19, 2026",
  },
  {
    id: "tx-2",
    invoice: "INV-2026-002",
    customer: "Marcus Chen",
    email: "m.chen@hyper.dev",
    amount: "$840.00",
    status: "Pending",
    date: "Aug 20, 2026",
  },
  {
    id: "tx-3",
    invoice: "INV-2026-003",
    customer: "Sarah Jenkins",
    email: "s.jenkins@cloud.co",
    amount: "$3,200.00",
    status: "Failed",
    date: "Aug 21, 2026",
  },
];

export default function Dashboard() {
  return (
    <main className="max-w-7xl mx-auto p-6 space-y-8">
      {/* 1. In a Wide Column -> Renders full Table layout */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Main Dashboard (Wide Container)</h2>
        <AdaptiveDataTable items={SAMPLE_TRANSACTIONS} />
      </section>

      {/* 2. In a Narrow 320px Sidebar Column -> Automatically Renders as Stacked Cards */}
      <section className="space-y-3 max-w-sm">
        <h2 className="text-lg font-bold">Sidebar Feed (Narrow Container)</h2>
        <AdaptiveDataTable items={SAMPLE_TRANSACTIONS} />
      </section>
    </main>
  );
}

```

---

### Key Structural Patterns

* **`flex items-center justify-between @[40rem]:table-cell`:** Produces a 2-column key-value row on mobile (label on the left, value on the right) and restores standard grid placement on desktop.
* **Inline Labels (`@[40rem]:hidden`):** Injects field descriptors only when the header row (`<thead>`) is hidden.
* **Preserved Semantic HTML:** Uses real `<table>` and `<td>` elements so assistive technology (screen readers) continues to support table navigation modes without requiring ARIA grid emulation.
