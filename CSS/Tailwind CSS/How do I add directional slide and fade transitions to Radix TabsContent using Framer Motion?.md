*** copy How do I add directional slide and fade transitions to Radix TabsContent using Framer Motion?.md ***

To create directional slide and fade transitions, you need to track the **direction of the tab change** (whether the user navigated left-to-right or right-to-left) and pass that direction to Framer Motion's `AnimatePresence` and `custom` variant prop.

---

### Step 1: Install Dependencies

```bash
npm install @radix-ui/react-tabs framer-motion clsx tailwind-merge

```

---

### Step 2: Directional Animation Variants

Define animation variants that use the `direction` parameter (`+1` for sliding right-to-left, `-1` for sliding left-to-right):

```typescript
import { Variants } from "framer-motion";

export const tabContentVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 30 : -30,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: "spring", stiffness: 350, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -30 : 30,
    opacity: 0,
    transition: {
      x: { type: "spring", stiffness: 350, damping: 30 },
      opacity: { duration: 0.15 },
    },
  }),
};

```

---

### Step 3: Directional Tabs Component

Using Radix's `Tabs.Root` with `forceMount` on the active panel allows Framer Motion's `AnimatePresence` to orchestrate enter/exit transitions smoothly:

```tsx
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { tabContentVariants } from "./variants";

export interface TabConfig {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface DirectionalAnimatedTabsProps {
  tabs: TabConfig[];
  defaultValue?: string;
}

export function DirectionalAnimatedTabs({
  tabs,
  defaultValue = tabs[0]?.value,
}: DirectionalAnimatedTabsProps) {
  // Track [currentTabIndex, direction]
  const [[activeIdx, direction], setActiveIdxState] = React.useState<[number, number]>([
    Math.max(0, tabs.findIndex((t) => t.value === defaultValue)),
    0,
  ]);

  const activeTab = tabs[activeIdx] ?? tabs[0];

  const handleTabChange = (newVal: string) => {
    const newIdx = tabs.findIndex((t) => t.value === newVal);
    if (newIdx === activeIdx || newIdx === -1) return;

    // Positive if moving forward (right), negative if moving backward (left)
    const newDirection = newIdx > activeIdx ? 1 : -1;
    setActiveIdxState([newIdx, newDirection]);
  };

  return (
    <TabsPrimitive.Root
      value={activeTab.value}
      onValueChange={handleTabChange}
      className="w-full max-w-2xl mx-auto flex flex-col gap-6"
    >
      {/* Tab Navigation List with Sliding Pill */}
      <TabsPrimitive.List className="relative inline-flex items-center gap-1 self-start rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {tabs.map((tab, idx) => {
          const isActive = idx === activeIdx;
          return (
            <TabsPrimitive.Trigger
              key={tab.value}
              value={tab.value}
              className={cn(
                "relative z-10 px-4 py-2 text-sm font-medium transition-colors outline-none select-none",
                "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-xl",
                isActive
                  ? "text-slate-900 dark:text-white font-semibold"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="tab-bubble"
                  className="absolute inset-0 z-[-1] rounded-xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/10"
                  transition={{ type: "spring", stiffness: 450, damping: 35 }}
                />
              )}
              {tab.label}
            </TabsPrimitive.Trigger>
          );
        })}
      </TabsPrimitive.List>

      {/* Animated Content Stage */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm min-h-[220px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeTab.value}
            custom={direction}
            variants={tabContentVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full"
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
    </TabsPrimitive.Root>
  );
}

```

---

### Step 4: Component Usage

```tsx
import { DirectionalAnimatedTabs, type TabConfig } from "@/components/DirectionalAnimatedTabs";

const DEMO_TABS: TabConfig[] = [
  {
    value: "account",
    label: "Account",
    content: (
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Settings</h3>
        <p className="mt-2 text-sm text-slate-500">
          Manage your personal details, email preferences, and password.
        </p>
      </div>
    ),
  },
  {
    value: "integrations",
    label: "Integrations",
    content: (
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Connected Apps</h3>
        <p className="mt-2 text-sm text-slate-500">
          Connect GitHub, Slack, and Discord webhooks to stream build updates.
        </p>
      </div>
    ),
  },
  {
    value: "billing",
    label: "Billing",
    content: (
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Subscription & Usage</h3>
        <p className="mt-2 text-sm text-slate-500">
          View current tier usage, active invoices, and payment methods.
        </p>
      </div>
    ),
  },
];

export function Page() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
      <DirectionalAnimatedTabs tabs={DEMO_TABS} />
    </div>
  );
}

```

---

### Key Takeaways

* **`custom={direction}` Prop:** Passes the numerical direction (`1` or `-1`) directly into the enter/exit variants to determine slide polarity.
* **`mode="wait"` on `AnimatePresence`:** Ensures the exiting panel completes its departure before the incoming panel begins entering, preventing layout overlap.
* **`forceMount` on `TabsPrimitive.Content`:** Keeps the panel mounted so Framer Motion can complete exit transitions before unmounting.
* **`overflow-hidden` on Container:** Prevents horizontal scrollbars from appearing during the slide animations.
