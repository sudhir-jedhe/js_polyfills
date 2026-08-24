Configuring system theme synchronization with auto-switching requires a two-layer setup:

1. **OS Media Query Synchronization (`prefers-color-scheme`)** to respond automatically whenever the user changes their operating system appearance.
2. **Multi-Brand Palette Injection (`[data-brand]`)** so custom tenant/brand colors dynamically adjust their luminance and chroma depending on whether the resolved system mode is **light** or **dark**.

---

### Step 1: Semantic Variable Architecture with Brand Presets

Configure `globals.css` with `@theme` tokens in Tailwind v4. Define brand accents using `oklch()` so that setting `data-brand="emerald"` or `data-brand="rose"` shifts colors across both light and dark backgrounds.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-surface: var(--surface);
  --color-border: var(--border);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-hover: var(--primary-hover);
}

/* --- 1. DEFAULT LIGHT (System Fallback) --- */
:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.15 0.02 240);
  --surface: oklch(1 0 0);
  --border: oklch(0.92 0.01 240);

  /* Default Indigo */
  --primary: oklch(0.55 0.22 260);
  --primary-foreground: oklch(0.99 0 0);
  --primary-hover: oklch(0.48 0.22 260);
}

/* --- 2. DEFAULT DARK (System Fallback) --- */
.dark {
  --background: oklch(0.14 0.02 240);
  --foreground: oklch(0.98 0 0);
  --surface: oklch(0.19 0.02 240);
  --border: oklch(0.28 0.02 240);

  /* Dark Indigo (Elevated Lightness for Dark Surface) */
  --primary: oklch(0.68 0.18 260);
  --primary-foreground: oklch(0.12 0.03 260);
  --primary-hover: oklch(0.74 0.16 260);
}

/* --- 3. DYNAMIC BRAND PALETTES --- */

/* Emerald Brand */
[data-brand="emerald"] {
  --primary: oklch(0.58 0.19 155);
  --primary-foreground: oklch(0.99 0 0);
  --primary-hover: oklch(0.50 0.19 155);
}
.dark[data-brand="emerald"],
[data-brand="emerald"] .dark,
[data-brand="emerald"].dark {
  --primary: oklch(0.70 0.16 155);
  --primary-foreground: oklch(0.10 0.03 155);
  --primary-hover: oklch(0.76 0.14 155);
}

/* Rose Brand */
[data-brand="rose"] {
  --primary: oklch(0.60 0.22 15);
  --primary-foreground: oklch(0.99 0 0);
  --primary-hover: oklch(0.52 0.22 15);
}
.dark[data-brand="rose"],
[data-brand="rose"] .dark,
[data-brand="rose"].dark {
  --primary: oklch(0.72 0.19 15);
  --primary-foreground: oklch(0.10 0.03 15);
  --primary-hover: oklch(0.78 0.17 15);
}

```

---

### Step 2: Next-Themes Provider with Brand Attribute Extension

Configure `next-themes` to manage the `.dark` class, and extend the context to persist brand selection in `localStorage`.

```tsx
// components/providers/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";

export type BrandPalette = "indigo" | "emerald" | "rose";

interface BrandContextType {
  brand: BrandPalette;
  setBrand: (brand: BrandPalette) => void;
  resolvedMode: "light" | "dark";
}

const BrandContext = React.createContext<BrandContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrandState] = React.useState<BrandPalette>("indigo");
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // 1. Read persisted brand from storage on client mount
    const storedBrand = localStorage.getItem("app-brand") as BrandPalette | null;
    if (storedBrand) {
      setBrandState(storedBrand);
      document.documentElement.setAttribute("data-brand", storedBrand);
    }
    setMounted(true);
  }, []);

  const setBrand = (newBrand: BrandPalette) => {
    setBrandState(newBrand);
    localStorage.setItem("app-brand", newBrand);
    if (newBrand === "indigo") {
      document.documentElement.removeAttribute("data-brand");
    } else {
      document.documentElement.setAttribute("data-brand", newBrand);
    }
  };

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem={true}
      disableTransitionOnChange={false}
    >
      <BrandInnerProvider brand={brand} setBrand={setBrand} mounted={mounted}>
        {children}
      </BrandInnerProvider>
    </NextThemesProvider>
  );
}

function BrandInnerProvider({
  brand,
  setBrand,
  mounted,
  children,
}: {
  brand: BrandPalette;
  setBrand: (b: BrandPalette) => void;
  mounted: boolean;
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useNextTheme();
  const resolvedMode = (mounted ? resolvedTheme : "light") as "light" | "dark";

  return (
    <BrandContext.Provider value={{ brand, setBrand, resolvedMode }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useAppTheme() {
  const brandContext = React.useContext(BrandContext);
  const nextTheme = useNextTheme();

  if (!brandContext) {
    throw new Error("useAppTheme must be used within AppThemeProvider");
  }

  return {
    // Mode controls (light | dark | system)
    theme: nextTheme.theme as "light" | "dark" | "system",
    setTheme: nextTheme.setTheme,
    resolvedTheme: brandContext.resolvedMode,
    systemTheme: nextTheme.systemTheme as "light" | "dark",
    
    // Brand controls (indigo | emerald | rose)
    brand: brandContext.brand,
    setBrand: brandContext.setBrand,
  };
}

```

---

### Step 3: Configure Root Layout (`app/layout.tsx`)

Wrap your application in `AppThemeProvider` and add `suppressHydrationWarning` to the `<html>` root tag:

```tsx
// app/layout.tsx
import "@/app/globals.css";
import { AppThemeProvider } from "@/components/providers/theme-provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground transition-colors duration-200 antialiased">
        <AppThemeProvider>{children}</AppThemeProvider>
      </body>
    </html>
  );
}

```

---

### Step 4: System-Synced Theme & Brand Switcher UI

This component renders mode switches (`System`, `Light`, `Dark`) and live brand pills. It displays real-time badges indicating the resolved OS state.

```tsx
// components/theme-switcher.tsx
"use client";

import * as React from "react";
import { useAppTheme, BrandPalette } from "./providers/theme-provider";

const BRANDS: { id: BrandPalette; name: string; hex: string }[] = [
  { id: "indigo", name: "Indigo", hex: "#6366f1" },
  { id: "emerald", name: "Emerald", hex: "#10b981" },
  { id: "rose", name: "Rose", hex: "#f43f5e" },
];

export function ThemeSwitcher() {
  const { theme, setTheme, resolvedTheme, brand, setBrand } = useAppTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-28 rounded-2xl bg-surface border border-border animate-pulse" />;
  }

  return (
    <div className="p-6 rounded-3xl bg-surface border border-border shadow-md space-y-5 max-w-md">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base">Appearance & Themes</h3>
          <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-background border border-border">
            Active: {resolvedTheme}
          </span>
        </div>
        <p className="text-xs text-foreground/70 mt-0.5">
          Syncs with OS changes or allows manual override.
        </p>
      </div>

      {/* Mode Selector (System, Light, Dark) */}
      <div className="grid grid-cols-3 gap-2 bg-background p-1.5 rounded-2xl border border-border text-xs font-semibold">
        {(["system", "light", "dark"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setTheme(mode)}
            className={`py-2 rounded-xl capitalize transition-all ${
              theme === mode
                ? "bg-surface text-foreground shadow-sm border border-border"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {mode === "system" ? "💻 Auto (System)" : mode === "light" ? "☀️ Light" : "🌙 Dark"}
          </button>
        ))}
      </div>

      {/* Brand Color Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-foreground/60">
          Accent Brand
        </label>
        <div className="flex gap-2">
          {BRANDS.map((item) => (
            <button
              key={item.id}
              onClick={() => setBrand(item.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                brand === item.id
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-foreground/80 hover:border-foreground/30"
              }`}
            >
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.hex }} />
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Preview Button */}
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <span className="text-xs opacity-75">Button Test:</span>
        <button className="px-4 py-2 text-xs font-bold rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-transform active:scale-95 shadow-sm">
          Primary Action
        </button>
      </div>
    </div>
  );
}

```

---

### Step 5: Test OS Auto-Switching in Playwright

Automate verification that changing the OS color scheme triggers real-time class toggling on `<html>` without requiring a page refresh:

```typescript
// e2e/system-theme-sync.spec.ts
import { test, expect } from "@playwright/test";

test.describe("System Theme Auto-Switching", () => {
  test("reacts immediately to OS prefers-color-scheme changes", async ({ page }) => {
    // 1. Initial OS state: Light
    await page.emulateMedia({ colorScheme: "light" });
    await page.goto("/");

    const html = page.locator("html");
    await expect(html).not.toHaveClass(/dark/);

    // 2. Simulate OS auto-switch to Dark Mode
    await page.emulateMedia({ colorScheme: "dark" });
    
    // next-themes listener catches event without reload
    await expect(html).toHaveClass(/dark/);

    // 3. Simulate OS auto-switch back to Light Mode
    await page.emulateMedia({ colorScheme: "light" });
    await expect(html).not.toHaveClass(/dark/);
  });
});

```

---

### Summary of System Synchronization Behaviors

* **`enableSystem={true}`:** Adds a listener to `window.matchMedia('(prefers-color-scheme: dark)')` to mirror OS dark mode schedules (e.g., sunset-to-sunrise).
* **`defaultTheme="system"`:** Guarantees first-time visitors automatically get the theme configured on their operating system.
* **Instant Re-Theming with CSS Variables:** Changing system appearance only flips the `.dark` class; OKLCH tokens adjust their values instantly without re-rendering the React virtual DOM.
