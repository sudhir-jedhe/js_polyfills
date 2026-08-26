*** copy How do I configure fluid responsive typography scales using CSS clamp() in Tailwind CSS v4 @theme?.md ***

In Tailwind CSS v4, you configure fluid responsive typography by defining CSS `clamp()` formulas directly on font size tokens within the **`@theme`** block in your CSS file.

Because `@theme` replaces `tailwind.config.js`, registering `--text-*` variables in CSS automatically generates the corresponding utility classes (e.g., `text-fluid-base`, `text-fluid-hero`) with fluid line heights and tracking.

---

### Step 1: Fluid Typography Math Formula

A linear clamp formula scales font size proportionally between a minimum viewport width ($V_{\min}$) and a maximum viewport width ($V_{\max}$):

$$\text{font-size} = \text{clamp}(S_{\min}, \text{remValue} + \text{slope} \cdot 100\text{vw}, S_{\max})$$

Where:

* **Viewport Range:** $375\text{px}$ ($23.4375\text{rem}$) to $1280\text{px}$ ($80\text{rem}$)
* **Slope:** $\frac{S_{\max} - S_{\min}}{V_{\max} - V_{\min}}$
* **Intersection ($y$-intercept):** $S_{\min} - (V_{\min} \times \text{Slope})$

---

### Step 2: Configure Fluid Font Tokens in `globals.css`

Define your fluid typography scale in `globals.css`. In Tailwind v4, pair each `--text-*` scale token with corresponding `--text-*--line-height` and `--text-*--letter-spacing` sub-properties.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* ------------------------------------------------------------------------ */
  /* FLUID FONT SIZES: clamp(minSize, yAxisIntersection + slope, maxSize)     */
  /* Base Viewport Range: 375px (23.4375rem) -> 1280px (80rem)               */
  /* ------------------------------------------------------------------------ */

  /* Small: 13px (0.8125rem) -> 14px (0.875rem) */
  --text-fluid-sm: clamp(0.8125rem, 0.7866rem + 0.1105vw, 0.875rem);
  --text-fluid-sm--line-height: 1.45;

  /* Base Body: 15px (0.9375rem) -> 18px (1.125rem) */
  --text-fluid-base: clamp(0.9375rem, 0.8599rem + 0.3315vw, 1.125rem);
  --text-fluid-base--line-height: 1.6;

  /* Large / Subheading: 18px (1.125rem) -> 24px (1.5rem) */
  --text-fluid-lg: clamp(1.125rem, 0.9698rem + 0.663vw, 1.5rem);
  --text-fluid-lg--line-height: 1.35;
  --text-fluid-lg--letter-spacing: -0.01em;

  /* Heading 2: 24px (1.5rem) -> 36px (2.25rem) */
  --text-fluid-2xl: clamp(1.5rem, 1.1895rem + 1.326vw, 2.25rem);
  --text-fluid-2xl--line-height: 1.2;
  --text-fluid-2xl--letter-spacing: -0.02em;

  /* Heading 1: 32px (2rem) -> 56px (3.5rem) */
  --text-fluid-4xl: clamp(2rem, 1.379rem + 2.6519vw, 3.5rem);
  --text-fluid-4xl--line-height: 1.1;
  --text-fluid-4xl--letter-spacing: -0.03em;

  /* Display Hero: 40px (2.5rem) -> 80px (5rem) */
  --text-fluid-hero: clamp(2.5rem, 1.4655rem + 4.4199vw, 5rem);
  --text-fluid-hero--line-height: 1.02;
  --text-fluid-hero--letter-spacing: -0.035em;
}

```

---

### Step 3: Use the Generated Utility Classes

You can now use classes like `text-fluid-base`, `text-fluid-2xl`, and `text-fluid-hero` without breakpoint prefixes (`md:`, `lg:`):

```tsx
// components/HeroSection.tsx
export function HeroSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-16 space-y-6">
      <span className="text-fluid-sm font-semibold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
        Tailwind CSS v4 Fluid Scaling
      </span>

      <h1 className="text-fluid-hero font-extrabold text-slate-900 dark:text-white">
        Scales smoothly without breakpoint jumps.
      </h1>

      <p className="text-fluid-lg text-slate-600 dark:text-slate-300 max-w-2xl">
        This sub-headline fluidly scales from 18px on mobile to 24px on wide screens while maintaining proportional line height.
      </p>

      <p className="text-fluid-base text-slate-500 dark:text-slate-400 max-w-prose">
        Standard body text automatically interpolates between 15px and 18px across all viewport widths.
      </p>
    </section>
  );
}

```

---

### Step 4: Combine Fluid Typography with CVA

```tsx
// components/Typography.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const typographyVariants = cva("text-slate-900 dark:text-slate-100", {
  variants: {
    size: {
      sm: "text-fluid-sm font-normal text-slate-500 dark:text-slate-400",
      base: "text-fluid-base font-normal",
      subheading: "text-fluid-lg font-medium",
      title: "text-fluid-2xl font-bold tracking-tight",
      heading: "text-fluid-4xl font-extrabold tracking-tight",
      hero: "text-fluid-hero font-black tracking-tighter",
    },
  },
  defaultVariants: {
    size: "base",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4";
}

export function Typography({
  as: Component = "p",
  size,
  className,
  children,
  ...props
}: TypographyProps) {
  return (
    <Component className={cn(typographyVariants({ size }), className)} {...props}>
      {children}
    </Component>
  );
}

```

---

### Fluid Typography Calculation Matrix

| Token Name          | Mobile Size ($375\text{px}$)       | Desktop Size ($1280\text{px}$)    | Generated Tailwind v4 Utility |
| ------------------- | ---------------------------------- | --------------------------------- | ----------------------------- |
| `--text-fluid-sm`   | $13\text{px}$ ($0.8125\text{rem}$) | $14\text{px}$ ($0.875\text{rem}$) | `text-fluid-sm`               |
| `--text-fluid-base` | $15\text{px}$ ($0.9375\text{rem}$) | $18\text{px}$ ($1.125\text{rem}$) | `text-fluid-base`             |
| `--text-fluid-lg`   | $18\text{px}$ ($1.125\text{rem}$)  | $24\text{px}$ ($1.5\text{rem}$)   | `text-fluid-lg`               |
| `--text-fluid-2xl`  | $24\text{px}$ ($1.5\text{rem}$)    | $36\text{px}$ ($2.25\text{rem}$)  | `text-fluid-2xl`              |
| `--text-fluid-4xl`  | $32\text{px}$ ($2.0\text{rem}$)    | $56\text{px}$ ($3.5\text{rem}$)   | `text-fluid-4xl`              |
| `--text-fluid-hero` | $40\text{px}$ ($2.5\text{rem}$)    | $80\text{px}$ ($5.0\text{rem}$)   | `text-fluid-hero`             |

---

### Implementation Tips

* **Always use `rem` for min/max thresholds:** This ensures the font size scales proportionally if users adjust default browser zoom or font settings for accessibility.
* **Define Unitless Line Heights:** Fluid font sizes can produce clipping or oversized line heights with pixel-based values. Keep line heights unitless (e.g., `1.1`, `1.6`) or use fluid line height variables (`--text-*--line-height`).
* **Pair with `max-w-prose`:** As font size grows on large displays, constrain paragraph line length to 65–75 characters using `max-w-prose` or `max-w-2xl` to preserve readability.