*** copy How should I organize design system tokens between Tailwind v4 @theme and component-level CVA variants?.md ***

A scalable design system maintains a strict **three-tier boundary**: Global tokens and Semantic tokens live in Tailwind v4's CSS `@theme`, while Component-specific permutations, structural logic, and state interactions belong exclusively inside component-level **CVA** definitions.

```
┌─────────────────────────────────────────────────────────────┐
│ 1. GLOBAL PRIMITIVES (Raw values: Hex, OKLCH, rem)          │
│    :root { --blue-600: #2563eb; --radius-xl: 0.75rem; }     │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 2. SEMANTIC TOKENS (Contextual: theme-aware, dark mode)     │
│    @theme { --color-primary: var(--blue-600); }             │
└──────────────────────────────┬──────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────┐
│ 3. COMPONENT VARIANTS (Anatomy, logic & component API)      │
│    cva("...", { variants: { intent: { primary: "..." } } }) │
└─────────────────────────────────────────────────────────────┘

```

---

### Tier 1 & 2: CSS Token Organization (`globals.css`)

Separate raw primitives from semantic tokens. Semantic tokens point to CSS custom properties so they can change values under `.dark`, high-contrast modes, or tenant themes.

```css
@import "tailwindcss";

/* -------------------------------------------------------------------------- */
/* TIER 1: GLOBAL PRIMITIVES (Raw color palettes, scales, base constants)      */
/* -------------------------------------------------------------------------- */
:root {
  --color-slate-50:  oklch(0.98 0.005 240);
  --color-slate-100: oklch(0.94 0.01 240);
  --color-slate-800: oklch(0.24 0.02 240);
  --color-slate-900: oklch(0.16 0.02 240);

  --color-indigo-500: oklch(0.62 0.22 260);
  --color-indigo-600: oklch(0.55 0.22 260);
  --color-indigo-700: oklch(0.48 0.22 260);

  --color-rose-500: oklch(0.62 0.24 15);
  --color-rose-600: oklch(0.55 0.24 15);

  /* Semantic defaults (Light) */
  --bg-app: var(--color-slate-50);
  --bg-surface: oklch(1 0 0);
  --border-subtle: var(--color-slate-100);

  --text-main: var(--color-slate-900);
  --text-muted: oklch(0.45 0.02 240);

  --brand-primary: var(--color-indigo-600);
  --brand-primary-hover: var(--color-indigo-700);
  --brand-on-primary: oklch(1 0 0);

  --brand-danger: var(--color-rose-600);
  --brand-on-danger: oklch(1 0 0);
}

/* Dark mode semantic overrides */
.dark {
  --bg-app: var(--color-slate-900);
  --bg-surface: var(--color-slate-800);
  --border-subtle: oklch(0.3 0.02 240);

  --text-main: oklch(0.98 0 0);
  --text-muted: oklch(0.7 0.01 240);

  --brand-primary: var(--color-indigo-500);
  --brand-primary-hover: var(--color-indigo-600);

  --brand-danger: var(--color-rose-500);
}

/* -------------------------------------------------------------------------- */
/* TIER 2: TAILWIND V4 THEME BINDINGS                                         */
/* -------------------------------------------------------------------------- */
@theme {
  /* Colors */
  --color-app: var(--bg-app);
  --color-surface: var(--bg-surface);
  --color-subtle: var(--border-subtle);

  --color-foreground: var(--text-main);
  --color-muted: var(--text-muted);

  --color-primary: var(--brand-primary);
  --color-primary-hover: var(--brand-primary-hover);
  --color-primary-foreground: var(--brand-on-primary);

  --color-danger: var(--brand-danger);
  --color-danger-foreground: var(--brand-on-danger);

  /* Shared Radii & Fluid Spacing */
  --radius-component-sm: 0.375rem;
  --radius-component-md: 0.5rem;
  --radius-component-lg: 0.75rem;
}

```

---

### Tier 3: Component-Level CVA (`Button.tsx`)

Components consume semantic utilities created by `@theme` (`bg-primary`, `text-foreground`, `rounded-component-md`) rather than raw utilities like `bg-indigo-600` or `text-slate-900`.

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  /* 1. Base styles: geometry, alignment, focus states, transitions */
  "inline-flex items-center justify-center font-medium select-none transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 " +
  "disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      intent: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm",
        danger: "bg-danger text-danger-foreground hover:opacity-90 shadow-sm",
        neutral: "bg-surface text-foreground border border-subtle hover:bg-app",
        ghost: "text-foreground hover:bg-app",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-component-sm gap-1.5",
        md: "h-10 px-4 text-sm rounded-component-md gap-2",
        lg: "h-12 px-6 text-base rounded-component-lg gap-2.5",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, size, fullWidth, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ intent, size, fullWidth }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

```

---

### Division of Responsibility Matrix

| Concern                                           | Where It Belongs                  | Example                                       | Why                                                                                  |
| ------------------------------------------------- | --------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------ |
| **Color Schemes & Palettes**                      | Tailwind `@theme` (CSS variables) | `--color-primary: var(--brand-600);`          | Allows global re-theming and instant dark mode without JS re-renders.                |
| **Global Scales (Radii, Fonts, Shadows)**         | Tailwind `@theme`                 | `--radius-component-md: 0.5rem;`              | Maintains consistent design rhythm across the entire product.                        |
| **Variant Permutations (`intent`, `appearance`)** | CVA Definitions                   | `intent: { primary: "bg-primary" }`           | Defines the component's public TypeScript API and usage contracts.                   |
| **Multi-Property Intersections**                  | CVA `compoundVariants`            | `{ intent: "danger", appearance: "outline" }` | Handles conditional styling logic declaratively.                                     |
| **Ad-Hoc Layout Context Overrides**               | `className` via `cn()`            | `<Button className="mt-4 w-full"/>`           | Page-level spacing and layout placement belong to the consumer, not the token layer. |

---

### Core Principles for Scalability

* **Never Hardcode Theme-Specific Colors in CVA:** Avoid utility classes like `dark:bg-slate-900` or `bg-indigo-600` inside your variant files. Instead, bind them to semantic tokens like `bg-surface` or `bg-primary`.
* **Centralize Typography Hierarchies:** Set font sizing, line heights, and letter-spacings in `@theme` so text scales proportionally across headings, cards, and buttons.
* **Preserve the `cn()` Passthrough:** Always merge CVA variants with the incoming `className` prop using `twMerge(clsx(...))` so consumer layout adjustments override component defaults without specificity bugs.
