*** copy How do I integrate the cn() helper with class-variance-authority (CVA) in a TypeScript React project?.md ***

Integrating the `cn()` helper with **`class-variance-authority` (CVA)** gives you a strongly-typed component API where props automatically map to Tailwind classes, while external `className` overrides are resolved cleanly without specificity conflicts.

---

### Step 1: Install Dependencies

```bash
npm install class-variance-authority clsx tailwind-merge

```

---

### Step 2: Set Up the `cn()` Utility

Create `src/lib/utils.ts`:

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

```

---

### Step 3: Build a Typed Component with CVA + `cn()`

Create `src/components/Button.tsx`:

```tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// 1. Define base styles, variants, compound variants, and defaults
export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100",
        outline: "border border-slate-300 bg-transparent hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
        ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md gap-1.5",
        md: "h-10 px-4 text-sm rounded-lg gap-2",
        lg: "h-12 px-6 text-base rounded-xl gap-2.5",
        icon: "h-10 w-10 p-0 rounded-lg",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

// 2. Extract type props directly from the CVA definition
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

// 3. Combine CVA output with the incoming `className` via `cn()`
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

```

---

### Step 4: Using the Component in Practice

TypeScript provides full autocompletion and type-checking for `variant`, `size`, and `fullWidth`, while `cn()` ensures that any manual `className` passed down takes priority.

```tsx
import { Button } from "@/components/Button";

export function App() {
  return (
    <div className="flex flex-col gap-4 p-8 max-w-sm">
      {/* Defaults (primary, md) */}
      <Button>Default Action</Button>

      {/* Typed variants and sizes */}
      <Button variant="secondary" size="sm">
        Small Secondary
      </Button>

      <Button variant="destructive" size="lg" fullWidth>
        Delete Account
      </Button>

      {/* External class override: p-8 and bg-emerald-600 win via twMerge */}
      <Button
        variant="primary"
        size="md"
        className="bg-emerald-600 hover:bg-emerald-700 px-8"
      >
        Custom Override
      </Button>
    </div>
  );
}

```

---

### Polymorphic "asChild" Pattern (Slot Support)

To let your button render as an anchor `<a>` or Next.js `<Link>` without duplicating styles, combine CVA with Radix UI's `Slot`:

```bash
npm install @radix-ui/react-slot

```

```tsx
import { Slot } from "@radix-ui/react-slot";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, fullWidth }), className)}
        {...props}
      />
    );
  }
);

```

**Usage as a Next.js / React Router link:**

```tsx
import Link from "next/link";

<Button asChild variant="outline">
  <Link href="/dashboard">Go to Dashboard</Link>
</Button>

```
