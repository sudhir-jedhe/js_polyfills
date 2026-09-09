***  Configure compound variants and complex conditionals in CVA.md ***

In **`class-variance-authority` (CVA)**, complex component styling goes beyond basic 1:1 prop mappings. You often need to manage **multi-axis variant intersections**, **array-based multi-matches**, **boolean flags**, and **polymorphic component states**.

Here is how to configure compound variants and complex conditional logic cleanly in CVA with TypeScript and Tailwind CSS.

---

### 1. Multi-Axis State Intersections

When two or more variant props depend on each other (e.g., `intent` $\times$ `appearance` $\times$ `size`), do not write nested conditionals in JSX. Define the intersections declaratively inside `compoundVariants`.

```typescript
import { cva, type VariantProps } from "class-variance-authority";

export const badgeVariants = cva(
  /* Base styles applied to all badges */
  "inline-flex items-center font-medium transition-all select-none",
  {
    variants: {
      intent: {
        primary: "text-indigo-600 dark:text-indigo-400",
        success: "text-emerald-600 dark:text-emerald-400",
        warning: "text-amber-600 dark:text-amber-400",
        danger: "text-rose-600 dark:text-rose-400",
      },
      appearance: {
        solid: "text-white",
        outline: "border bg-transparent",
        soft: "border-transparent",
      },
      size: {
        sm: "text-xs px-2 py-0.5 rounded-md gap-1",
        md: "text-sm px-2.5 py-1 rounded-lg gap-1.5",
        lg: "text-base px-3 py-1.5 rounded-xl gap-2",
      },
    },

    compoundVariants: [
      /* --- Solid Appearances (Override text color to white & apply bg) --- */
      {
        intent: "primary",
        appearance: "solid",
        className: "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500",
      },
      {
        intent: "success",
        appearance: "solid",
        className: "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500",
      },
      {
        intent: "danger",
        appearance: "solid",
        className: "bg-rose-600 hover:bg-rose-700 dark:bg-rose-500",
      },

      /* --- Outline Appearances (Apply border colors matching intent) --- */
      {
        intent: "primary",
        appearance: "outline",
        className: "border-indigo-500/40 hover:bg-indigo-50 dark:hover:bg-indigo-950/40",
      },
      {
        intent: "success",
        appearance: "outline",
        className: "border-emerald-500/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/40",
      },

      /* --- Soft/Subtle Appearances (Translucent backgrounds) --- */
      {
        intent: "primary",
        appearance: "soft",
        className: "bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100",
      },
      {
        intent: "success",
        appearance: "soft",
        className: "bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100",
      },
      {
        intent: "danger",
        appearance: "soft",
        className: "bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100",
      },
    ],

    defaultVariants: {
      intent: "primary",
      appearance: "solid",
      size: "md",
    },
  }
);

```

---

### 2. Array Matching (OR Conditionals)

Instead of writing repetitive compound variant objects, pass an **array of strings** to any variant key to apply classes when *any* of the values match.

```typescript
export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-indigo-600 text-white",
        secondary: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white",
        outline: "border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-200",
        ghost: "text-slate-700 dark:text-slate-200",
      },
      size: {
        xs: "h-7 px-2 text-xs",
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
      isIconOnly: {
        true: "aspect-square p-0",
      },
    },

    compoundVariants: [
      /* Matches if variant is EITHER "outline" OR "ghost" AND size is "xs" */
      {
        variant: ["outline", "ghost"],
        size: "xs",
        className: "border-transparent shadow-none",
      },

      /* Square proportions for all icon-only button sizes */
      {
        isIconOnly: true,
        size: ["xs", "sm"],
        className: "rounded-md",
      },
      {
        isIconOnly: true,
        size: ["md", "lg"],
        className: "rounded-xl",
      },
    ],

    defaultVariants: {
      variant: "primary",
      size: "md",
      isIconOnly: false,
    },
  }
);

```

---

### 3. Boolean Flags and Interactive States

Boolean props in CVA must be mapped using the strings `"true"` and `"false"`. Pair them with compound variants for loading spinners, disabled overlays, and full-width wrappers.

```typescript
export const inputVariants = cva(
  "w-full rounded-lg border bg-white dark:bg-slate-900 transition-all outline-none text-sm placeholder:text-slate-400",
  {
    variants: {
      hasError: {
        true: "border-rose-500 text-rose-900 dark:text-rose-200 focus:ring-2 focus:ring-rose-500/20",
        false: "border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
      },
      disabled: {
        true: "cursor-not-allowed opacity-50 bg-slate-100 dark:bg-slate-800",
      },
      isLoading: {
        true: "pointer-events-none opacity-80",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-3.5 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },

    compoundVariants: [
      /* Special styling when input has BOTH an error AND is currently loading */
      {
        hasError: true,
        isLoading: true,
        className: "border-dashed animate-pulse",
      },
      /* Error state styling for large inputs */
      {
        hasError: true,
        size: "lg",
        className: "border-2 shadow-sm shadow-rose-500/10",
      },
    ],

    defaultVariants: {
      hasError: false,
      disabled: false,
      isLoading: false,
      size: "md",
    },
  }
);

```

---

### 4. Compound Components with Sub-Element Variants

When styling compound components (such as an Alert containing an icon, title, and container), define complementary variant generators to keep states in sync:

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// 1. Container Variants
const alertContainer = cva(
  "relative w-full rounded-2xl border p-4 transition-all flex gap-3.5 items-start",
  {
    variants: {
      status: {
        info: "border-sky-200 bg-sky-50/70 text-sky-950 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-100",
        success: "border-emerald-200 bg-emerald-50/70 text-emerald-950 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-100",
        danger: "border-rose-200 bg-rose-50/70 text-rose-950 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-100",
      },
      elevation: {
        flat: "shadow-none",
        raised: "shadow-md ring-1 ring-black/5 dark:ring-white/10",
      },
    },
    compoundVariants: [
      {
        status: "danger",
        elevation: "raised",
        className: "ring-rose-500/20 shadow-rose-500/10",
      },
    ],
    defaultVariants: {
      status: "info",
      elevation: "flat",
    },
  }
);

// 2. Icon Variants
const alertIcon = cva("shrink-0 rounded-lg p-1.5", {
  variants: {
    status: {
      info: "bg-sky-100 text-sky-600 dark:bg-sky-900/60 dark:text-sky-400",
      success: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/60 dark:text-emerald-400",
      danger: "bg-rose-100 text-rose-600 dark:bg-rose-900/60 dark:text-rose-400",
    },
  },
  defaultVariants: {
    status: "info",
  },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertContainer> {
  title: string;
}

export function Alert({
  status,
  elevation,
  title,
  className,
  children,
  ...props
}: AlertProps) {
  return (
    <div
      className={cn(alertContainer({ status, elevation }), className)}
      {...props}
    >
      <div className={alertIcon({ status })}>
        <span className="block h-4 w-4 rounded-full bg-current opacity-80" />
      </div>
      <div className="flex-1 space-y-1">
        <h5 className="font-semibold text-sm leading-tight">{title}</h5>
        <div className="text-xs opacity-90 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

```

---

### Best Practices

* **Narrow Base Classes:** Keep base strings dedicated to layout geometry (`flex`, `items-center`, `rounded`) and transitions. Defer color palettes and borders to `variants` and `compoundVariants`.
* **Use `cn()` at the Boundary:** Always wrap your CVA executions in a `cn()` helper (`twMerge(clsx(...))`) to guarantee consumer `className` props override compound variant classes without specificity issues.
* **Leverage Array Conditions:** Group matching variants using arrays (`variant: ["ghost", "subtle"]`) rather than duplicating rules.
