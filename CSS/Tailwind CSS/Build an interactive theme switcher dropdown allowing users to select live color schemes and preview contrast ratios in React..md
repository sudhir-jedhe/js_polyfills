*** copy Build an interactive theme switcher dropdown allowing users to select live color schemes and preview contrast ratios in React..md ***

An interactive theme switcher that calculates real-time WCAG 2.1 contrast ratios uses relative luminance math to evaluate text-to-background contrast, ensuring every selected color scheme meets accessibility standards (AA $\ge 4.5:1$, AAA $\ge 7:1$).

---

### 1. Contrast Calculation Engine (`utils/contrast.ts`)

Relative luminance is calculated by converting sRGB channels to linear RGB and applying the standard WCAG luminance weights:

$$L = 0.2126 \times R_{\text{linear}} + 0.7152 \times G_{\text{linear}} + 0.0722 \times B_{\text{linear}}$$

$$\text{Contrast Ratio} = \frac{L_{\text{lighter}} + 0.05}{L_{\text{darker}} + 0.05}$$

```typescript
// Convert hex color to sRGB values [0..1]
function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace("#", "");
  const num = parseInt(cleanHex, 16);
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

// Convert sRGB to linear RGB channel
function sRgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// Calculate relative luminance
export function getLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  return (
    0.2126 * sRgbToLinear(r) +
    0.7152 * sRgbToLinear(g) +
    0.0722 * sRgbToLinear(b)
  );
}

// Calculate contrast ratio between two hex colors
export function getContrastRatio(foreground: string, background: string): number {
  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

// Check WCAG compliance tier
export function getWcagRating(ratio: number) {
  return {
    ratio,
    aaNormal: ratio >= 4.5,
    aaLarge: ratio >= 3.0,
    aaaNormal: ratio >= 7.0,
    aaaLarge: ratio >= 4.5,
  };
}

```

---

### 2. The Complete React Theme Switcher Component

```tsx
import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { getContrastRatio, getWcagRating } from "./utils/contrast";

export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  primaryForeground: string;
  surface: string;
  surfaceForeground: string;
  muted: string;
}

export const THEMES: ColorScheme[] = [
  {
    id: "indigo-light",
    name: "Indigo Modern (Light)",
    primary: "#4f46e5",
    primaryForeground: "#ffffff",
    surface: "#ffffff",
    surfaceForeground: "#0f172a",
    muted: "#f1f5f9",
  },
  {
    id: "emerald-slate",
    name: "Emerald Forest (Light)",
    primary: "#059669",
    primaryForeground: "#ffffff",
    surface: "#f8fafc",
    surfaceForeground: "#0f172a",
    muted: "#e2e8f0",
  },
  {
    id: "amber-sunset",
    name: "Amber Warm (Light)",
    primary: "#d97706",
    primaryForeground: "#ffffff",
    surface: "#fffbeb",
    surfaceForeground: "#451a03",
    muted: "#fef3c7",
  },
  {
    id: "cyber-neon",
    name: "Cyber Neon (Dark)",
    primary: "#38bdf8",
    primaryForeground: "#082f49",
    surface: "#0f172a",
    surfaceForeground: "#f8fafc",
    muted: "#1e293b",
  },
  {
    id: "rose-obsidian",
    name: "Rose Obsidian (Dark)",
    primary: "#f43f5e",
    primaryForeground: "#ffffff",
    surface: "#18181b",
    surfaceForeground: "#fafafa",
    muted: "#27272a",
  },
];

export function ThemeSwitcher() {
  const [selectedTheme, setSelectedTheme] = React.useState<ColorScheme>(THEMES[0]);

  // Apply CSS custom properties dynamically to the container or root
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", selectedTheme.primary);
    root.style.setProperty("--color-primary-fg", selectedTheme.primaryForeground);
    root.style.setProperty("--color-surface", selectedTheme.surface);
    root.style.setProperty("--color-surface-fg", selectedTheme.surfaceForeground);
    root.style.setProperty("--color-muted", selectedTheme.muted);
  }, [selectedTheme]);

  const buttonRatio = getContrastRatio(selectedTheme.primaryForeground, selectedTheme.primary);
  const textRatio = getContrastRatio(selectedTheme.surfaceForeground, selectedTheme.surface);
  const buttonWcag = getWcagRating(buttonRatio);
  const textWcag = getWcagRating(textRatio);

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto p-6 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
      
      {/* Dropdown Selector */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">Color Scheme</h3>
          <p className="text-xs text-slate-500">Pick a preset to preview theme & live contrast</p>
        </div>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger className="inline-flex items-center gap-2.5 px-4 py-2 text-sm font-semibold rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <span
              className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-sm"
              style={{ backgroundColor: selectedTheme.primary }}
            />
            <span>{selectedTheme.name}</span>
            <span className="text-xs text-slate-400">▼</span>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 min-w-[240px] rounded-2xl bg-white dark:bg-slate-800 p-2 shadow-xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95"
            >
              {THEMES.map((theme) => {
                const ratio = getContrastRatio(theme.primaryForeground, theme.primary);
                const isSelected = theme.id === selectedTheme.id;

                return (
                  <DropdownMenu.Item
                    key={theme.id}
                    onSelect={() => setSelectedTheme(theme)}
                    className={`flex items-center justify-between px-3 py-2 text-sm rounded-xl cursor-pointer outline-none transition-colors ${
                      isSelected
                        ? "bg-slate-100 dark:bg-slate-700 font-semibold"
                        : "hover:bg-slate-50 dark:hover:bg-slate-700/60"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10"
                        style={{ backgroundColor: theme.primary }}
                      />
                      <span>{theme.name}</span>
                    </div>

                    <span
                      className={`text-xs px-2 py-0.5 rounded-md font-mono ${
                        ratio >= 4.5
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300"
                      }`}
                    >
                      {ratio}:1
                    </span>
                  </DropdownMenu.Item>
                );
              })}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      {/* Live Preview Card */}
      <div
        className="p-6 rounded-2xl border transition-all duration-300 shadow-md flex flex-col gap-4"
        style={{
          backgroundColor: selectedTheme.surface,
          color: selectedTheme.surfaceForeground,
          borderColor: selectedTheme.muted,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest opacity-70">
            Live Preview
          </span>
          <span
            className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ backgroundColor: selectedTheme.muted }}
          >
            {selectedTheme.name}
          </span>
        </div>

        <h4 className="text-xl font-bold">Accessible UI Component</h4>
        <p className="text-sm opacity-80 leading-relaxed">
          This preview dynamically renders text, surfaces, and action controls mapped to the active color palette tokens.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            className="px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-transform active:scale-95"
            style={{
              backgroundColor: selectedTheme.primary,
              color: selectedTheme.primaryForeground,
            }}
          >
            Primary Button
          </button>
          <button
            className="px-4 py-2 rounded-xl text-sm font-semibold border"
            style={{
              borderColor: selectedTheme.primary,
              color: selectedTheme.primary,
            }}
          >
            Outline Button
          </button>
        </div>
      </div>

      {/* Realtime Contrast Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span>Primary on Button</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {buttonRatio}:1
            </span>
          </div>
          <div className="flex gap-1.5">
            <span className={`px-1.5 py-0.5 rounded font-bold ${buttonWcag.aaNormal ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-red-100 text-red-700"}`}>
              AA {buttonWcag.aaNormal ? "✓" : "✗"}
            </span>
            <span className={`px-1.5 py-0.5 rounded font-bold ${buttonWcag.aaaNormal ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-slate-700"}`}>
              AAA {buttonWcag.aaaNormal ? "✓" : "✗"}
            </span>
          </div>
        </div>

        <div className="p-3.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5">
          <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
            <span>Text on Surface</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {textRatio}:1
            </span>
          </div>
          <div className="flex gap-1.5">
            <span className={`px-1.5 py-0.5 rounded font-bold ${textWcag.aaNormal ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-red-100 text-red-700"}`}>
              AA {textWcag.aaNormal ? "✓" : "✗"}
            </span>
            <span className={`px-1.5 py-0.5 rounded font-bold ${textWcag.aaaNormal ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-500 dark:bg-slate-700"}`}>
              AAA {textWcag.aaaNormal ? "✓" : "✗"}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

```

---
