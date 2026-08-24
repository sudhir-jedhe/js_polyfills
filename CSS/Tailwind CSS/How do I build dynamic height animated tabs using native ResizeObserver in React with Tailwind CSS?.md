Using a native `ResizeObserver` hook lets you dynamically animate container height changes as content switches or resizes without needing external helper libraries.

---

### Step 1: Create a Native `useAutoHeight` Hook

This custom hook attaches a `ResizeObserver` to an inner element and provides the measured pixel height.

```tsx
// src/hooks/useAutoHeight.ts
import * as React from "react";

export function useAutoHeight<T extends HTMLElement = HTMLDivElement>() {
  const [height, setHeight] = React.useState<number | "auto">("auto");
  const elementRef = React.useRef<T | null>(null);

  React.useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use borderBoxSize if available, fallback to contentRect
        const borderBox = entry.borderBoxSize?.[0];
        const measuredHeight = borderBox
          ? borderBox.blockSize
          : entry.contentRect.height;

        if (measuredHeight > 0) {
          setHeight(measuredHeight);
        }
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return [elementRef, height] as const;
}

```

---

### Step 2: Build the Animated Tabs Component

Combine Radix UI's accessible tab primitives with Framer Motion for directional slide and the `useAutoHeight` hook for dynamic height scaling.

```tsx
// src/components/DynamicHeightTabs.tsx
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import { useAutoHeight } from "@/hooks/useAutoHeight";
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

  const [contentRef, measuredHeight] = useAutoHeight<HTMLDivElement>();
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
      {/* Tab Triggers */}
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
                  layoutId="tab-pill-indicator"
                  className="absolute inset-0 z-[-1] rounded-xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/10"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              {tab.label}
            </TabsPrimitive.Trigger>
          );
        })}
      </TabsPrimitive.List>

      {/* Outer Animating Wrapper (Animates Height) */}
      <motion.div
        animate={{ height: measuredHeight }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
      >
        {/* Inner Sizing Element (Observed by ResizeObserver) */}
        <div ref={contentRef} className="p-6">
          <AnimatePresence initial={false} custom={direction} mode="popLayout">
            <motion.div
              key={activeTab.value}
              custom={direction}
              initial={(dir: number) => ({
                x: dir > 0 ? 35 : -35,
                opacity: 0,
              })}
              animate={{
                x: 0,
                opacity: 1,
                transition: {
                  x: { type: "spring", stiffness: 350, damping: 30 },
                  opacity: { duration: 0.18 },
                },
              }}
              exit={(dir: number) => ({
                x: dir > 0 ? -35 : 35,
                opacity: 0,
                transition: {
                  x: { type: "spring", stiffness: 350, damping: 30 },
                  opacity: { duration: 0.12 },
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

### Step 3: Usage Example

```tsx
import { DynamicHeightTabs, type TabItem } from "@/components/DynamicHeightTabs";

const TAB_DATA: TabItem[] = [
  {
    value: "compact",
    label: "Summary",
    content: (
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white">Quick Overview</h3>
        <p className="mt-1 text-sm text-slate-500">
          A compact summary panel requiring minimal vertical height.
        </p>
      </div>
    ),
  },
  {
    value: "detailed",
    label: "Security Keys",
    content: (
      <div className="space-y-3">
        <h3 className="font-bold text-slate-900 dark:text-white">API Keys & Secrets</h3>
        <p className="text-sm text-slate-500">
          Generated client tokens for production and staging environments:
        </p>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300">
          pk_live_51M0...92bX
        </div>
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-mono text-slate-700 dark:text-slate-300">
          pk_test_51M0...01aZ
        </div>
      </div>
    ),
  },
];

export function Page() {
  return (
    <div className="p-8 min-h-screen bg-slate-50 dark:bg-slate-950">
      <DynamicHeightTabs tabs={TAB_DATA} />
    </div>
  );
}

```

---

### Critical Implementation Details

* **`mode="popLayout"` on `AnimatePresence`:** Instantly removes the exiting tab from document flow so the incoming panel's height is measured immediately by the `ResizeObserver` without overlap.
* **`useLayoutEffect` Initialization:** Prevents visual jumps or flashes by setting up the observer and reading initial bounding box measurements before browser paint.
* **`borderBoxSize` over `contentRect`:** `borderBoxSize[0].blockSize` accurately accounts for inner vertical padding, ensuring the outer frame precisely matches the container's rendered height.
