To animate dynamic height transitions between tabs with differing content heights, wrap the tab content container in a `motion.div` configured with `animate={{ height: "auto" }}` or use `framer-motion`'s **`useMeasure`** / **`ResizeObserver`** pattern combined with `layout` animations.

---

### Step 1: Install Dependencies

```bash
npm install @radix-ui/react-tabs framer-motion clsx tailwind-merge

```

---

### Step 2: Implementation with `useMeasure`

Using `useMeasure` (or a `ResizeObserver`) guarantees that height transitions adapt instantly whenever inner content expands, shrinks, or loads dynamically:

```tsx
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import useMeasure from "react-use-measure"; // or implement a simple ResizeObserver ref
import { cn } from "@/lib/utils";

export interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface DynamicHeightTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
}

export function DynamicHeightTabs({
  tabs,
  defaultValue = tabs[0]?.value,
}: DynamicHeightTabsProps) {
  const [[activeIdx, direction], setActiveState] = React.useState<[number, number]>([
    Math.max(0, tabs.findIndex((t) => t.value === defaultValue)),
    0,
  ]);

  // Measure the active tab's rendered height
  const [ref, bounds] = useMeasure();

  const activeTab = tabs[activeIdx] ?? tabs[0];

  const handleTabChange = (val: string) => {
    const newIdx = tabs.findIndex((t) => t.value === val);
    if (newIdx === activeIdx || newIdx === -1) return;
    setActiveState([newIdx, newIdx > activeIdx ? 1 : -1]);
  };

  return (
    <TabsPrimitive.Root
      value={activeTab.value}
      onValueChange={handleTabChange}
      className="w-full max-w-xl mx-auto flex flex-col gap-4"
    >
      {/* 1. Header Trigger List */}
      <TabsPrimitive.List className="relative inline-flex items-center gap-1 self-start rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {tabs.map((tab, idx) => {
          const isActive = idx === activeIdx;
          return (
            <TabsPrimitive.Trigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "relative z-10 px-4 py-2 text-sm font-medium transition-colors outline-none select-none rounded-xl",
                "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                isActive
                  ? "text-slate-900 dark:text-white font-semibold"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-pill"
                  className="absolute inset-0 z-[-1] rounded-xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/10"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              {tab.label}
            </TabsPrimitive.Trigger>
          );
        })}
      </TabsPrimitive.List>

      {/* 2. Outer Container: Animates Height Dynamically */}
      <motion.div
        animate={{ height: bounds.height > 0 ? bounds.height : "auto" }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
      >
        {/* 3. Measured Inner Container */}
        <div ref={ref} className="p-6">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={activeTab.value}
              custom={direction}
              initial={(dir: number) => ({
                x: dir > 0 ? 40 : -40,
                opacity: 0,
              })}
              animate={{
                x: 0,
                opacity: 1,
                transition: {
                  x: { type: "spring", stiffness: 350, damping: 30 },
                  opacity: { duration: 0.2 },
                },
              }}
              exit={(dir: number) => ({
                x: dir > 0 ? -40 : 40,
                opacity: 0,
                transition: {
                  x: { type: "spring", stiffness: 350, damping: 30 },
                  opacity: { duration: 0.15 },
                },
              })}
            >
              <TabsPrimitive.Content
                value={activeTab.value}
                forceMount
                className="outline-none"
              >
                {activeTab.content}
              </TabsPrimitive.Content>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </TabsPrimitive.Root>
  );
}

```

---

### Step 3: Example with Varying Content Heights

```tsx
import { DynamicHeightTabs } from "@/components/DynamicHeightTabs";

const TABS = [
  {
    value: "short",
    label: "Short Tab",
    content: (
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Summary</h3>
        <p className="mt-2 text-sm text-slate-500">
          This panel is compact and has minimal content.
        </p>
      </div>
    ),
  },
  {
    value: "medium",
    label: "Medium Tab",
    content: (
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Security Checklist</h3>
        <p className="text-sm text-slate-500">
          Complete the following verifications to activate multi-factor authentication:
        </p>
        <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300 space-y-1">
          <li>Verify primary email</li>
          <li>Set up authenticator app</li>
          <li>Save recovery emergency keys</li>
        </ul>
      </div>
    ),
  },
  {
    value: "long",
    label: "Long Tab",
    content: (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Full Audit Log</h3>
        <p className="text-sm text-slate-500">
          Detailed trace logs recorded across your cluster over the last 30 days.
        </p>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs flex justify-between">
              <span>Event #{i} - Access token refreshed</span>
              <span className="text-slate-400">2h ago</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export default function Demo() {
  return (
    <div className="p-8 bg-slate-50 dark:bg-slate-950 min-h-screen">
      <DynamicHeightTabs tabs={TABS} />
    </div>
  );
}

```

---

### Key Mechanics

* **`mode="popLayout"` on `AnimatePresence`:** Removes the exiting panel from the document flow immediately so the incoming tab can measure and render into its natural height without being stacked below the exiting one.
* **Separation of Outer Frame and Measured Inner Content:** The outer container applies `height: bounds.height` with `overflow-hidden`, while the inner container (`ref={ref}`) handles the actual content rendering and measurement.
* **Spring Interpolation:** Smooth spring physics (`stiffness: 300`, `damping: 30`) ensure that height adjustments look natural and fluid alongside horizontal sliding.
