Radix UI components expose dynamic data attributes like `data-[state=open]` and `data-[state=closed]`, which you can target directly in Tailwind CSS to create smooth entry and exit animations.

---

### Step 1: Install Radix UI Primitives

```bash
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu

```

---

### Step 2: Styled Radix Dialog Component

A modal dialog needs two animated elements: the backdrop overlay (fade in/out) and the content container (zoom/fade/slide).

```tsx
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

// 1. Animated Backdrop Overlay
export const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm",
      /* Transition and state animations */
      "transition-opacity duration-200",
      "data-[state=open]:opacity-100 data-[state=closed]:opacity-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

// 2. Animated Modal Content
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
        /* Smooth transform & opacity transitions */
        "transition-all duration-200 ease-out",
        "data-[state=open]:opacity-100 data-[state=open]:scale-100",
        "data-[state=closed]:opacity-0 data-[state=closed]:scale-95",
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

### Step 3: Styled Radix Dropdown Menu Component

For floating popovers and dropdown menus, Radix also exposes `data-[side=...]` (top, bottom, left, right), allowing directional slide-in animations.

```tsx
import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";

export const DropdownMenu = DropdownMenuPrimitive.Root;
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

export const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-[12rem] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1.5 shadow-lg",
        /* Entry/Exit state transitions */
        "transition-all duration-150 ease-out",
        "data-[state=open]:opacity-100 data-[state=open]:scale-100",
        "data-[state=closed]:opacity-0 data-[state=closed]:scale-95",
        /* Directional slide based on position */
        "data-[side=bottom]:data-[state=open]:translate-y-0 data-[side=bottom]:data-[state=closed]:-translate-y-2",
        "data-[side=top]:data-[state=open]:translate-y-0 data-[side=top]:data-[state=closed]:translate-y-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

export const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-pointer select-none items-center rounded-lg px-3 py-2 text-sm outline-none transition-colors",
      "text-slate-700 dark:text-slate-200",
      /* Focus and active highlight states */
      "data-[highlighted]:bg-slate-100 dark:data-[highlighted]:bg-slate-800 data-[highlighted]:text-slate-900 dark:data-[highlighted]:text-white",
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

```

---

### Step 4: Putting Them to Use

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
} from "@/components/Dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/DropdownMenu";

export function UIExample() {
  return (
    <div className="flex items-center gap-4 p-8">
      {/* 1. Animated Modal */}
      <Dialog>
        <DialogTrigger className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium">
          Open Modal
        </DialogTrigger>
        <DialogContent>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Profile</h3>
          <p className="text-sm text-slate-500 mt-1">Make changes to your account details here.</p>
          <div className="mt-6 flex justify-end gap-2">
            <DialogClose className="px-3 py-1.5 text-sm rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800">
              Close
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>

      {/* 2. Animated Popover Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium">
          Options Menu
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Profile Settings</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem className="text-red-600 dark:text-red-400">Log Out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

```

---

### Radix Data Attributes Reference

| Target Attribute      | Utility Example                    | When It Fires                                         |
| --------------------- | ---------------------------------- | ----------------------------------------------------- |
| `data-[state=open]`   | `data-[state=open]:opacity-100`    | Menu/Dialog enters the DOM and becomes visible        |
| `data-[state=closed]` | `data-[state=closed]:opacity-0`    | Menu/Dialog begins exit transition before unmounting  |
| `data-[side=bottom]`  | `data-[side=bottom]:translate-y-0` | Popover positioned below the trigger                  |
| `data-[side=top]`     | `data-[side=top]:-translate-y-1`   | Popover positioned above the trigger                  |
| `data-[highlighted]`  | `data-[highlighted]:bg-slate-100`  | Item navigated via keyboard arrow keys or mouse hover |
| `data-[disabled]`     | `data-[disabled]:opacity-50`       | Interactive item is disabled                          |
