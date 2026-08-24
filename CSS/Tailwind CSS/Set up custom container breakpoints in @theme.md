In Tailwind CSS v4, container queries are built directly into the engine. You define and customize container query breakpoints in your CSS file using the `@theme` directive under the `--container-*` namespace.

---

### Step 1: Define Custom Container Breakpoints in `globals.css`

Add your custom breakpoint tokens inside `@theme` in your main stylesheet (e.g., `app/globals.css`):

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* ------------------------------------------------------------------------ */
  /* CUSTOM CONTAINER QUERY BREAKPOINTS (--container-*)                       */
  /* ------------------------------------------------------------------------ */
  
  /* Micro cards & sidebar sub-widgets */
  --container-2xs: 16rem;   /* 256px */
  --container-xs: 20rem;    /* 320px */
  --container-sm: 24rem;    /* 384px */
  
  /* Standard card layouts & split columns */
  --container-md: 28rem;    /* 448px */
  --container-lg: 32rem;    /* 512px */
  
  /* Multi-column grid panels & macro regions */
  --container-xl: 38rem;    /* 608px */
  --container-2xl: 48rem;   /* 768px */
  --container-3xl: 64rem;   /* 1024px */
}

```

---

### Step 2: Container Query Syntax Reference

Once declared, the `--container-*` tokens generate variant modifiers corresponding to their suffix:

| Theme Token       | Variant Syntax   | Max-Width Variant    | Pixel Width |
| ----------------- | ---------------- | -------------------- | ----------- |
| `--container-2xs` | `@2xs:<utility>` | `@max-2xs:<utility>` | `256px`     |
| `--container-xs`  | `@xs:<utility>`  | `@max-xs:<utility>`  | `320px`     |
| `--container-sm`  | `@sm:<utility>`  | `@max-sm:<utility>`  | `384px`     |
| `--container-md`  | `@md:<utility>`  | `@max-md:<utility>`  | `448px`     |
| `--container-lg`  | `@lg:<utility>`  | `@max-lg:<utility>`  | `512px`     |
| `--container-xl`  | `@xl:<utility>`  | `@max-xl:<utility>`  | `608px`     |
| `--container-2xl` | `@2xl:<utility>` | `@max-2xl:<utility>` | `768px`     |
| `--container-3xl` | `@3xl:<utility>` | `@max-3xl:<utility>` | `1024px`    |

---

### Step 3: Anonymous Container Implementation

Apply `@container` to the parent wrapper so descendants query the parent's inline size rather than the global viewport window:

```tsx
// components/ResponsiveProductCard.tsx
export function ResponsiveProductCard() {
  return (
    // 1. Establish the container query context
    <div className="@container">
      {/* 
        - Default (< 256px): Stacked vertical layout
        - @2xs (>= 256px): Shows rating badge
        - @sm  (>= 384px): Switches to 2-column horizontal card layout
        - @lg  (>= 512px): Expands typography and adds extended description
      */}
      <article className="flex flex-col @sm:flex-row items-start @sm:items-center gap-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        
        {/* Thumbnail: adjusts size based on container width */}
        <div className="relative w-full @sm:w-28 @lg:w-36 aspect-video @sm:aspect-square rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80"
            alt="Wireless Headphones"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Details */}
        <div className="flex flex-col flex-1 min-w-0 gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Audio
            </span>
            <span className="hidden @2xs:inline-flex px-2 py-0.5 text-[11px] font-bold rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300">
              ★ 4.9
            </span>
          </div>

          <h3 className="text-sm @lg:text-base font-bold text-slate-900 dark:text-white truncate">
            Pro Active Noise-Cancelling Headphones
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 hidden @lg:block">
            Engineered with high-fidelity dynamic drivers and adaptive spatial audio calibration.
          </p>

          <div className="mt-2 flex items-center justify-between gap-2">
            <span className="text-sm @lg:text-base font-black text-slate-900 dark:text-white">
              $299.00
            </span>
            <button className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500">
              Add to Cart
            </button>
          </div>
        </div>

      </article>
    </div>
  );
}

```

---

### Step 4: Named Containers with Custom `@theme` Breakpoints

When targeting a specific outer container across nested layouts, append the container name:

```tsx
// components/DashboardLayout.tsx
export function DashboardLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      
      {/* Named Sidebar Container */}
      <aside className="@container/sidebar w-full md:w-80 border-r p-4">
        {/* Only switches to horizontal layout when the sidebar specifically exceeds 384px (--container-sm) */}
        <div className="flex flex-col @sm/sidebar:flex-row gap-2">
          <button className="flex-1 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold">
            Quick Action
          </button>
        </div>
      </aside>

      {/* Named Main Content Container */}
      <main className="@container/main flex-1 p-6">
        {/* Switches to 3 columns when main exceeds 608px (--container-xl) */}
        <div className="grid grid-cols-1 @md/main:grid-cols-2 @xl/main:grid-cols-3 gap-4">
          <ResponsiveProductCard />
          <ResponsiveProductCard />
          <ResponsiveProductCard />
        </div>
      </main>

    </div>
  );
}

```

---

### Step 5: One-Off Arbitrary Container Queries

If an element needs a custom pixel threshold without creating a global token in `@theme`, use inline bracket syntax:

```html
<!-- Triggers flex-row when container width >= 400px -->
<div class="@container">
  <div class="flex flex-col @[400px]:flex-row gap-4">
    <div class="w-full @[400px]:w-1/2">Left Column</div>
    <div class="w-full @[400px]:w-1/2">Right Column</div>
  </div>
</div>

```
