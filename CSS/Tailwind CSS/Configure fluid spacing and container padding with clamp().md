*** copy Configure fluid spacing and container padding with clamp().md ***

In Tailwind CSS v4, defining custom spacing variables inside the `@theme` directive under the `--spacing-*` namespace automatically registers them across all spacing utilities: padding (`p-*`), margin (`m-*`), gap (`gap-*`), width/height (`w-*`, `h-*`), and insets (`top-*`, `inset-*`).

---

### Step 1: Fluid Spacing Math Formula

Using the linear interpolation formula ($y = mx + b$) across standard viewports ($375\text{px}$ to $1280\text{px}$ at $16\text{px}$ base font):

$$\text{clamp}(S_{\min}\text{rem},\, y\text{-intercept}\text{rem} + \text{slope} \cdot 100\text{vw},\, S_{\max}\text{rem})$$

* **Slope ($m$):** $\frac{S_{\max} - S_{\min}}{1280 - 375}$
* **$y$-intercept ($b$):** $S_{\min} - (375 \times m)$

---

### Step 2: Declare Fluid Spacing Tokens in `globals.css`

Define your fluid spacing scale directly inside `@theme` in `app/globals.css`:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* ------------------------------------------------------------------------ */
  /* FLUID SPACING & GAPS: clamp(min, intercept + slope, max)                 */
  /* Base Viewport Range: 375px (23.4375rem) -> 1280px (80rem)               */
  /* ------------------------------------------------------------------------ */

  /* Micro Inset: 4px (0.25rem) -> 8px (0.5rem) */
  --spacing-fluid-xs: clamp(0.25rem, 0.1464rem + 0.442vw, 0.5rem);

  /* Card Inset / Compact Gap: 8px (0.5rem) -> 14px (0.875rem) */
  --spacing-fluid-sm: clamp(0.5rem, 0.3446rem + 0.663vw, 0.875rem);

  /* Component Padding / Standard Gap: 16px (1rem) -> 24px (1.5rem) */
  --spacing-fluid-md: clamp(1rem, 0.7928rem + 0.884vw, 1.5rem);

  /* Section Gap / Large Inset: 24px (1.5rem) -> 40px (2.5rem) */
  --spacing-fluid-lg: clamp(1.5rem, 1.0856rem + 1.768vw, 2.5rem);

  /* Block Spacing / Module Gap: 32px (2rem) -> 64px (4rem) */
  --spacing-fluid-xl: clamp(2rem, 1.1713rem + 3.5359vw, 4rem);

  /* Macro Section Padding: 48px (3rem) -> 96px (6rem) */
  --spacing-fluid-2xl: clamp(3rem, 1.7569rem + 5.3039vw, 6rem);

  /* Hero Banner Vertical Padding: 64px (4rem) -> 144px (9rem) */
  --spacing-fluid-3xl: clamp(4rem, 1.9282rem + 8.8398vw, 9rem);

  /* Page Horizontal Gutter: 16px (1rem) -> 48px (3rem) */
  --spacing-fluid-gutter: clamp(1rem, 0.1713rem + 3.5359vw, 3rem);
}

```

---

### Step 3: Available Utility Classes

Declaring `--spacing-fluid-*` activates the scale across all Tailwind spacing utilities:

| Spacing Type           | Utility Example                   | Pixel Range ($375\text{px} \to 1280\text{px}$)                        |
| ---------------------- | --------------------------------- | --------------------------------------------------------------------- |
| **Container Padding**  | `px-fluid-gutter`, `py-fluid-3xl` | $16\text{px} \to 48\text{px}$ (X), $64\text{px} \to 144\text{px}$ (Y) |
| **Card / Box Padding** | `p-fluid-md`, `p-fluid-lg`        | $16\text{px} \to 24\text{px}$, $24\text{px} \to 40\text{px}$          |
| **Grid & Flex Gaps**   | `gap-fluid-md`, `gap-x-fluid-lg`  | $16\text{px} \to 24\text{px}$, $24\text{px} \to 40\text{px}$          |
| **Section Margins**    | `my-fluid-2xl`, `mb-fluid-xl`     | $48\text{px} \to 96\text{px}$, $32\text{px} \to 64\text{px}$          |
| **Element Insets**     | `top-fluid-sm`, `inset-fluid-md`  | $8\text{px} \to 14\text{px}$, $16\text{px} \to 24\text{px}$           |

---

### Step 4: Practical Component Layout Implementation

Use `px-fluid-gutter` and `py-fluid-3xl` to build responsive container layouts without breakpoint prefixes (`md:px-8`, `lg:px-12`):

```tsx
// components/MarketingSection.tsx
export function MarketingSection() {
  return (
    // Outer container with responsive gutters and vertical spacing
    <section className="mx-auto max-w-7xl px-fluid-gutter py-fluid-3xl">
      <div className="flex flex-col gap-fluid-xl">
        
        {/* Section Header */}
        <div className="flex flex-col gap-fluid-xs max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Fluid Layout Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Proportional spacing across all screens.
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Page gutters, grid column gaps, and card insets adjust dynamically without fixed media queries.
          </p>
        </div>

        {/* Card Grid with Fluid Gaps and Internal Padding */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-fluid-lg">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="p-fluid-lg rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-fluid-sm shadow-sm"
            >
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                0{item}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Card Module {item}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Internal card padding scales from 24px on mobile to 40px on desktop screens.
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

```