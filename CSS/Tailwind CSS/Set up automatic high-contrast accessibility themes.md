***  Set up automatic high-contrast accessibility themes.md ***

An automatic high-contrast theme adapts your design system to meet **WCAG AAA standards** (minimum contrast ratio of **7:1** for normal text and **4.5:1** for UI components/large text) by responding to system preferences via the `@media (prefers-contrast: more)` query, Windows High Contrast Mode (`forced-colors: active`), and manual user overrides.

---

### Step 1: Define WCAG AAA Tokens in Tailwind CSS v4

In your `globals.css`, register semantic tokens in `@theme` and configure your base themes along with automated `@media (prefers-contrast: more)` overrides and explicit `[data-contrast="high"]` attributes for manual selection.

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --color-bg-app: var(--bg-app);
  --color-bg-surface: var(--bg-surface);
  --color-border-main: var(--border-main);
  --color-text-main: var(--text-main);
  --color-text-muted: var(--text-muted);
  --color-primary: var(--brand-primary);
  --color-primary-fg: var(--brand-primary-fg);
  --color-focus-ring: var(--focus-ring);
}

/* 1. Default Light Mode (WCAG AA ~4.5:1) */
:root {
  --bg-app: oklch(0.98 0 0);
  --bg-surface: oklch(1 0 0);
  --border-main: oklch(0.88 0.01 240);
  --text-main: oklch(0.15 0.02 240);
  --text-muted: oklch(0.45 0.02 240);
  --brand-primary: oklch(0.55 0.22 260);
  --brand-primary-fg: oklch(0.99 0 0);
  --focus-ring: oklch(0.55 0.22 260 / 0.5);
}

/* 2. Default Dark Mode (WCAG AA ~4.5:1) */
.dark {
  --bg-app: oklch(0.14 0.02 240);
  --bg-surface: oklch(0.19 0.02 240);
  --border-main: oklch(0.30 0.02 240);
  --text-main: oklch(0.96 0.01 240);
  --text-muted: oklch(0.70 0.01 240);
  --brand-primary: oklch(0.68 0.18 260);
  --brand-primary-fg: oklch(0.12 0.03 260);
  --focus-ring: oklch(0.68 0.18 260 / 0.6);
}

/* 3. Automatic High-Contrast Light Mode (WCAG AAA >= 7:1) */
@media (prefers-contrast: more) {
  :root:not([data-contrast="normal"]) {
    --bg-app: #ffffff;
    --bg-surface: #ffffff;
    --border-main: #000000;
    --text-main: #000000;
    --text-muted: #1a1a1a;
    --brand-primary: #0000d6; /* WCAG AAA compliant blue on white (>8.5:1) */
    --brand-primary-fg: #ffffff;
    --focus-ring: #000000;
  }
}

/* 4. Automatic High-Contrast Dark Mode (WCAG AAA >= 7:1) */
@media (prefers-contrast: more) {
  .dark:not([data-contrast="normal"]) {
    --bg-app: #000000;
    --bg-surface: #000000;
    --border-main: #ffffff;
    --text-main: #ffffff;
    --text-muted: #e6e6e6;
    --brand-primary: #80c4ff; /* High-luminance accent on pure black (>9.5:1) */
    --brand-primary-fg: #000000;
    --focus-ring: #ffffff;
  }
}

/* 5. Manual High-Contrast Override (when forced via user setting) */
[data-contrast="high"] {
  --bg-app: #ffffff !important;
  --bg-surface: #ffffff !important;
  --border-main: #000000 !important;
  --text-main: #000000 !important;
  --text-muted: #1a1a1a !important;
  --brand-primary: #0000d6 !important;
  --brand-primary-fg: #ffffff !important;
  --focus-ring: #000000 !important;
}

.dark[data-contrast="high"],
[data-contrast="high"] .dark {
  --bg-app: #000000 !important;
  --bg-surface: #000000 !important;
  --border-main: #ffffff !important;
  --text-main: #ffffff !important;
  --text-muted: #e6e6e6 !important;
  --brand-primary: #80c4ff !important;
  --brand-primary-fg: #000000 !important;
  --focus-ring: #ffffff !important;
}

```

---

### Step 2: Handle Windows High Contrast / Forced Colors

Windows High Contrast Mode uses the CSS `@media (forced-colors: active)` media query. Use standard system color keywords to ensure interactive elements, focus rings, and borders remain visible when system colors take over:

```css
@media (forced-colors: active) {
  /* Ensure borders and focus rings use native system highlight colors */
  button,
  input,
  select,
  textarea,
  [role="button"] {
    border: 2px solid ButtonText !important;
    forced-color-adjust: none;
  }

  button:focus-visible,
  input:focus-visible,
  a:focus-visible {
    outline: 3px solid Highlight !important;
    outline-offset: 2px;
  }
}

```

---

### Step 3: Contrast State Management Hook

Create a React hook to handle automatic system detection with manual override support:

```tsx
// src/hooks/useContrastPreference.ts
import * as React from "react";

export type ContrastMode = "auto" | "normal" | "high";

export function useContrastPreference() {
  const [contrast, setContrast] = React.useState<ContrastMode>("auto");
  const [isSystemHighContrast, setIsSystemHighContrast] = React.useState(false);

  React.useEffect(() => {
    // 1. Detect OS prefers-contrast media query
    const mediaQuery = window.matchMedia("(prefers-contrast: more)");
    setIsSystemHighContrast(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => {
      setIsSystemHighContrast(e.matches);
    };

    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  React.useEffect(() => {
    const root = document.documentElement;

    if (contrast === "high") {
      root.setAttribute("data-contrast", "high");
    } else if (contrast === "normal") {
      root.setAttribute("data-contrast", "normal");
    } else {
      root.removeAttribute("data-contrast"); // Defers to @media (prefers-contrast)
    }
  }, [contrast]);

  return {
    contrast,
    setContrast,
    isSystemHighContrast,
    isEffectiveHighContrast:
      contrast === "high" || (contrast === "auto" && isSystemHighContrast),
  };
}

```

---

### Step 4: Component Implementation with CVA

Build accessible components that respect high-contrast borders and thick focus indicators:

```tsx
// src/components/AccessibleButton.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  [
    "inline-flex items-center justify-center font-bold transition-colors select-none",
    "border-2 outline-none focus-visible:ring-4 focus-visible:ring-offset-2",
    "focus-visible:ring-[var(--color-focus-ring)]",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      intent: {
        primary: [
          "bg-primary text-primary-fg border-primary",
          "hover:opacity-90",
        ],
        outline: [
          "bg-bg-surface text-text-main border-border-main",
          "hover:bg-bg-app",
        ],
      },
      size: {
        sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
        md: "h-11 px-5 text-sm rounded-xl gap-2",
        lg: "h-13 px-6 text-base rounded-2xl gap-2.5",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  }
);

export interface AccessibleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const AccessibleButton = React.forwardRef<
  HTMLButtonElement,
  AccessibleButtonProps
>(({ className, intent, size, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ intent, size }), className)}
      {...props}
    />
  );
});
AccessibleButton.displayName = "AccessibleButton";

```

---

### Step 5: Interactive Settings Panel Component

```tsx
// src/components/AccessibilitySettings.tsx
import * as React from "react";
import { useContrastPreference } from "@/hooks/useContrastPreference";
import { AccessibleButton } from "./AccessibleButton";

export function AccessibilitySettings() {
  const { contrast, setContrast, isEffectiveHighContrast, isSystemHighContrast } =
    useContrastPreference();

  return (
    <div className="w-full max-w-md p-6 rounded-3xl bg-bg-surface text-text-main border-2 border-border-main shadow-lg space-y-6">
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black">Accessibility Settings</h2>
          <span
            className="text-xs px-2.5 py-1 rounded-full border border-border-main font-mono font-bold"
          >
            {isEffectiveHighContrast ? "AAA Mode Active" : "AA Mode"}
          </span>
        </div>
        <p className="text-xs text-text-muted">
          Automatic adjustment based on your device&apos;s display preferences.
        </p>
      </div>

      {/* Mode Controls */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-text-muted">
          Contrast Preference
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(["auto", "normal", "high"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setContrast(mode)}
              className={`py-2 px-3 text-xs font-bold rounded-xl border-2 capitalize transition-all ${
                contrast === mode
                  ? "bg-text-main text-bg-surface border-text-main"
                  : "bg-bg-app text-text-main border-border-main hover:border-text-main"
              }`}
            >
              {mode === "auto" ? `Auto (${isSystemHighContrast ? "High" : "Std"})` : mode}
            </button>
          ))}
        </div>
      </div>

      {/* Live Sample Card */}
      <div className="p-4 rounded-2xl bg-bg-app border-2 border-border-main space-y-3">
        <h3 className="text-sm font-bold">Contrast Verification</h3>
        <p className="text-xs text-text-muted leading-relaxed">
          High-contrast mode switches subtle grays to sharp black/white borders, enforces thick 2px element strokes, and elevates link/button luminance past 7:1.
        </p>
        <div className="flex gap-2 pt-1">
          <AccessibleButton intent="primary" size="sm">
            Primary Action
          </AccessibleButton>
          <AccessibleButton intent="outline" size="sm">
            Secondary
          </AccessibleButton>
        </div>
      </div>
    </div>
  );
}

```

---

### WCAG AAA High-Contrast Checklist

* **Strict Borders over Drop Shadows:** Subtly colored shadows disappear on low-contrast monitors. In high-contrast mode, substitute box shadows for solid `2px` or `3px` borders (`border-border-main`).
* **Focus Indicator Visibility:** Focus rings must have a minimum contrast ratio of **3:1** against both the element and the adjacent background. Use solid `focus-visible:ring-4` or `outline: 3px solid`.
* **No Pure Chroma Substitution for State:** Avoid using color alone (e.g., just turning text red) to signal error states. Pair color tokens with text icons (`✗`, `!`) or explicit text descriptors.
