***  name) in Tailwind CSS v4 for nested components.md ***

Named container queries solve the **context collision problem**: when you nest multiple containers inside each other, child elements naturally evaluate against the *nearest* ancestor container.

By labeling containers with `@container/<name>`, child elements can selectively query either the outer layout section (e.g., the sidebar) or the immediate inner component (e.g., an individual card) regardless of DOM depth.

---

### Step-by-Step Implementation

#### 1. Define Container Names

Use `@container/<name>` on ancestor elements to create independent query contexts:

* `@container/sidebar` on the parent layout panel.
* `@container/card` on the nested card wrapper.

#### 2. Target Specific Containers

Use `@<name>/<breakpoint>:` on child elements to specify which ancestor dictates the style:

* `@sidebar/lg:` checks if the sidebar width is $\ge$ `32rem` (512px).
* `@card/sm:` checks if the card width is $\ge$ `24rem` (384px).

---

### Complete Code Example (React / JSX)

```jsx
export function DashboardWithNestedCards() {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 p-6 flex gap-6">
      
      {/* ========================================================= */}
      {/* 1. OUTER CONTAINER: Named 'sidebar'                       */}
      {/* ========================================================= */}
      <aside className="@container/sidebar w-full max-w-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col gap-6">
        
        {/* Header responds to the SIDEBAR's dimensions */}
        <header className="flex flex-col @sidebar/md:flex-row @sidebar/md:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Workspace</h2>
            <p className="text-sm text-slate-500">Active project boards</p>
          </div>
          {/* Quick filter only visible when sidebar is spacious (>= 448px) */}
          <button className="hidden @sidebar/md:inline-flex px-3 py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition-colors">
            + New Project
          </button>
        </header>

        {/* Card Grid */}
        <div className="flex flex-col gap-4">
          
          {/* ===================================================== */}
          {/* 2. INNER CONTAINER: Named 'card'                      */}
          {/* ===================================================== */}
          <div className="@container/card bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4">
            
            {/* Card Layout reacts to BOTH containers simultaneously */}
            <div className="flex flex-col @card/sm:flex-row items-start @card/sm:items-center justify-between gap-4">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm @card/md:text-base">
                    API Migration v2
                  </h3>
                </div>
                {/* Secondary details respond to the local CARD width */}
                <p className="text-xs text-slate-500 @card/sm:max-w-xs">
                  Refactoring legacy REST endpoints into GraphQL subscriptions.
                </p>
              </div>

              {/* Action Buttons: 
                  - Stacked/wrapped on narrow cards
                  - Full action bar only when the parent SIDEBAR is wide */}
              <div className="flex items-center gap-2 w-full @card/sm:w-auto">
                <button className="flex-1 @card/sm:flex-none px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                  View
                </button>
                
                {/* Detailed stats pill appears ONLY if the SIDEBAR allows room */}
                <span className="hidden @sidebar/lg:inline-block px-2.5 py-1 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md text-slate-600 dark:text-slate-400">
                  84% done
                </span>
              </div>

            </div>
          </div>

        </div>
      </aside>
    </div>
  );
}

```

---

### How Container Modifiers Resolve

| Element Class              | Target Container   | Triggers When                                          |
| -------------------------- | ------------------ | ------------------------------------------------------ |
| `@sidebar/md:flex-row`     | Outer `<aside>`    | The `sidebar` element is $\ge$ `28rem` (448px)         |
| `@sidebar/lg:inline-block` | Outer `<aside>`    | The `sidebar` element is $\ge$ `32rem` (512px)         |
| `@card/sm:flex-row`        | Inner card wrapper | The individual `card` element is $\ge$ `24rem` (384px) |
| `@card/md:text-base`       | Inner card wrapper | The individual `card` element is $\ge$ `28rem` (448px) |

---

### Arbitrary Named Breakpoints

You can also combine named containers with arbitrary bracket values without predefining them in `@theme`:

```jsx
<div className="@container/modal">
  {/* Fires only when the container named 'modal' reaches 550px */}
  <div className="hidden @modal/[550px]:grid grid-cols-2">
    ...
  </div>
</div>

```
