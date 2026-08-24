Radix UI primitives expose native data attributes—such as `data-[state=checked]`, `data-[state=open]`, and `data-disabled`—that pair directly with Tailwind's modifier syntax and CVA variant definitions to create fully accessible, unstyled components with zero styling overhead.

---

### Integrating Radix Switch with CVA and Tailwind

The following example builds an accessible **Switch** component using `@radix-ui/react-switch`, `class-variance-authority`, and the `cn()` utility.

#### Step 1: Install Radix Primitives

```bash
npm install @radix-ui/react-switch

```

#### Step 2: Build the Component (`src/components/Switch.tsx`)

```tsx
import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const switchRootVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-indigo-600 data-[state=unchecked]:bg-slate-200 dark:data-[state=unchecked]:bg-slate-800",
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>,
    VariantProps<typeof switchRootVariants> {}

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  SwitchProps
>(({ className, size, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    className={cn(switchRootVariants({ size }), className)}
    {...props}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform data-[state=unchecked]:translate-x-0",
        size === "sm" && "h-4 w-4 data-[state=checked]:translate-x-4",
        size === "md" && "h-5 w-5 data-[state=checked]:translate-x-5",
        size === "lg" && "h-6 w-6 data-[state=checked]:translate-x-7"
      )}
    />
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

```

---

### Step 3: Using the Accessible Switch

Because it wraps Radix primitives, the component automatically handles screen reader attributes (`aria-checked`), keyboard activation (`Space` / `Enter`), and form submission behavior:

```tsx
import { Switch } from "@/components/Switch";

export function SettingsForm() {
  return (
    <div className="flex items-center space-x-3">
      <Switch id="airplane-mode" size="md" />
      <label htmlFor="airplane-mode" className="text-sm font-medium text-slate-700 dark:text-slate-300">
        Airplane Mode
      </label>
    </div>
  );
}

```

---

### Key Integration Patterns for Radix + Tailwind

* **Targeting Radix States:** Use Tailwind attribute selectors like `data-[state=open]:animate-in`, `data-[state=closed]:animate-out`, or `data-[disabled]:opacity-50` to handle dynamic UI transitions for dropdowns, dialogs, and accordions.
* **Ref Forwarding:** Always use `React.forwardRef` and spread `...props` to ensure DOM node references and event handlers pass cleanly through Radix primitives.
* **Slot Composition:** Use Radix's `AsChild` prop combined with `cn()` when you need your accessible wrapper to merge its functionality directly onto custom child elements (like links or buttons).
