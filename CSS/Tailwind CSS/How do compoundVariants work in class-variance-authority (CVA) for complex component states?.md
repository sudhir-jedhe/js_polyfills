In **`class-variance-authority` (CVA)**, `compoundVariants` let you apply specific classes only when a **particular combination of multiple variant props** is matched simultaneously.

Without `compoundVariants`, individual variant declarations can conflict or require redundant modifier classes when handling interdependent states (e.g., when a button is both `intent: "danger"` and `appearance: "outline"`).

---

### The Core Problem

Consider a button with two independent variant axes:

1. `intent`: `"primary"` | `"secondary"` | `"danger"`
2. `appearance`: `"solid"` | `"outline"` | `"ghost"`

If you define text and background colors inside individual variants, an `outline` button still gets background classes from `primary` or `danger`. `compoundVariants` resolve these intersections cleanly:

---

### Step 1: Defining `compoundVariants` in CVA

```typescript
import { cva, type VariantProps } from "class-variance-authority";

export const buttonVariants = cva(
  /* Base styles for all buttons */
  "inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 select-none",
  {
    variants: {
      intent: {
        primary: "focus:ring-indigo-500",
        secondary: "focus:ring-slate-400",
        danger: "focus:ring-red-500",
      },
      appearance: {
        solid: "text-white shadow-sm",
        outline: "border bg-transparent",
        ghost: "bg-transparent",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-10 px-4 text-sm rounded-lg",
        lg: "h-12 px-6 text-base rounded-xl",
      },
    },

    /* Apply styles ONLY when specific variant combinations occur */
    compoundVariants: [
      /* 1. Primary Combinations */
      {
        intent: "primary",
        appearance: "solid",
        className: "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800",
      },
      {
        intent: "primary",
        appearance: "outline",
        className: "border-indigo-600 text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50",
      },
      {
        intent: "primary",
        appearance: "ghost",
        className: "text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50",
      },

      /* 2. Danger Combinations */
      {
        intent: "danger",
        appearance: "solid",
        className: "bg-red-600 hover:bg-red-700 active:bg-red-800",
      },
      {
        intent: "danger",
        appearance: "outline",
        className: "border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50",
      },
      {
        intent: "danger",
        appearance: "ghost",
        className: "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50",
      },

      /* 3. Multi-match with arrays: targets multiple appearances in one rule */
      {
        intent: "secondary",
        appearance: ["outline", "ghost"],
        className: "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
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

### Step 2: Array Matching for Compact Rules

You can supply an array of values to a variant key inside a compound rule to match any item in the list:

```typescript
compoundVariants: [
  {
    // Applies when size is 'sm' AND appearance is EITHER 'outline' or 'ghost'
    size: "sm",
    appearance: ["outline", "ghost"],
    className: "border-px shadow-none",
  },
]

```

---

### Step 3: Compound Slots in Complex Multi-Element Components

For compound components with multiple sub-parts (like an Alert with an icon, title, and container), you can combine CVA variant definitions:

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertBox = cva("p-4 rounded-xl border flex gap-3 transition-colors", {
  variants: {
    status: {
      info: "border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900 dark:bg-sky-950/40 dark:text-sky-200",
      warning: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200",
      error: "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200",
    },
    prominent: {
      true: "shadow-md ring-1",
      false: "",
    },
  },
  compoundVariants: [
    {
      status: "error",
      prominent: true,
      className: "ring-red-400/50 bg-red-100 dark:bg-red-950/80",
    },
  ],
  defaultVariants: {
    status: "info",
    prominent: false,
  },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertBox> {}

export function Alert({ status, prominent, className, children, ...props }: AlertProps) {
  return (
    <div className={cn(alertBox({ status, prominent }), className)} {...props}>
      {children}
    </div>
  );
}

```

---

### Key Advantages of `compoundVariants`

* **Prevents Class Collisions:** Keeps base variants focused on geometry or broad properties, delegating situational intersections to dedicated rules.
* **Declarative Multi-Axis State:** Handles scenarios like `variant="danger"` + `variant="ghost"` cleanly without messy nested ternary operators in JSX.
* **Full TypeScript Checking:** Every variant key inside `compoundVariants` is strictly validated against the types declared in `variants`.
