***  Set up dark mode support.md ***

In Tailwind CSS v4, dark mode is configured using standard CSS variables and the `@custom-variant` directive in your main stylesheet, pairing seamlessly with `next-themes` in Next.js.

---

### Step 1: Install `next-themes`

```bash
npm install next-themes lucide-react

```

---

### Step 2: Configure Semantic Color Tokens in `globals.css`

Set up your semantic color tokens using CSS variables inside `@theme`, and define the `dark` custom variant:

```css
/* app/globals.css */
@import "tailwindcss";

/* 1. Register class-based dark variant */
@custom-variant dark (&:where(.dark, .dark *));

/* 2. Semantic Theme Variable Aliases */
@theme {
  --color-background: var(--bg);
  --color-foreground: var(--fg);
  --color-surface: var(--surface);
  --color-surface-border: var(--surface-border);
  --color-muted: var(--muted);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-fg);
}

/* 3. Light Theme (Default) */
:root {
  --bg: oklch(0.985 0.002 247);
  --fg: oklch(0.145 0.005 247);
  --surface: oklch(1 0 0);
  --surface-border: oklch(0.922 0.005 247);
  --muted: oklch(0.556 0.015 247);
  --primary: oklch(0.585 0.233 277);
  --primary-fg: oklch(0.985 0 0);
}

/* 4. Dark Theme Overrides */
.dark {
  --bg: oklch(0.13 0.015 247);
  --fg: oklch(0.985 0.002 247);
  --surface: oklch(0.17 0.02 247);
  --surface-border: oklch(0.26 0.025 247);
  --muted: oklch(0.65 0.015 247);
  --primary: oklch(0.68 0.21 277);
  --primary-fg: oklch(0.985 0 0);
}

```

---

### Step 3: Create the Theme Provider

Wrap your app with `ThemeProvider` from `next-themes` using `attribute="class"`:

```tsx
// components/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

```

Add the provider to `app/layout.tsx` and enable `suppressHydrationWarning` on `<html>` to avoid hydration mismatches:

```tsx
// app/layout.tsx
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

```

---

### Step 4: Create the Accessible Theme Toggle Component

```tsx
// components/ThemeToggle.tsx
"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-9 w-28 rounded-xl bg-surface border border-surface-border animate-pulse" />;
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      className="inline-flex items-center gap-1 p-1 rounded-xl bg-surface border border-surface-border shadow-sm"
    >
      <button
        type="button"
        role="radio"
        aria-checked={theme === "light"}
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          theme === "light"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted hover:text-foreground"
        }`}
      >
        <Sun className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Light</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={theme === "dark"}
        onClick={() => setTheme("dark")}
        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          theme === "dark"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted hover:text-foreground"
        }`}
      >
        <Moon className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Dark</span>
      </button>

      <button
        type="button"
        role="radio"
        aria-checked={theme === "system"}
        onClick={() => setTheme("system")}
        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          theme === "system"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted hover:text-foreground"
        }`}
      >
        <Laptop className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">System</span>
      </button>
    </div>
  );
}

```

---

### Step 5: Implementation Example

```tsx
// app/page.tsx
import { ThemeToggle } from "@/components/ThemeToggle";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl p-6 sm:p-10 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Theme Engine</h1>
        <ThemeToggle />
      </header>

      {/* Surface Card: automatically swaps styles via semantic tokens */}
      <section className="p-6 rounded-2xl bg-surface border border-surface-border shadow-sm space-y-3">
        <h2 className="text-lg font-bold">Semantic Tokens in Action</h2>
        <p className="text-sm text-muted">
          By referencing semantic tokens like <code className="font-mono text-xs">bg-surface</code>, <code className="font-mono text-xs">text-foreground</code>, and <code className="font-mono text-xs">border-surface-border</code>, components adapt automatically without verbose <code className="font-mono text-xs">dark:...</code> utility chains on every element.
        </p>

        {/* Explicit dark: modifier example */}
        <div className="pt-2">
          <button className="px-4 py-2 text-sm font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
            Interactive Button
          </button>
        </div>
      </section>
    </main>
  );
}

```

---

### Key Highlights

* **Automatic Variable Swapping:** Using `:root` and `.dark` with CSS variables allows components to inherit colors via `bg-background` and `bg-surface` without needing `dark:bg-...` on every container.
* **FOUC (Flash of Unstyled Content) Prevention:** `next-themes` injects an inline script in the `<head>` to read `localStorage` / system preference and apply the `.dark` class before the first DOM paint.
* **Accessible Radio Group:** The toggle uses `role="radiogroup"` and `aria-checked` attributes so screen readers announce the selected theme state accurately.
