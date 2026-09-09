***  How do I add client-side column sorting and keyword search filtering to the adaptive table component in React?.md ***

To add client-side column sorting and keyword filtering to the adaptive container query table, implement a controlled state pattern with `useMemo` for sorting/filtering calculations, accessible `aria-sort` headers, and a mobile-friendly sort selector when the component collapses into card mode.

---

### Step 1: Install Icons

```bash
npm install lucide-react

```

---

### Step 2: Build the Searchable, Sortable Adaptive Table

```tsx
// components/SortableAdaptiveTable.tsx
"use client";

import * as React from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

export interface Transaction {
  id: string;
  invoice: string;
  customer: string;
  email: string;
  amount: number; // numeric value for reliable arithmetic sorting
  status: "Paid" | "Pending" | "Failed";
  date: string;
}

type SortField = "invoice" | "customer" | "date" | "amount" | "status";
type SortDirection = "asc" | "desc";

const STATUS_STYLES: Record<Transaction["status"], string> = {
  Paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  Pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  Failed: "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200 dark:border-rose-800",
};

export function SortableAdaptiveTable({ items }: { items: Transaction[] }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortField, setSortField] = React.useState<SortField>("date");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("desc");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");

  // 1. Toggle Sort Field / Direction
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // 2. Client-Side Filter & Sort Processing Pipeline
  const processedItems = React.useMemo(() => {
    return items
      .filter((item) => {
        const matchesStatus =
          statusFilter === "All" || item.status === statusFilter;
        const search = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !search ||
          item.invoice.toLowerCase().includes(search) ||
          item.customer.toLowerCase().includes(search) ||
          item.email.toLowerCase().includes(search) ||
          item.amount.toString().includes(search) ||
          item.date.toLowerCase().includes(search);

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        let comparison = 0;

        if (sortField === "amount") {
          comparison = a.amount - b.amount;
        } else if (sortField === "date") {
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else {
          comparison = a[sortField].localeCompare(b[sortField]);
        }

        return sortDirection === "asc" ? comparison : -comparison;
      });
  }, [items, searchQuery, sortField, sortDirection, statusFilter]);

  // Helper for Header Sort Icon
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-3.5 w-3.5 opacity-40 group-hover:opacity-100" aria-hidden="true" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" aria-hidden="true" />
    );
  };

  // ARIA sort state
  const getAriaSort = (field: SortField): React.AriaAttributes["aria-sort"] => {
    if (sortField !== field) return "none";
    return sortDirection === "asc" ? "ascending" : "descending";
  };

  return (
    <div className="@container w-full space-y-4">
      
      {/* ------------------------------------------------------------------ */}
      {/* 1. CONTROL TOOLBAR (Search, Filter, Mobile Sort Trigger)           */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col @sm:flex-row items-stretch @sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search invoice, customer..."
            aria-label="Filter transactions"
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search query"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filters & Mobile Sort Dropdowns */}
        <div className="flex items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by transaction status"
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
          </select>

          {/* Mobile-Only Sort Selector (Visible in narrow card layout) */}
          <div className="flex @[40rem]:hidden items-center gap-1.5 pl-1">
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            <select
              value={`${sortField}-${sortDirection}`}
              onChange={(e) => {
                const [field, dir] = e.target.value.split("-") as [SortField, SortDirection];
                setSortField(field);
                setSortDirection(dir);
              }}
              aria-label="Sort cards by"
              className="px-2.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="amount-desc">Amount (High to Low)</option>
              <option value="amount-asc">Amount (Low to High)</option>
              <option value="customer-asc">Customer (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* 2. ADAPTIVE DATA TABLE / CARD CONTAINER                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="block @[40rem]:table w-full text-left border-collapse">
          
          {/* Desktop Table Headers with Interactive Sorting */}
          <thead className="hidden @[40rem]:table-header-group bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <tr>
              <th scope="col" aria-sort={getAriaSort("invoice")} className="px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => handleSort("invoice")}
                  className="group inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white"
                >
                  <span>Invoice</span>
                  {renderSortIcon("invoice")}
                </button>
              </th>
              
              <th scope="col" aria-sort={getAriaSort("customer")} className="px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => handleSort("customer")}
                  className="group inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white"
                >
                  <span>Customer</span>
                  {renderSortIcon("customer")}
                </button>
              </th>

              <th scope="col" aria-sort={getAriaSort("date")} className="px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => handleSort("date")}
                  className="group inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white"
                >
                  <span>Date</span>
                  {renderSortIcon("date")}
                </button>
              </th>

              <th scope="col" aria-sort={getAriaSort("amount")} className="px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => handleSort("amount")}
                  className="group inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white"
                >
                  <span>Amount</span>
                  {renderSortIcon("amount")}
                </button>
              </th>

              <th scope="col" aria-sort={getAriaSort("status")} className="px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => handleSort("status")}
                  className="group inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white"
                >
                  <span>Status</span>
                  {renderSortIcon("status")}
                </button>
              </th>

              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Body (Stacked cards in narrow mode, rows in wide mode) */}
          <tbody className="block @[40rem]:table-row-group divide-y divide-slate-200 dark:divide-slate-800">
            {processedItems.length === 0 ? (
              <tr className="block @[40rem]:table-row">
                <td colSpan={6} className="block @[40rem]:table-cell p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                  No transactions match your search or filter criteria.
                </td>
              </tr>
            ) : (
              processedItems.map((row) => (
                <tr
                  key={row.id}
                  className="block @[40rem]:table-row p-4 @[40rem]:p-0 space-y-3 @[40rem]:space-y-0 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                >
                  {/* Invoice */}
                  <td className="flex items-center justify-between @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-xs font-mono font-bold text-slate-900 dark:text-white">
                    <span className="font-sans font-semibold text-slate-500 dark:text-slate-400 @[40rem]:hidden">
                      Invoice:
                    </span>
                    <span>{row.invoice}</span>
                  </td>

                  {/* Customer */}
                  <td className="flex items-center justify-between @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 @[40rem]:hidden">
                      Customer:
                    </span>
                    <div className="text-right @[40rem]:text-left">
                      <p className="font-semibold text-slate-900 dark:text-white">{row.customer}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{row.email}</p>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="flex items-center justify-between @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 @[40rem]:hidden">
                      Date:
                    </span>
                    <span>{row.date}</span>
                  </td>

                  {/* Amount */}
                  <td className="flex items-center justify-between @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-xs font-bold text-slate-900 dark:text-white">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 @[40rem]:hidden">
                      Amount:
                    </span>
                    <span>
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(row.amount)}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="flex items-center justify-between @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 @[40rem]:hidden">
                      Status:
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_STYLES[row.status]}`}>
                      {row.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="flex items-center justify-end @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-right pt-2 @[40rem]:pt-0 border-t border-slate-100 dark:border-slate-800/60 @[40rem]:border-t-0">
                    <button
                      type="button"
                      className="w-full @[40rem]:w-auto px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Screen Reader Result Announcement */}
      <div className="sr-only" role="status" aria-live="polite">
        Showing {processedItems.length} of {items.length} transactions, sorted by {sortField} {sortDirection}.
      </div>
    </div>
  );
}

```

---

### Step 3: Example Demo Page

```tsx
// app/dashboard/transactions/page.tsx
import { SortableAdaptiveTable, Transaction } from "@/components/SortableAdaptiveTable";

const SAMPLE_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    invoice: "INV-2026-001",
    customer: "Elena Rostova",
    email: "elena@acme.io",
    amount: 1450.0,
    status: "Paid",
    date: "2026-08-19",
  },
  {
    id: "tx-2",
    invoice: "INV-2026-002",
    customer: "Marcus Chen",
    email: "m.chen@hyper.dev",
    amount: 840.0,
    status: "Pending",
    date: "2026-08-20",
  },
  {
    id: "tx-3",
    invoice: "INV-2026-003",
    customer: "Sarah Jenkins",
    email: "s.jenkins@cloud.co",
    amount: 3200.5,
    status: "Failed",
    date: "2026-08-15",
  },
  {
    id: "tx-4",
    invoice: "INV-2026-004",
    customer: "Liam Thorne",
    email: "thorne@apex.corp",
    amount: 5120.0,
    status: "Paid",
    date: "2026-08-21",
  },
];

export default function TransactionsPage() {
  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">Transactions</h1>
        <p className="text-sm text-slate-500">Filter, search, and sort invoices adaptively.</p>
      </div>
      <SortableAdaptiveTable items={SAMPLE_TRANSACTIONS} />
    </main>
  );
}

```

---

### Accessibility & UX Details

* **`aria-sort` Attribute:** Dynamically assigns `"ascending"`, `"descending"`, or `"none"` to `<th>` elements to meet WCAG table navigation requirements.
* **Dual Sorting UX:** Provides clickable header triggers on wide screens (`@[40rem]`) and swaps to a compact `<select>` sort control on mobile card mode where table headers are hidden.
* **Live Announcements:** An `aria-live="polite"` live region informs screen reader users of the updated row count and active sort order whenever filters change.
