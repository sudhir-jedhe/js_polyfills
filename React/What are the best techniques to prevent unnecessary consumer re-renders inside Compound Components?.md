***  What are the best techniques to prevent unnecessary consumer re-renders inside Compound Components?.md ***

Compound components coordinate shared state across multiple sub-components (e.g., `<Tabs>`, `<Tabs.List>`, `<Tabs.Tab>`, `<Tabs.Panel>`). Because this coordination is typically powered by a root React Context, updating one piece of state (like the active tab index or hover state) can cause **all compound parts to re-render simultaneously**.

---

**1. Split State and Dispatch Contexts**

Sub-components that only dispatch actions (like triggers or close buttons) should never re-render when the active state changes.

```tsx
const TabStateContext = createContext<{ activeTab: string } | null>(null);
const TabDispatchContext = createContext<((tab: string) => void) | null>(null);

export function Tabs({ defaultValue, children }: { defaultValue: string; children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabDispatchContext.Provider value={setActiveTab}>
      <TabStateContext.Provider value={useMemo(() => ({ activeTab }), [activeTab])}>
        {children}
      </TabStateContext.Provider>
    </TabDispatchContext.Provider>
  );
}

// ✅ Never re-renders when activeTab changes because `setActiveTab` is referentially stable
Tabs.Trigger = function TabTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const setActiveTab = useContext(TabDispatchContext)!;
  return <button onClick={() => setActiveTab(value)}>{children}</button>;
};

```

---

**2. Pass Pre-Computed Booleans to Memoized Presenters**

Instead of consuming the raw active identifier inside the memoized presentation component, isolate the `useContext` read in a lightweight wrapper that passes a boolean primitive down.

```tsx
// 1. The heavy presenter only cares if it is active (boolean)
const TabPanelPresenter = React.memo(function TabPanelPresenter({
  isActive,
  children,
}: {
  isActive: boolean;
  children: React.ReactNode;
}) {
  if (!isActive) return null;
  return <div role="tabpanel">{children}</div>;
});

// 2. The compound sub-component calculates the boolean
Tabs.Panel = function TabPanel({ value, children }: { value: string; children: React.ReactNode }) {
  const { activeTab } = useContext(TabStateContext)!;
  const isActive = activeTab === value;

  // React.memo skips rendering if `isActive` stays false
  return <TabPanelPresenter isActive={isActive}>{children}</TabPanelPresenter>;
};

```

* When switching from Tab 1 to Tab 2:
* Tab 1 transitions: `true` $\to$ `false` (re-renders to unmount/hide).
* Tab 2 transitions: `false` $\to$ `true` (re-renders to display).
* Tabs 3, 4, and 5 receive `false` $\to$ `false`, so their inner presenter components **completely skip re-rendering**.

---

**3. Selector-Based Subscriptions via `useSyncExternalStore**`

For compound components with high update frequency or large lists (e.g., multi-select dropdowns, data grids, command palettes), replace standard Context state with an external store instance exposed via Context.

```tsx
// Internal Hook inside sub-components:
function useCompoundStore<Selected>(selector: (state: CompoundState) => Selected) {
  const store = useContext(CompoundStoreContext)!;
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.getState()),
    () => selector(store.getState())
  );
}

Tabs.Panel = function TabPanel({ value, children }: { value: string; children: React.ReactNode }) {
  // Subscribes ONLY to the boolean condition, not the entire state object
  const isActive = useCompoundStore((state) => state.activeTab === value);

  if (!isActive) return null;
  return <div role="tabpanel">{children}</div>;
};

```

* `useSyncExternalStore` evaluates the selector before queuing a render; if the returned boolean has not changed, React aborts rendering that specific child entirely.

---

**4. Isolate Fast State with Uncontrolled DOM Interactivity**

Do not store purely transient, high-frequency interactions (like keyboard focus rings, hover highlights, or scroll indicators) in React state.

* Manage keyboard focus using native DOM APIs (`element.focus()`) and the roving `tabIndex` technique via refs rather than keeping `focusedIndex` in React Context state.
* Use CSS pseudo-classes (`:hover`, `:focus-visible`) or CSS custom properties for hover highlight animations instead of JS state.

---

**5. Sub-Tree Preservation via `children` in the Root Provider**

Ensure the root compound component accepts and renders `children` directly rather than constructing JSX inline.

```tsx
// ✅ `children` is created in the caller's scope and retains reference equality;
// updates to internal `Tabs` state will not re-instantiate static sibling elements.
export function Tabs({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState('1');
  const value = useMemo(() => ({ activeTab, setActiveTab }), [activeTab]);

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>;
}

```

---

**Technique Selection Summary**

| Technique                      | Complexity | Best Suited For                                                                                          |
| ------------------------------ | ---------- | -------------------------------------------------------------------------------------------------------- |
| **Split State / Dispatch**     | Low        | Any compound component where some sub-components only trigger actions (e.g., triggers, dismiss buttons). |
| **Memoized Boolean Presenter** | Low-Medium | Tabs, Accordions, and Step Wizards where only 1 or 2 panels change state per interaction.                |
| **`useSyncExternalStore`**     | Medium     | Large compound widgets (DataGrids, Select menus with 100+ items, Canvas controls).                       |
| **Roving `tabIndex` / Refs**   | Medium     | Accessible dropdowns and menus needing fast keyboard navigation without render lag.                      |
