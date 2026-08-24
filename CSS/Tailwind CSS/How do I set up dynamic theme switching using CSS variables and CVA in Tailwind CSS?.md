Dynamic theme switching (such as Light, Dark, or multi-tenant branded themes) is cleanest when you combine **semantic CSS custom properties** in Tailwind v4 with **`class-variance-authority` (CVA)**.

This separates color definitions (handled at runtime by CSS variables) from component layout and style variants (handled by CVA).

---

### Step 1: Define Semantic CSS Variables & Themes

In your main CSS file (`globals.css`), define design tokens using modern OKLCH or HSL channels on `:root` and theme-specific selectors (`.dark`, `[data-theme="emerald"]`, `[data-theme="rose"]`).

```css
@import "tailwindcss";

@theme {
  /* Register custom semantic color tokens into Tailwind */
  --color-background: var(--background);
  --color-foreground: var(--foreground);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-hover: var(--primary-hover);

  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);

  --color-card: var(--card);
  --color-card-border: var(--card-border);
}

/* 1. Default Light Theme (Root) */
:root {
  --background: oklch(0.98 0 0);
  --foreground: oklch(0.15 0.02 240);

  --primary: oklch(0.55 0.22 260);          /* Indigo */
  --primary-foreground: oklch(0.98 0 0);
  --primary-hover: oklch(0.48 0.22 260);

  --muted: oklch(0.94 0.01 240);
  --muted-foreground: oklch(0.45 0.02 240);

  --card: oklch(1 0 0);
  --card-border: oklch(0.9 0.01 240);
}

/* 2. Dark Mode Override */
.dark {
  --background: oklch(0.14 0.02 240);
  --foreground: oklch(0.96 0.01 240);

  --primary: oklch(0.65 0.2 260);
  --primary-foreground: oklch(0.1 0.02 240);
  --primary-hover: oklch(0.72 0.18 260);

  --muted: oklch(0.22 0.02 240);
  --muted-foreground: oklch(0.7 0.01 240);

  --card: oklch(0.18 0.02 240);
  --card-border: oklch(0.28 0.02 240);
}

/* 3. Multi-Tenant / Custom Brand Theme Overrides */
[data-theme="emerald"] {
  --primary: oklch(0.6 0.18 150);
  --primary-foreground: oklch(0.98 0 0);
  --primary-hover: oklch(0.52 0.18 150);
}

[data-theme="rose"] {
  --primary: oklch(0.62 0.22 15);
  --primary-foreground: oklch(0.98 0 0);
  --primary-hover: oklch(0.54 0.22 15);
}

```

---

### Step 2: Build Reusable Components with CVA

Because colors are tied to semantic tokens (`bg-primary`, `bg-card`, `text-foreground`), CVA variants never need hardcoded colors like `bg-indigo-600` or `dark:bg-slate-900`.

```tsx
// src/components/Button.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm",
        secondary: "bg-muted text-foreground hover:opacity-80",
        outline: "border border-card-border bg-transparent text-foreground hover:bg-muted",
        ghost: "text-foreground hover:bg-muted",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-lg",
        md: "h-10 px-4 text-sm rounded-xl",
        lg: "h-12 px-6 text-base rounded-2xl",
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

---

### Step 3: Theme Context & Dynamic Switcher

Create a React theme provider to switch between themes by toggling the class or `data-theme` attribute on `document.documentElement`:

```tsx
// src/context/ThemeContext.tsx
import * as React from "react";

type ThemeMode = "light" | "dark";
type BrandTheme = "default" | "emerald" | "rose";

interface ThemeContextType {
  mode: ThemeMode;
  brand: BrandTheme;
  setMode: (mode: ThemeMode) => void;
  setBrand: (brand: BrandTheme) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = React.useState<ThemeMode>("light");
  const [brand, setBrand] = React.useState<BrandTheme>("default");

  React.useEffect(() => {
    const root = document.documentElement;

    // Handle Dark/Light mode class
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    // Handle Brand Accent Theme attribute
    if (brand === "default") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", brand);
    }
  }, [mode, brand]);

  return (
    <ThemeContext.Provider value={{ mode, brand, setMode, setBrand }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

```

---

### Step 4: Themed UI in Action

```tsx
import { useTheme } from "@/context/ThemeContext";
import { Button } from "@/components/Button";

export function Dashboard() {
  const { mode, brand, setMode, setBrand } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground p-8 transition-colors duration-300">
      <div className="max-w-md mx-auto p-6 bg-card border border-card-border rounded-3xl shadow-lg space-y-6">
        <div>
          <h2 className="text-xl font-bold">Dynamic Theme Engine</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Zero re-renders on components. Styles shift instantly via CSS variables.
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              variant={mode === "light" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setMode("light")}
            >
              Light
            </Button>
            <Button
              variant={mode === "dark" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setMode("dark")}
            >
              Dark
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant={brand === "default" ? "primary" : "outline"}
              size="sm"
              onClick={() => setBrand("default")}
            >
              Indigo
            </Button>
            <Button
              variant={brand === "emerald" ? "primary" : "outline"}
              size="sm"
              onClick={() => setBrand("emerald")}
            >
              Emerald
            </Button>
            <Button
              variant={brand === "rose" ? "primary" : "outline"}
              size="sm"
              onClick={() => setBrand("rose")}
            >
              Rose
            </Button>
          </div>
        </div>

        {/* Component Showcase */}
        <div className="pt-4 border-t border-card-border flex gap-3">
          <Button variant="primary">Primary Action</Button>
          <Button variant="outline">Cancel</Button>
        </div>
      </div>
    </div>
  );
}

```

---

### Key Architectural Advantages

* **No CSS Duplication:** CVA generates utility classes once (`bg-primary`). It does not need to duplicate class combinations for every theme variation (`dark:bg-...`, `theme-emerald:bg-...`).
* **Zero Layout Shift:** Theme transitions occur strictly on the compositor and CSS paint layers.
* **Granular Sub-Theming:** Setting `data-theme="rose"` on a specific parent `<div>` re-themes that isolated subtree without altering the rest of the application.
