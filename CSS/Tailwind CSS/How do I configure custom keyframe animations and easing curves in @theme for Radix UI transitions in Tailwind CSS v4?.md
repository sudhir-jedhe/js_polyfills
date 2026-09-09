***  How do I configure custom keyframe animations and easing curves in @theme for Radix UI transitions in Tailwind CSS v4?.md ***

In Tailwind CSS v4, custom keyframe animations and easing curves are declared directly in your CSS using standard `@keyframes` combined with the `--animate-*` and `--ease-*` namespaces in the `@theme` block.

---

### Step 1: Define Keyframes, Animations, and Easings in `@theme`

In your main CSS file (`globals.css` / `index.css`), configure smooth cubic-bezier timing functions, keyframe stages, and animated tokens:

```css
@import "tailwindcss";

@theme {
  /* 1. Custom Spring / Cubic-Bezier Easings */
  --ease-out-smooth: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-smooth: cubic-bezier(0.7, 0, 0.84, 0);

  /* 2. Registered Animation Tokens */
  --animate-dialog-overlay-in: dialog-overlay-in 200ms var(--ease-out-smooth) forwards;
  --animate-dialog-overlay-out: dialog-overlay-out 150ms var(--ease-in-smooth) forwards;

  --animate-dialog-content-in: dialog-content-in 250ms var(--ease-out-smooth) forwards;
  --animate-dialog-content-out: dialog-content-out 150ms var(--ease-in-smooth) forwards;

  --animate-dropdown-in: dropdown-in 180ms var(--ease-out-smooth) forwards;
  --animate-dropdown-out: dropdown-out 120ms var(--ease-in-smooth) forwards;
}

/* 3. Define Standard CSS Keyframes */
@keyframes dialog-overlay-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes dialog-overlay-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes dialog-content-in {
  from {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes dialog-content-out {
  from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -48%) scale(0.96);
  }
}

@keyframes dropdown-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes dropdown-out {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.95) translateY(-4px);
  }
}

```

---

### Step 2: Apply to Radix Components

Tailwind automatically turns `--animate-*` tokens into `animate-*` utilities. Map them to Radix `data-[state=open]` and `data-[state=closed]` attributes:

#### Animated Dialog Component

```tsx
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

// Backdrop with custom fade animation
export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      "data-[state=open]:animate-dialog-overlay-in",
      "data-[state=closed]:animate-dialog-overlay-out",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// Modal content with custom scale & slide animation
export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2",
        "rounded-2xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800",
        "data-[state=open]:animate-dialog-content-in",
        "data-[state=closed]:animate-dialog-content-out",
        className
      )}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

```

---

### Step 3: Animated Dropdown Menu

```tsx
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-xl",
        "data-[state=open]:animate-dropdown-in",
        "data-[state=closed]:animate-dropdown-out",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

```

---

### Key Advantages of this Approach

* **CSS-First Architecture:** No plugins (like `tailwindcss-animate`) or JavaScript configurations needed.
* **GPU-Accelerated:** Using `transform` and `opacity` inside keyframes avoids layout thrashing and repaints.
* **Precise Exit Transitions:** Radix delays unmounting child elements until `data-[state=closed]` keyframe animations finish playing.
