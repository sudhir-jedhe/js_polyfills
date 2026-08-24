Combining `clsx`, `tailwind-merge`, and `class-variance-authority` (CVA) is the standard pattern for building accessible, type-safe, and override-friendly component variants in Tailwind CSS (popularized by libraries like shadcn/ui).

Here is how each tool works in the stack:

* **`clsx`**: Handles conditional logic (`isActive && "bg-blue-500"`).
* **`tailwind-merge` (`twMerge`)**: Resolves Tailwind class conflicts intelligently (e.g., ensuring `p-4` properly overrides `p-2` instead of causing CSS cascade collisions).
* **`cva`**: Provides a type-safe API to define variants, compound variants, and default states.

---

### Step 1: Install Dependencies

```bash
npm install clsx tailwind-merge class-variance-authority

```

---

### Step 2: Create the `cn` Utility Helper

Create `lib/utils.ts` to combine `clsx` and `twMerge` into a single wrapper function:

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional classes and resolves Tailwind CSS rule conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

---

### Step 3: Define Component Variants with `cva`

Define your base styles, variants (e.g., `variant`, `size`), compound variants (variant combinations that need specific styling), and defaults:

```tsx
// components/ui/Button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  // 1. Base styles applied to all button instances
  "inline-flex items-center justify-center font-medium rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    // 2. Variant dimensions
    variants: {
      variant: {
        primary:
          "bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus-visible:ring-indigo-500",
        secondary:
          "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
        outline:
          "border border-slate-300 bg-transparent hover:bg-slate-50 dark:border-slate-700 dark:text-white dark:hover:bg-slate-900",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-500 focus-visible:ring-red-500",
        ghost:
          "hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-white",
      },
      size: {
        sm: "h-8 px-3 text-xs gap-1.5",
        md: "h-10 px-4 text-sm gap-2",
        lg: "h-12 px-6 text-base gap-2.5",
        icon: "h-10 w-10 p-0",
      },
      fullWidth: {
        true: "w-full",
        false: "w-auto",
      },
    },

    // 3. Compound Variants (Special rules when specific variants are paired)
    compoundVariants: [
      {
        variant: "destructive",
        size: "sm",
        className: "uppercase tracking-wider font-semibold",
      },
    ],

    // 4. Fallback defaults when props are omitted
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

// Extract TypeScript types directly from the CVA variant schema
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

```

---

### Step 4: Component Usage & Conflict Resolution

Because `cn()` merges classes through `tailwind-merge`, consuming code can pass conflicting utilities via `className` and reliably override variant defaults without specificity bugs:

```tsx
// Example Usage
import { Button } from "@/components/ui/Button";

export function ComponentDemo() {
  return (
    <div className="flex flex-wrap gap-4 p-6 items-center">
      {/* 1. Default variant and size (primary, md) */}
      <Button>Default Button</Button>

      {/* 2. Secondary variant with small size */}
      <Button variant="secondary" size="sm">
        Small Secondary
      </Button>

      {/* 3. Destructive with compound styling */}
      <Button variant="destructive" size="sm">
        Delete Record
      </Button>

      {/* 4. Conflict override: `px-10` reliably overrides size="md" (`px-4`) */}
      <Button variant="outline" size="md" className="px-10 bg-amber-500/10">
        Wide Outline Override
      </Button>

      {/* 5. Conditional class toggling inside consumer */}
      <Button
        variant="primary"
        className={cn(
          "shadow-lg",
          false && "opacity-0" // Safely filtered out by clsx
        )}
      >
        Dynamic Button
      </Button>
    </div>
  );
}

```

---

### Why the Stack Matters

| Problem              | Standard Template Strings (``btn ${variant}``)                                                           | With `clsx` + `twMerge` + `cva`                   |
| -------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Class Conflicts**  | `px-4` and consumer's `px-8` both stay in `class=""`; CSS cascade order determines winner unpredictably. | `tailwind-merge` drops `px-4` and applies `px-8`. |
| **Conditionals**     | Messy nested ternary chains or `undefined` / `false` strings output into DOM.                            | `clsx` strips falsy values cleanly.               |
| **TypeScript Types** | Requires manually syncing `type Variant = "primary"                                                      | "secondary"` with CSS strings.                    | `VariantProps<typeof ...>` automatically infers strict types directly from configuration. |
