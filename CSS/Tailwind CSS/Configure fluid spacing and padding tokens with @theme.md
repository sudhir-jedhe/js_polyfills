In Tailwind CSS v4, defining custom spacing variables inside the `@theme` directive under the `--spacing-*` namespace automatically binds them across all spacing, padding, margin, gap, and dimension utilities without requiring manual configuration in JavaScript.

---

### Step 1: Fluid Spacing Mathematical Formula

Using linear interpolation ($y = mx + b$) across standard mobile-to-desktop viewport bounds ($375\text{px}$ to $1280\text{px}$ with a $16\text{px}$ root font size):

$$\text{clamp}(S_{\min}\text{rem},\, y\text{-intercept}\text{rem} + \text{slope} \cdot 100\text{vw},\, S_{\max}\text{rem})$$

* **Slope ($m$):** $\frac{S_{\max} - S_{\min}}{1280 - 375}$
* **$y$-Intercept ($b$):** $S_{\min} - (375 \times m)$

---

### Step 2: Declare Fluid Spacing Tokens in `globals.css`

Define your fluid spacing scale directly inside `@theme` in `app/globals.css`:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* ------------------------------------------------------------------------ */
  /* FLUID SPACING & PADDING TOKENS (--spacing-fluid-*)                         */
  /* Viewport Range: 375px (23.4375rem) -> 1280px (80rem)                    */
  /* ------------------------------------------------------------------------ */

  /* Micro Inset / Badge Padding: 4px (0.25rem) -> 8px (0.5rem) */
  --spacing-fluid-xs: clamp(0.25rem, 0.1464rem + 0.442vw, 0.5rem);

  /* Compact Inset / Small Card Padding: 8px (0.5rem) -> 14px (0.875rem) */
  --spacing-fluid-sm: clamp(0.5rem, 0.3446rem + 0.663vw, 0.875rem);

  /* Component Inset / Standard Card Padding: 16px (1rem) -> 24px (1.5rem) */
  --spacing-fluid-md: clamp(1rem, 0.7928rem + 0.884vw, 1.5rem);

  /* Large Card Padding / Section Gap: 24px (1.5rem) -> 40px (2.5rem) */
  --spacing-fluid-lg: clamp(1.5rem, 1.0856rem + 1.768vw, 2.5rem);

  /* Section Padding / Module Gap: 32px (2rem) -> 64px (4rem) */
  --spacing-fluid-xl: clamp(2rem, 1.1713rem + 3.5359vw, 4rem);

  /* Macro Section Vertical Padding: 48px (3rem) -> 96px (6rem) */
  --spacing-fluid-2xl: clamp(3rem, 1.7569rem + 5.3039vw, 6rem);

  /* Hero Section Vertical Padding: 64px (4rem) -> 144px (9rem) */
  --spacing-fluid-3xl: clamp(4rem, 1.9282rem + 8.8398vw, 9rem);

  /* Horizontal Page Gutter / Container Inset: 16px (1rem) -> 48px (3rem) */
  --spacing-fluid-gutter: clamp(1rem, 0.1713rem + 3.5359vw, 3rem);
}

```

---

### Step 3: Available Tailwind Utility Mappings

Declaring `--spacing-fluid-*` inside `@theme` automatically registers the tokens across all spacing-dependent utility classes:

| Utility Domain                    | Example Class                     | Pixel Range ($375\text{px} \to 1280\text{px}$)                |
| --------------------------------- | --------------------------------- | ------------------------------------------------------------- |
| **Padding (All sides)**           | `p-fluid-md`, `p-fluid-lg`        | $16\text{px} \to 24\text{px}$, $24\text{px} \to 40\text{px}$  |
| **Horizontal / Vertical Padding** | `px-fluid-gutter`, `py-fluid-3xl` | $16\text{px} \to 48\text{px}$, $64\text{px} \to 144\text{px}$ |
| **Grid & Flexbox Gap**            | `gap-fluid-md`, `gap-x-fluid-lg`  | $16\text{px} \to 24\text{px}$, $24\text{px} \to 40\text{px}$  |
| **Margin**                        | `m-fluid-xl`, `my-fluid-2xl`      | $32\text{px} \to 64\text{px}$, $48\text{px} \to 96\text{px}$  |
| **Element Sizing**                | `w-fluid-xl`, `h-fluid-3xl`       | $32\text{px} \to 64\text{px}$, $64\text{px} \to 144\text{px}$ |
| **Position Insets**               | `top-fluid-sm`, `inset-fluid-md`  | $8\text{px} \to 14\text{px}$, $16\text{px} \to 24\text{px}$   |

---

### Step 4: Component Implementation Example

Use `px-fluid-gutter`, `py-fluid-3xl`, and `gap-fluid-lg` to create fully responsive container and card layouts without breakpoint prefixes:

```tsx
// components/FeatureSection.tsx
export function FeatureSection() {
  return (
    // Outer section with fluid page gutters and vertical rhythm
    <section className="mx-auto max-w-7xl px-fluid-gutter py-fluid-3xl">
      <div className="flex flex-col gap-fluid-xl">
        
        {/* Section Header */}
        <div className="flex flex-col gap-fluid-xs max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Design Tokens
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Fluid Spacing & Padding Scale
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-base">
            Container padding, internal card insets, and grid gaps scale smoothly across all viewports without manual media queries.
          </p>
        </div>

        {/* Responsive Grid with Fluid Column Gaps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-fluid-lg">
          {[
            { title: "Fluid Insets", desc: "Internal padding scales between 24px and 40px." },
            { title: "Dynamic Gaps", desc: "Grid separation scales proportionally with screen width." },
            { title: "Zero Layout Shifts", desc: "Eliminates jarring breakpoint jumps across mobile and desktop." },
          ].map((item, index) => (
            <div
              key={index}
              className="p-fluid-lg rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col gap-fluid-sm shadow-sm"
            >
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                0{index + 1}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

```

---

### Implementation Recommendations

* **Keep Min/Max Boundaries in `rem`:** Ensures that user browser font-scaling and zoom settings remain fully functional for accessibility.
* **Anchor Macro Gutters with `px-fluid-gutter`:** Avoid hardcoded container side-paddings (`px-4`, `px-6`, `px-8`) by standardizing on `px-fluid-gutter` across page templates.
* **Combine with `min-w-0` in Flex/Grid Children:** Always pair fluid gaps and padding with `min-w-0` on nested flex/grid children to prevent text overflow blowouts.
