Animating dynamic-height elements (like accordions) from `height: 0` to `height: auto` has historically required JavaScript measurements or hacky `max-height` values.

With modern CSS, the cleanest way is **interpolating CSS Grid rows from `0fr` to `1fr**`, or using native **`--radix-accordion-content-height` CSS variables**.

---

### Method 1: The Modern CSS Grid Trick (Zero Hardcoded Heights)

CSS Grid can smoothly animate `grid-template-rows` between `0fr` (collapsed) and `1fr` (expanded).

#### 1. Configure Grid Animation in `@theme` (`globals.css`)

```css
@import "tailwindcss";

@theme {
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);

  --animate-accordion-down: accordion-down 250ms var(--ease-spring) forwards;
  --animate-accordion-up: accordion-up 200ms var(--ease-spring) forwards;
}

@keyframes accordion-down {
  from {
    grid-template-rows: 0fr;
    opacity: 0;
  }
  to {
    grid-template-rows: 1fr;
    opacity: 1;
  }
}

@keyframes accordion-up {
  from {
    grid-template-rows: 1fr;
    opacity: 1;
  }
  to {
    grid-template-rows: 0fr;
    opacity: 0;
  }
}

```

#### 2. Build the Accordion Component (`Accordion.tsx`)

```bash
npm install @radix-ui/react-accordion

```

```tsx
import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { cn } from "@/lib/utils";

export const Accordion = AccordionPrimitive.Root;
export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b border-slate-200 dark:border-slate-800", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-semibold transition-all hover:underline text-slate-900 dark:text-slate-100",
        "[&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      {/* Rotating Chevron Icon */}
      <svg
        className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="2"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      /* 1. The wrapper handles the grid animation */
      "grid overflow-hidden text-sm text-slate-600 dark:text-slate-400",
      "data-[state=open]:animate-accordion-down",
      "data-[state=closed]:animate-accordion-up"
    )}
    {...props}
  >
    {/* 2. Inner container with min-h-0 is REQUIRED so grid row can collapse to 0 */}
    <div className={cn("min-h-0 pb-4 pt-0", className)}>
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

```

---

### Method 2: Native Radix CSS Variables

Radix UI automatically measures the DOM content and injects custom properties `--radix-accordion-content-height` and `--radix-accordion-content-width` directly on the element.

#### In `globals.css`

```css
@keyframes radix-accordion-down {
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
}

@keyframes radix-accordion-up {
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
}

@utility animate-radix-accordion-down {
  animation: radix-accordion-down 200ms ease-out forwards;
}

@utility animate-radix-accordion-up {
  animation: radix-accordion-up 200ms ease-out forwards;
}

```

---

### Usage in an FAQ Section

```tsx
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/Accordion";

export function FAQSection() {
  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
        Frequently Asked Questions
      </h2>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>What is Tailwind CSS v4?</AccordionTrigger>
          <AccordionContent>
            Tailwind CSS v4 is a high-performance, CSS-first rebuild of the framework featuring native theme configuration, instant compilation, and zero-JS configuration overhead.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger>How does Grid animation work?</AccordionTrigger>
          <AccordionContent>
            CSS Grid animates from 0fr to 1fr, allowing the browser to interpolate smoothly between zero height and dynamic child content without guessing max-height.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

```

---

### Key Technical Details

* **`min-h-0` is Essential:** CSS Grid items have `min-height: auto` by default. Without `min-h-0` on the direct child wrapper inside the grid, the row will refuse to shrink down to `0fr`.
* **`overflow-hidden`:** Ensures that text content does not spill over during the height transition.
* **Chevron Rotation:** Target child SVG rotation using `[&[data-state=open]>svg]:rotate-180` to keep the trigger icon in sync with the disclosure state.
