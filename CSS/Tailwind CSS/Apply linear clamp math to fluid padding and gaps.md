Applying linear `clamp()` math to spacing (padding, margin, gap) uses the exact same $y = mx + b$ linear equation as fluid typography, substituted into properties like `padding`, `margin`, or `gap`.

---

### Spacing Mathematical Formula

Given:

* **Container Bounds:** $W_{\min}$ (e.g., $320\text{px}$) to $W_{\max}$ (e.g., $1280\text{px}$)
* **Target Spacing Bounds:** $P_{\min}$ to $P_{\max}$ (e.g., $16\text{px}$ to $64\text{px}$)

$$\text{Slope } (m) = \frac{P_{\max} - P_{\min}}{W_{\max} - W_{\min}} = \frac{64 - 16}{1280 - 320} = \frac{48}{960} = 0.05 \implies 5\text{cqi}$$

$$\text{Y-Intercept } (b) = P_{\min} - (m \times W_{\min}) = 16 - (0.05 \times 320) = 0\text{px} \implies 0\text{rem}$$

$$\text{Result: } \text{clamp}(1\text{rem}, 0\text{rem} + 5\text{cqi}, 4\text{rem})$$

---

### Step 1: Fluid Spacing Presets in Tailwind CSS v4

In your main CSS file (`globals.css` / `index.css`), configure fluid spacing tokens using `@theme` and custom utility classes:

```css
@import "tailwindcss";

@theme {
  /* 1. Register fluid tokens under --spacing-* */
  --spacing-fluid-sm: clamp(0.5rem, 0.25rem + 1.25cqi, 1rem);      /* 8px -> 16px */
  --spacing-fluid-md: clamp(1rem, 0.5rem + 2.5cqi, 2rem);          /* 16px -> 32px */
  --spacing-fluid-lg: clamp(1.5rem, 0.75rem + 3.75cqi, 3rem);      /* 24px -> 48px */
  --spacing-fluid-xl: clamp(2rem, 1rem + 5cqi, 4.5rem);            /* 32px -> 72px */
  --spacing-fluid-section: clamp(2.5rem, 1rem + 7.5cqi, 7rem);     /* 40px -> 112px */
}

```

Because these are registered in `--spacing-*`, Tailwind v4 automatically exposes them across **padding**, **margin**, **gap**, **inset**, and **sizing** utilities.

---

### Step 2: Generated Class Names

| Utility Type        | Generated Class                   | Property Output                               |
| ------------------- | --------------------------------- | --------------------------------------------- |
| **All Padding**     | `p-fluid-md`                      | `padding: var(--spacing-fluid-md);`           |
| **X/Y Padding**     | `px-fluid-section`, `py-fluid-lg` | `padding-inline: ...; padding-block: ...;`    |
| **Grid / Flex Gap** | `gap-fluid-md`, `gap-x-fluid-lg`  | `gap: var(--spacing-fluid-md);`               |
| **Margin**          | `my-fluid-section`, `mt-fluid-xl` | `margin-block: ...; margin-top: ...;`         |
| **Space-Between**   | `space-y-fluid-md`                | `& > :not(:first-child) { margin-top: ...; }` |

---

### Step 3: Pure Dynamic `calc()` Spacing Utility

If you want dynamic parametric spacing without pre-calculated `clamp()` values, write a generic `@utility`:

```css
:root {
  --fluid-min-w: 20;  /* 320px */
  --fluid-max-w: 80;  /* 1280px */
}

/* Parametric padding utility */
@utility p-fluid {
  --min-p: 1; /* default 16px */
  --max-p: 3; /* default 48px */
  
  padding: clamp(
    calc(var(--min-p) * 1rem),
    calc(
      (var(--min-p) * 1rem) + 
      (var(--max-p) - var(--min-p)) * 
      (100cqi - (var(--fluid-min-w) * 1rem)) / 
      (var(--fluid-max-w) - var(--fluid-min-w))
    ),
    calc(var(--max-p) * 1rem)
  );
}

```

---

### Step 4: Component Implementation

```jsx
export function FluidSection() {
  return (
    <section className="@container w-full">
      {/* Outer wrapper: fluid section padding that scales with parent size */}
      <div className="p-fluid-section bg-slate-900 text-white rounded-3xl">
        
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold">Responsive Layout Grid</h2>
          <p className="text-slate-400 mt-2">
            Gaps and internal padding expand smoothly as available container width increases.
          </p>
        </div>

        {/* Dynamic fluid grid gap */}
        <div className="grid grid-cols-1 @md:grid-cols-3 gap-fluid-lg mt-fluid-lg">
          <div className="p-fluid-md bg-slate-800 border border-slate-700 rounded-2xl">
            <h3 className="font-semibold text-lg">Card A</h3>
            <p className="text-sm text-slate-400 mt-1">Adaptive internal padding.</p>
          </div>

          <div className="p-fluid-md bg-slate-800 border border-slate-700 rounded-2xl">
            <h3 className="font-semibold text-lg">Card B</h3>
            <p className="text-sm text-slate-400 mt-1">Consistent relative spacing.</p>
          </div>

          <div className="p-fluid-md bg-slate-800 border border-slate-700 rounded-2xl">
            <h3 className="font-semibold text-lg">Card C</h3>
            <p className="text-sm text-slate-400 mt-1">No breakpoint jumps.</p>
          </div>
        </div>

      </div>
    </section>
  );
}

```

---

### Comparison: Fixed Breakpoints vs Fluid Spacing

| Metric                  | Traditional Utility Breakpoints (`p-4 md:p-8 lg:p-16`) | Fluid Spacing (`p-fluid-section`)                               |
| ----------------------- | ------------------------------------------------------ | --------------------------------------------------------------- |
| **Visual Smoothness**   | Abrupt visual "jumps" when passing breakpoints         | Linear, continuous scaling with container width                 |
| **Markup Length**       | Verbose class lists per element                        | Single utility class (`gap-fluid-md`)                           |
| **Sub-Grid Adaptation** | Unaware of parent container width                      | Perfectly proportional in narrow sidebars or wide content feeds |
