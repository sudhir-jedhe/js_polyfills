***  How do I use @container and container queries in Tailwind CSS for modular components?.md ***

Container queries allow components to adapt their internal layout based on the width of their **immediate parent container** rather than the entire browser viewport (`@media`). This makes components truly modular—a single card component can render as a compact vertical stack in a narrow sidebar while automatically rendering as a multi-column horizontal banner in a wide dashboard area.

---

### Step 1: Core Mechanics

1. **Mark the Parent:** Apply `@container` to the parent wrapper (sets `container-type: inline-size`).
2. **Style the Children:** Prefix utility classes inside child elements with `@<breakpoint>:` or arbitrary container widths like `@[400px]:`.

---

### Step 2: Default Container Breakpoints

| Container Variant | Default Minimum Width    |
| ----------------- | ------------------------ |
| `@xs:`            | `20rem` ($320\text{px}$) |
| `@sm:`            | `24rem` ($384\text{px}$) |
| `@md:`            | `28rem` ($448\text{px}$) |
| `@lg:`            | `32rem` ($512\text{px}$) |
| `@xl:`            | `36rem` ($576\text{px}$) |
| `@2xl:`           | `42rem` ($672\text{px}$) |
| `@3xl:`           | `48rem` ($768\text{px}$) |

---

### Step 3: Building a Modular Component

Here is a self-contained product card that dynamically changes its layout, image aspect ratio, and typography solely based on its container size:

```tsx
// components/ModularUserCard.tsx
export function ModularUserCard() {
  return (
    // 1. Establish the container query context
    <div className="@container">
      {/* 
        - Default (< 384px): Stacked vertical layout with compact details
        - @sm (>= 384px): Switches to horizontal row layout
        - @lg (>= 512px): Expands avatar size, reveals extended bio, and increases padding
      */}
      <article className="flex flex-col @sm:flex-row items-start @sm:items-center gap-4 p-4 @lg:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        
        {/* Avatar / Thumbnail */}
        <div className="relative w-12 h-12 @lg:w-16 @lg:h-16 rounded-full overflow-hidden shrink-0 bg-slate-100">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
            alt="Sarah Jenkins"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm @lg:text-base font-bold text-slate-900 dark:text-white truncate">
              Sarah Jenkins
            </h3>
            <span className="hidden @sm:inline-flex px-2 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              Active
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Staff Product Designer
          </p>

          {/* Extended description: hidden in narrow containers, visible at @lg */}
          <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 hidden @lg:block pt-1">
            Focusing on accessible design systems, fluid responsive typography, and cross-platform token architecture.
          </p>
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="w-full @sm:w-auto shrink-0 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
        >
          View Profile
        </button>

      </article>
    </div>
  );
}

```

---

### Step 4: Reusing Across Different Layout Contexts

Because the component relies on `@container`, you can drop the exact same component into a narrow sidebar and a wide dashboard without writing any viewport media queries:

```tsx
// app/dashboard/page.tsx
import { ModularUserCard } from "@/components/ModularUserCard";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-7xl mx-auto">
      
      {/* Narrow Sidebar: Renders as compact vertical stack */}
      <aside className="lg:col-span-1 space-y-4">
        <h2 className="text-sm font-bold text-slate-500 uppercase">Team Sidebar</h2>
        <ModularUserCard />
      </aside>

      {/* Wide Main Content: Renders as spacious horizontal card */}
      <main className="lg:col-span-2 space-y-4">
        <h2 className="text-sm font-bold text-slate-500 uppercase">Main Feed</h2>
        <ModularUserCard />
      </main>

    </div>
  );
}

```

---

### Step 5: Named Containers for Nested Structures

When you have nested containers and want a deeply nested element to query an outer ancestor rather than its immediate parent, name the container using `@container/{name}`:

```html
<!-- Outer named container -->
<div class="@container/sidebar">
  <div class="p-4">
    <!-- Inner anonymous container -->
    <div class="@container">
      <!-- Queries the inner parent -->
      <span class="@sm:text-lg">Inner responsive text</span>

      <!-- Targets the outer sidebar specifically -->
      <button class="@lg/sidebar:px-6 @lg/sidebar:py-3">
        Outer-aware Button
      </button>
    </div>
  </div>
</div>

```

---

### Customizing Container Breakpoints in Tailwind v4

Override or extend container breakpoint tokens inside `@theme` in `globals.css`:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --container-2xs: 16rem; /* 256px -> usable as @2xs: */
  --container-3xl: 64rem; /* 1024px -> usable as @3xl: */
}

```
