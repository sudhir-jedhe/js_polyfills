*** copy How does state colocation (pushing state down) prevent parent-driven re-renders without using React.memo?.md ***

**State Colocation** (or "pushing state down") is the practice of moving state as close as possible to the components that actually read and write it.

Because a React component re-renders all of its children by default, hoisting state too high causes the entire subtree to re-render. By moving that state down into an isolated child component, only that specific leaf node re-renders when state changes, leaving the rest of the parent and sibling components completely untouched—**without needing `React.memo`, `useCallback`, or `useMemo**`.

---

**The Problem: State Lifted Too High**

In this common pattern, the parent holds state that only a single modal or input needs:

```jsx
// ❌ Anti-pattern: High-level state forces the whole page to re-render
function Page() {
  const [isOpen, setIsOpen] = useState(false); // Only used for the dialog!

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      {isOpen && <Dialog onClose={() => setIsOpen(false)} />}

      {/* These heavy components re-render every time `isOpen` toggles */}
      <HeavyAnalyticsDashboard />
      <MassiveDataTable />
      <ComplexChart />
    </div>
  );
}

```

When `isOpen` changes:

1. `Page` re-renders.
2. `HeavyAnalyticsDashboard`, `MassiveDataTable`, and `ComplexChart` all re-render recursively, causing frame drops.

---

**The Fix: Colocating State into a Sub-Component**

Extract the state and the UI elements that depend on it into their own dedicated component:

```jsx
// ✅ Colocated State: State is pushed down to the dialog wrapper
function ModalTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>Open Modal</button>
      {isOpen && <Dialog onClose={() => setIsOpen(false)} />}
    </>
  );
}

function Page() {
  return (
    <div>
      <ModalTrigger />

      {/* When ModalTrigger opens/closes, Page NEVER re-renders */}
      <HeavyAnalyticsDashboard />
      <MassiveDataTable />
      <ComplexChart />
    </div>
  );
}

```

---

**Why It Works Mechanically**

```
Before (Lifted High):
[Page (State: isOpen)] ──▶ Triggers Re-render
   ├── [Modal] ──────────▶ Re-renders
   ├── [Dashboard] ──────▶ Re-renders (Unnecessary)
   └── [DataTable] ──────▶ Re-renders (Unnecessary)

After (State Colocated):
[Page] (Does NOT re-render)
   ├── [ModalTrigger (State: isOpen)] ──▶ Triggers Re-render (Only this node)
   │      └── [Modal]
   ├── [Dashboard] (Skipped)
   └── [DataTable] (Skipped)

```

1. **Fiber Tree Isolation:** When `setIsOpen` is called, React schedules a re-render starting **at the `ModalTrigger` Fiber node**.
2. **Top-Down Render Boundary:** React only traverses downwards from the component that triggered the update. It never traverses *upward* to `Page`.
3. **No Memoization Overhead:** `Page`, `HeavyAnalyticsDashboard`, and `DataTable` are completely skipped by the scheduler. There is no need for `React.memo` wrappers, prop equality checks, or `useCallback` references.

---

**Common Scenarios for Colocation**

* **Expandable / Accordion Sections:** Move `isExpanded` state inside `<AccordionItem>` instead of holding an array of expanded IDs in the parent list.
* **Form Inputs & Search Fields:** If a live input updates state on every keystroke (`onChange`), encapsulate the input and its local typing state into a `<SearchBar>` component so the surrounding page doesn't re-render on every keypress.
* **Tooltips & Popovers:** Keep hover/focus toggles inside the `<Tooltip>` component rather than the parent view.
