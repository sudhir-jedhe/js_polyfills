***  Explore dynamic color themes with CSS variables and CVA.md ***

Dynamic color themes work best when you decouple **color values** (managed at runtime via CSS custom properties) from **component structure and variants** (managed via `class-variance-authority`).

By mapping semantic CSS variables into Tailwind CSS v4's `@theme` layer, your CVA components can reference abstract semantic utilities (`bg-primary`, `text-surface-foreground`, `border-border`) rather than hardcoded palette names (`bg-blue-600`, `dark:bg-slate-900`).

---

### Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│ 1. Runtime State / Attributes                          │
│    <html data-theme="violet" class="dark">             │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 2. CSS Variable Engine (globals.css)                  │
│    :root[data-theme="violet"] { --primary: ... }       │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 3. Tailwind v4 Semantic Bridge (@theme)                │
│    --color-primary: var(--primary);                    │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│ 4. Component Layer (CVA + cn)                          │
│    variant: { primary: "bg-primary text-primary-fg" } │
└────────────────────────────────────────────────────────┘

```

---

### Step 1: Define Multi-Theme Semantic Variables

In your main CSS file (`globals.css`), define semantic color variables across different theme presets and color modes (Light/Dark). Using the modern `oklch()` color space guarantees consistent perceptual lightness and chroma across all color palettes.

```css
@import "tailwindcss";

/* 1. Register semantic tokens in Tailwind v4 */
@theme {
  --color-surface: var(--surface);
  --color-surface-foreground: var(--surface-foreground);

  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-hover: var(--primary-hover);

  --color-border: var(--border);
  --color-ring: var(--ring);
}

/* 2. Base Light Mode Tokens */
:root {
  --surface: oklch(0.99 0 0);
  --surface-foreground: oklch(0.15 0.02 240);
  --muted: oklch(0.95 0.01 240);
  --muted-foreground: oklch(0.48 0.02 240);
  --border: oklch(0.91 0.01 240);

  /* Default Theme: Indigo */
  --primary: oklch(0.55 0.22 260);
  --primary-foreground: oklch(0.99 0 0);
  --primary-hover: oklch(0.48 0.22 260);
  --ring: oklch(0.55 0.22 260 / 0.35);
}

/* 3. Base Dark Mode Tokens */
.dark {
  --surface: oklch(0.16 0.02 240);
  --surface-foreground: oklch(0.98 0 0);
  --muted: oklch(0.24 0.02 240);
  --muted-foreground: oklch(0.68 0.01 240);
  --border: oklch(0.28 0.02 240);

  /* Default Dark Primary */
  --primary: oklch(0.65 0.2 260);
  --primary-foreground: oklch(0.1 0.02 240);
  --primary-hover: oklch(0.72 0.18 260);
  --ring: oklch(0.65 0.2 260 / 0.4);
}

/* 4. Dynamic Theme Palettes (Data Attributes) */
[data-theme="emerald"] {
  --primary: oklch(0.58 0.19 155);
  --primary-foreground: oklch(0.99 0 0);
  --primary-hover: oklch(0.5 0.19 155);
  --ring: oklch(0.58 0.19 155 / 0.35);
}
.dark[data-theme="emerald"],
[data-theme="emerald"] .dark {
  --primary: oklch(0.68 0.17 155);
  --primary-foreground: oklch(0.1 0.02 155);
  --primary-hover: oklch(0.74 0.15 155);
}

[data-theme="amber"] {
  --primary: oklch(0.68 0.18 65);
  --primary-foreground: oklch(0.12 0.03 65);
  --primary-hover: oklch(0.6 0.18 65);
  --ring: oklch(0.68 0.18 65 / 0.35);
}
.dark[data-theme="amber"],
[data-theme="amber"] .dark {
  --primary: oklch(0.76 0.16 65);
  --primary-foreground: oklch(0.12 0.03 65);
  --primary-hover: oklch(0.82 0.14 65);
}

[data-theme="rose"] {
  --primary: oklch(0.6 0.22 15);
  --primary-foreground: oklch(0.99 0 0);
  --primary-hover: oklch(0.52 0.22 15);
  --ring: oklch(0.6 0.22 15 / 0.35);
}
.dark[data-theme="rose"],
[data-theme="rose"] .dark {
  --primary: oklch(0.7 0.2 15);
  --primary-foreground: oklch(0.1 0.02 15);
  --primary-hover: oklch(0.76 0.18 15);
}

```

---

### Step 2: Build Theme-Agnostic Components with CVA

Because colors are decoupled from the components, CVA focuses strictly on structural anatomy, variant intent, and interaction states:

```tsx
// src/components/Button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm active:scale-[0.98]",
        secondary: "bg-muted text-surface-foreground hover:opacity-85 active:scale-[0.98]",
        outline: "border border-border bg-transparent text-surface-foreground hover:bg-muted",
        ghost: "text-surface-foreground hover:bg-muted",
        subtle: "bg-primary/10 text-primary hover:bg-primary/20",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
        md: "h-10 px-4 text-sm rounded-xl gap-2",
        lg: "h-12 px-6 text-base rounded-2xl gap-2.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

```

```tsx
// src/components/Card.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const cardVariants = cva(
  "rounded-3xl border transition-all text-surface-foreground",
  {
    variants: {
      elevation: {
        flat: "bg-surface border-border",
        raised: "bg-surface border-border shadow-lg shadow-primary/5",
        highlighted: "bg-surface border-primary/40 ring-1 ring-primary/20",
      },
      padding: {
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      elevation: "flat",
      padding: "md",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, elevation, padding, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ elevation, padding }), className)} {...props} />
  );
}

```

---

### Step 3: Scoped Sub-Theming (Multi-Tenant / Sectional Overrides)

A major benefit of using CSS custom properties with CVA is **nested contextual theming**. You can re-theme an isolated section of the page simply by adding `data-theme` to a wrapper:

```tsx
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";

export function ThemedSectionsDemo() {
  return (
    <div className="space-y-8 p-8">
      {/* 1. Global/Default Theme (Indigo) */}
      <Card elevation="raised" className="max-w-md space-y-4">
        <h3 className="text-lg font-bold">Default Brand Section</h3>
        <p className="text-sm text-muted-foreground">
          Inherits the root workspace primary palette.
        </p>
        <div className="flex gap-2">
          <Button variant="primary">Save Changes</Button>
          <Button variant="subtle">Learn More</Button>
        </div>
      </Card>

      {/* 2. Isolated Emerald Context */}
      <div data-theme="emerald">
        <Card elevation="highlighted" className="max-w-md space-y-4">
          <h3 className="text-lg font-bold">Finance Subtree (Emerald)</h3>
          <p className="text-sm text-muted-foreground">
            The exact same Button components now automatically render in emerald.
          </p>
          <div className="flex gap-2">
            <Button variant="primary">Approve Payout</Button>
            <Button variant="outline">Review</Button>
          </div>
        </Card>
      </div>

      {/* 3. Isolated Rose Context */}
      <div data-theme="rose">
        <Card elevation="raised" className="max-w-md space-y-4">
          <h3 className="text-lg font-bold">Critical Zone (Rose)</h3>
          <p className="text-sm text-muted-foreground">
            Scoped without any prop changes or extra CSS classes.
          </p>
          <Button variant="primary">Destroy Resources</Button>
        </Card>
      </div>
    </div>
  );
}

```

---

### Comparison of Theming Strategies

| Strategy                                                                                | Advantages                                                                           | Drawbacks                                                                      |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ |
| **Hardcoded CVA Variants** (`intent: { indigo: "bg-indigo-600", rose: "bg-rose-600" }`) | Explicit in TypeScript                                                               | Bloats JS bundle; requires manual prop drilling down deeply nested components. |
| **Direct Dark Modifiers** (`dark:bg-slate-900 dark:text-white`)                         | Simple for single dark/light toggle                                                  | Breaks when multi-brand or custom user-selected themes are needed.             |
| **CSS Variables + CVA Semantic Tokens** *(Current)*                                     | Infinite theme variations; zero bundle bloat; supports instant sectional sub-theming | Requires upfront CSS token structuring.                                        |
