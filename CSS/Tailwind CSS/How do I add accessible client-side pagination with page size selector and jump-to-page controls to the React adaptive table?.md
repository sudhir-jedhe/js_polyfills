*** copy How do I add accessible client-side pagination with page size selector and jump-to-page controls to the React adaptive table?.md ***

To add accessible client-side pagination with page size controls and direct jump-to-page navigation to the adaptive table, you need to manage page slice boundaries, clamp boundary conditions on filter/search mutations, and configure ARIA navigation landmarks (`<nav aria-label="Pagination Navigation">`), live regions, and `aria-current="page"` indicators.

---

### Step 1: Install Icons

```bash
npm install lucide-react

```

---

### Step 2: Build the Paginated Adaptive Table Component

```tsx
// components/PaginatedAdaptiveTable.tsx
"use client";

import * as React from "react";
import {
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Search,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export interface Transaction {
  id: string;
  invoice: string;
  customer: string;
  email: string;
  amount: number;
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

const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export function PaginatedAdaptiveTable({ items }: { items: Transaction[] }) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sortField, setSortField] = React.useState<SortField>("date");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("desc");
  const [statusFilter, setStatusFilter] = React.useState<string>("All");

  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  const [jumpPageInput, setJumpPageInput] = React.useState("");

  // 1. Reset pagination back to page 1 whenever filters or search change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, pageSize]);

  // 2. Sort & Filter Pipeline
  const filteredAndSortedItems = React.useMemo(() => {
    return items
      .filter((item) => {
        const matchesStatus = statusFilter === "All" || item.status === statusFilter;
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

  // 3. Pagination Math Slicing
  const totalItems = filteredAndSortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedItems = React.useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return filteredAndSortedItems.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedItems, safeCurrentPage, pageSize]);

  const startRecord = totalItems === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1;
  const endRecord = Math.min(safeCurrentPage * pageSize, totalItems);

  // 4. Handlers
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleJumpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(jumpPageInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      setCurrentPage(parsed);
      setJumpPageInput("");
    }
  };

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

  return (
    <div className="@container w-full space-y-4">
      
      {/* ------------------------------------------------------------------ */}
      {/* 1. FILTER & SEARCH TOOLBAR                                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col @sm:flex-row items-stretch @sm:items-center justify-between gap-3">
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

        <div className="flex items-center gap-2">
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

          {/* Mobile-Only Sort Selector (Hidden on wider containers) */}
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
      {/* 2. ADAPTIVE DATA TABLE / STACKED CARDS                             */}
      {/* ------------------------------------------------------------------ */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <table className="block @[40rem]:table w-full text-left border-collapse">
          <thead className="hidden @[40rem]:table-header-group bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            <tr>
              <th scope="col" aria-sort={sortField === "invoice" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"} className="px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => handleSort("invoice")}
                  className="group inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                >
                  <span>Invoice</span>
                  {renderSortIcon("invoice")}
                </button>
              </th>
              
              <th scope="col" aria-sort={sortField === "customer" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"} className="px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => handleSort("customer")}
                  className="group inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                >
                  <span>Customer</span>
                  {renderSortIcon("customer")}
                </button>
              </th>

              <th scope="col" aria-sort={sortField === "date" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"} className="px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => handleSort("date")}
                  className="group inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                >
                  <span>Date</span>
                  {renderSortIcon("date")}
                </button>
              </th>

              <th scope="col" aria-sort={sortField === "amount" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"} className="px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => handleSort("amount")}
                  className="group inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                >
                  <span>Amount</span>
                  {renderSortIcon("amount")}
                </button>
              </th>

              <th scope="col" aria-sort={sortField === "status" ? (sortDirection === "asc" ? "ascending" : "descending") : "none"} className="px-5 py-3.5">
                <button
                  type="button"
                  onClick={() => handleSort("status")}
                  className="group inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded"
                >
                  <span>Status</span>
                  {renderSortIcon("status")}
                </button>
              </th>

              <th scope="col" className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="block @[40rem]:table-row-group divide-y divide-slate-200 dark:divide-slate-800">
            {paginatedItems.length === 0 ? (
              <tr className="block @[40rem]:table-row">
                <td colSpan={6} className="block @[40rem]:table-cell p-8 text-center text-xs text-slate-500 dark:text-slate-400">
                  No transactions found on this page.
                </td>
              </tr>
            ) : (
              paginatedItems.map((row) => (
                <tr
                  key={row.id}
                  className="block @[40rem]:table-row p-4 @[40rem]:p-0 space-y-3 @[40rem]:space-y-0 transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                >
                  <td className="flex items-center justify-between @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-xs font-mono font-bold text-slate-900 dark:text-white">
                    <span className="font-sans font-semibold text-slate-500 dark:text-slate-400 @[40rem]:hidden">Invoice:</span>
                    <span>{row.invoice}</span>
                  </td>

                  <td className="flex items-center justify-between @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 @[40rem]:hidden">Customer:</span>
                    <div className="text-right @[40rem]:text-left">
                      <p className="font-semibold text-slate-900 dark:text-white">{row.customer}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{row.email}</p>
                    </div>
                  </td>

                  <td className="flex items-center justify-between @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 @[40rem]:hidden">Date:</span>
                    <span>{row.date}</span>
                  </td>

                  <td className="flex items-center justify-between @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-xs font-bold text-slate-900 dark:text-white">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 @[40rem]:hidden">Amount:</span>
                    <span>
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(row.amount)}
                    </span>
                  </td>

                  <td className="flex items-center justify-between @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-xs">
                    <span className="font-semibold text-slate-500 dark:text-slate-400 @[40rem]:hidden">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_STYLES[row.status]}`}>
                      {row.status}
                    </span>
                  </td>

                  <td className="flex items-center justify-end @[40rem]:table-cell @[40rem]:px-5 @[40rem]:py-4 text-right pt-2 @[40rem]:pt-0 border-t border-slate-100 dark:border-slate-800/60 @[40rem]:border-t-0">
                    <button
                      type="button"
                      className="w-full @[40rem]:w-auto px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
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

      {/* ------------------------------------------------------------------ */}
      {/* 3. ACCESSIBLE PAGINATION & CONTROLS FOOTER                         */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex flex-col @lg:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-xs">
        
        {/* Page size & Record status */}
        <div className="flex flex-wrap items-center gap-3 text-slate-600 dark:text-slate-400">
          <label className="flex items-center gap-2">
            <span>Rows per page:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              aria-label="Select number of rows per page"
              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              {PAGE_SIZE_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </label>

          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">|</span>

          <span>
            Showing <strong className="font-semibold text-slate-900 dark:text-white">{startRecord}</strong> to{" "}
            <strong className="font-semibold text-slate-900 dark:text-white">{endRecord}</strong> of{" "}
            <strong className="font-semibold text-slate-900 dark:text-white">{totalItems}</strong> entries
          </span>
        </div>

        {/* Navigation & Jump-to-Page Controls */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Jump-to-Page Input Form */}
          <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5">
            <label htmlFor="jump-page-input" className="text-slate-500 dark:text-slate-400">
              Go to:
            </label>
            <input
              id="jump-page-input"
              type="number"
              min={1}
              max={totalPages}
              value={jumpPageInput}
              onChange={(e) => setJumpPageInput(e.target.value)}
              placeholder={String(safeCurrentPage)}
              aria-label={`Jump to page number between 1 and ${totalPages}`}
              className="w-14 px-2 py-1 text-center rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!jumpPageInput}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-700 dark:text-slate-300 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Go
            </button>
          </form>

          {/* Stepper Navigation Buttons */}
          <nav aria-label="Pagination Navigation" className="inline-flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              disabled={safeCurrentPage <= 1}
              aria-label="Go to first page"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <ChevronsLeft className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={safeCurrentPage <= 1}
              aria-label="Go to previous page"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>

            <span className="px-2 font-medium text-slate-700 dark:text-slate-300 select-none" aria-current="page">
              Page {safeCurrentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={safeCurrentPage >= totalPages}
              aria-label="Go to next page"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setCurrentPage(totalPages)}
              disabled={safeCurrentPage >= totalPages}
              aria-label="Go to last page"
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <ChevronsRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </nav>

        </div>
      </div>

      {/* Screen Reader Status Updates */}
      <div className="sr-only" role="status" aria-live="polite">
        Showing page {safeCurrentPage} of {totalPages}. Displaying entries {startRecord} through {endRecord} out of {totalItems} total entries.
      </div>
    </div>
  );
}

```

---

### Step 3: Accessibility Features Summary

| Requirement                        | Implementation                                                                                                                                                    |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Landmark Labeling**              | Wrapped pagination controls inside `<nav aria-label="Pagination Navigation">`.                                                                                    |
| **Screen Reader Current State**    | Applied `aria-current="page"` to the active page label so assistive tech reads the current active position.                                                       |
| **Boundary Clamping & Auto-Reset** | When filters, search queries, or page sizes change, `useEffect` resets `currentPage` to `1` to avoid landing on empty, out-of-range pages.                        |
| **Direct Jump Validation**         | Jump-to-page input enforces numeric clamping between `1` and `totalPages` with descriptive `aria-label` bounds.                                                   |
| **Live Announcements**             | An `<div role="status" aria-live="polite">` element informs screen reader users of the updated page number and visible record range whenever pagination triggers. |
