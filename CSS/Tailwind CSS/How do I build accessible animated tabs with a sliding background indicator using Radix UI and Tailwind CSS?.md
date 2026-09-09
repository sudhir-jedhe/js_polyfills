***  How do I build accessible animated tabs with a sliding background indicator using Radix UI and Tailwind CSS?.md ***

Building accessible tabs with a sliding background pill indicator requires two key pieces:

1. **Radix UI (`@radix-ui/react-tabs`)** for accessibility, keyboard navigation (`ArrowLeft` / `ArrowRight`), and `aria-*` state synchronization.
2. **Dynamic Indicator Tracking** using a small `ref`-based offset tracker or **Framer Motion `layoutId**` to smoothly glide the indicator behind the active tab.

---

### Step 1: Install Dependencies

```bash
npm install @radix-ui/react-tabs framer-motion clsx tailwind-merge

```

---

### Step 2: Implement the Animated Tabs Component

Create `src/components/AnimatedTabs.tsx`. This component wraps Radix's state with Framer Motion's shared `layoutId` pill.

```tsx
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Tabs = TabsPrimitive.Root;
export const TabsContent = TabsPrimitive.Content;

export interface TabItem {
  value: string;
  label: string;
  badge?: string | number;
}

interface AnimatedTabsListProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> {
  tabs: TabItem[];
  activeTab: string;
  onTabChange?: (value: string) => void;
  indicatorLayoutId?: string;
}

export const AnimatedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  AnimatedTabsListProps
>(({ className, tabs, activeTab, onTabChange, indicatorLayoutId = "active-indicator", ...props }, ref) => {
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "relative inline-flex items-center gap-1 rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800",
        className
      )}
      {...props}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;

        return (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            onClick={() => onTabChange?.(tab.value)}
            className={cn(
              "relative z-10 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors outline-none",
              "focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
              "disabled:pointer-events-none disabled:opacity-40",
              isActive
                ? "text-slate-900 dark:text-white font-semibold"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
            )}
          >
            {/* Sliding Pill Indicator */}
            {isActive && (
              <motion.span
                layoutId={indicatorLayoutId}
                className="absolute inset-0 z-[-1] rounded-xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-slate-800 dark:ring-white/10"
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 35,
                }}
              />
            )}

            <span>{tab.label}</span>

            {tab.badge !== undefined && (
              <span
                className={cn(
                  "px-1.5 py-0.5 text-xs rounded-md transition-colors",
                  isActive
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300"
                    : "bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                )}
              >
                {tab.badge}
              </span>
            )}
          </TabsPrimitive.Trigger>
        );
      })}
    </TabsPrimitive.List>
  );
});

AnimatedTabsList.displayName = "AnimatedTabsList";

```

---

### Step 3: Example Usage with Panel Content

```tsx
import * as React from "react";
import { Tabs, AnimatedTabsList, TabsContent } from "@/components/AnimatedTabs";

const TABS_CONFIG = [
  { value: "overview", label: "Overview" },
  { value: "analytics", label: "Analytics", badge: "Live" },
  { value: "notifications", label: "Notifications", badge: 3 },
  { value: "settings", label: "Settings" },
];

export function DashboardTabs() {
  const [activeTab, setActiveTab] = React.useState("overview");

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="flex flex-col gap-6"
      >
        {/* Navigation Bar */}
        <AnimatedTabsList
          tabs={TABS_CONFIG}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Panels with gentle fade transition */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-6 bg-white dark:bg-slate-900 shadow-sm min-h-[180px]">
          <TabsContent value="overview" className="outline-none">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Project Overview</h3>
            <p className="mt-2 text-sm text-slate-500">
              Welcome back. All system modules are currently operational with zero open incidents.
            </p>
          </TabsContent>

          <TabsContent value="analytics" className="outline-none">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Realtime Analytics</h3>
            <p className="mt-2 text-sm text-slate-500">
              Traffic increased by +24.8% over the last 24 hours.
            </p>
          </TabsContent>

          <TabsContent value="notifications" className="outline-none">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Unread Notifications</h3>
            <p className="mt-2 text-sm text-slate-500">
              You have 3 unread team mentions in channel #general.
            </p>
          </TabsContent>

          <TabsContent value="settings" className="outline-none">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Account Settings</h3>
            <p className="mt-2 text-sm text-slate-500">
              Manage API keys, billing subscriptions, and webhooks.
            </p>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

```

---

### Alternative: CSS-Only Sliding Indicator (Without Framer Motion)

If you prefer zero runtime animation libraries, you can measure the active trigger with a React `ref` and translate a CSS indicator via inline CSS custom properties:

```tsx
import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

export function CSSOnlySlidingTabs() {
  const [indicatorStyle, setIndicatorStyle] = React.useState({ left: 0, width: 0 });
  const listRef = React.useRef<HTMLDivElement>(null);

  const updateIndicator = (element: HTMLElement) => {
    if (!listRef.current) return;
    const listRect = listRef.current.getBoundingClientRect();
    const tabRect = element.getBoundingClientRect();
    setIndicatorStyle({
      left: tabRect.left - listRect.left,
      width: tabRect.width,
    });
  };

  return (
    <TabsPrimitive.Root defaultValue="tab1">
      <TabsPrimitive.List
        ref={listRef}
        className="relative inline-flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-slate-800"
      >
        {/* CSS Sliding Pill */}
        <span
          className="absolute top-1 bottom-1 rounded-lg bg-white dark:bg-slate-800 shadow-sm transition-all duration-300 ease-out"
          style={{
            transform: `translateX(${indicatorStyle.left}px)`,
            width: `${indicatorStyle.width}px`,
          }}
        />

        <TabsPrimitive.Trigger
          value="tab1"
          ref={(node) => { if (node && node.dataset.state === "active") updateIndicator(node); }}
          onClick={(e) => updateIndicator(e.currentTarget)}
          className="relative z-10 px-4 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white"
        >
          Tab One
        </TabsPrimitive.Trigger>

        <TabsPrimitive.Trigger
          value="tab2"
          onClick={(e) => updateIndicator(e.currentTarget)}
          className="relative z-10 px-4 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 data-[state=active]:text-slate-900 dark:data-[state=active]:text-white"
        >
          Tab Two
        </TabsPrimitive.Trigger>
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}

```

---

### Why this Setup Works Best

* **Accessibility First:** Full WAI-ARIA `role="tablist"`, `role="tab"`, `role="tabpanel"`, and automatic arrow-key keyboard navigation handled by Radix.
* **No Layout Thrashing:** The sliding indicator uses `transform` (via hardware-accelerated spring animations), avoiding expensive repaint cycles.
* **Stacking Context Safety:** `z-[-1]` on the pill and `relative z-10` on the trigger keep text, badges, and focus rings clearly legible above the sliding pill.
