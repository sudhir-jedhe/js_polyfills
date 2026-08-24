Generating dark mode palettes using the **OKLCH** color space produces perceptually uniform results because Lightness ($L$), Chroma ($C$), and Hue ($H$) are decoupled.

Unlike HSL or RGB—where changing brightness causes blue to look harsh or yellow to look greenish—OKLCH preserves perceived contrast and color intensity across theme shifts.

---

### Key Formulas for OKLCH Dark Mode Transforms

1. **Lightness Inversion ($L_{\text{dark}}$):** Rather than a raw mathematical flip ($1 - L$), scale surfaces to maintain contrast:

$$L_{\text{surface\_dark}} = 0.12 + (1 - L_{\text{surface\_light}}) \times 0.18$$

1. **Brand Foreground Lightness Boost:** High-chroma accents on dark backgrounds require higher lightness ($L \approx 0.65\text{–}0.75$) to meet WCAG AA (4.5:1).
2. **Chroma Desaturation ($C_{\text{dark}}$):** High chroma causes eye strain and vibration on dark surfaces. Reduce chroma by ~10% to 25%:

$$C_{\text{dark}} = C_{\text{light}} \times 0.85$$

---

### Step 1: Complete TypeScript Palette Generator (`generateOklchDark.ts`)

This script parses any light-mode OKLCH or HEX color and calculates its accessible dark-mode counterpart scale:

```typescript
// scripts/generateOklchDark.ts

export interface OklchColor {
  l: number; // 0 to 1
  c: number; // 0 to ~0.37
  h: number; // 0 to 360
  a?: number;
}

export interface ThemeTokens {
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  foreground: string;
  foregroundMuted: string;
  primary: string;
  primaryHover: string;
  primaryForeground: string;
}

/** Format numbers to 3 decimal places for CSS readability */
export const formatOklch = (c: OklchColor): string =>
  `oklch(${c.l.toFixed(3)} ${c.c.toFixed(3)} ${c.h.toFixed(1)}${
    c.a !== undefined ? ` / ${c.a}` : ""
  })`;

/**
 * Derives a full dark mode token suite from a brand primary OKLCH color
 */
export function generateDarkPalette(primaryLight: OklchColor): {
  light: ThemeTokens;
  dark: ThemeTokens;
} {
  // --- 1. LIGHT THEME TOKENS ---
  const light: ThemeTokens = {
    background: formatOklch({ l: 0.985, c: 0.005, h: primaryLight.h }),
    surface: formatOklch({ l: 1.0, c: 0, h: 0 }),
    surfaceMuted: formatOklch({ l: 0.95, c: 0.01, h: primaryLight.h }),
    border: formatOklch({ l: 0.90, c: 0.015, h: primaryLight.h }),
    foreground: formatOklch({ l: 0.15, c: 0.02, h: primaryLight.h }),
    foregroundMuted: formatOklch({ l: 0.48, c: 0.025, h: primaryLight.h }),
    primary: formatOklch(primaryLight),
    primaryHover: formatOklch({
      l: Math.max(0.2, primaryLight.l - 0.07),
      c: primaryLight.c,
      h: primaryLight.h,
    }),
    primaryForeground: formatOklch({ l: 0.99, c: 0, h: 0 }),
  };

  // --- 2. DARK THEME TOKENS (Perceptual Transform) ---
  
  // Elevate primary lightness and reduce chroma slightly for dark UI
  const darkPrimary: OklchColor = {
    l: Math.min(0.72, Math.max(0.65, primaryLight.l + 0.15)),
    c: primaryLight.c * 0.85,
    h: primaryLight.h,
  };

  const dark: ThemeTokens = {
    // Deep dark surface with a subtle brand tint
    background: formatOklch({ l: 0.14, c: 0.02, h: primaryLight.h }),
    surface: formatOklch({ l: 0.19, c: 0.02, h: primaryLight.h }),
    surfaceMuted: formatOklch({ l: 0.25, c: 0.025, h: primaryLight.h }),
    border: formatOklch({ l: 0.28, c: 0.02, h: primaryLight.h }),
    foreground: formatOklch({ l: 0.97, c: 0.005, h: primaryLight.h }),
    foregroundMuted: formatOklch({ l: 0.70, c: 0.015, h: primaryLight.h }),
    primary: formatOklch(darkPrimary),
    primaryHover: formatOklch({
      l: Math.min(0.80, darkPrimary.l + 0.07),
      c: darkPrimary.c,
      h: darkPrimary.h,
    }),
    // High contrast dark text for active primary buttons
    primaryForeground: formatOklch({ l: 0.12, c: 0.03, h: primaryLight.h }),
  };

  return { light, dark };
}

// Example usage with an Indigo Brand Color (L: 0.55, C: 0.22, H: 260)
const indigoPrimary: OklchColor = { l: 0.55, c: 0.22, h: 260.0 };
const tokens = generateDarkPalette(indigoPrimary);
console.log(JSON.stringify(tokens, null, 2));

```

---

### Step 2: Output CSS Variables for Tailwind CSS v4

The generated tokens integrate directly with `@theme` in `globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-surface-muted: var(--surface-muted);
  --color-border: var(--border);
  --color-foreground: var(--foreground);
  --color-foreground-muted: var(--foreground-muted);
  --color-primary: var(--primary);
  --color-primary-hover: var(--primary-hover);
  --color-primary-foreground: var(--primary-foreground);
}

/* Light Theme (Generated) */
:root {
  --background: oklch(0.985 0.005 260.0);
  --surface: oklch(1.000 0.000 0.0);
  --surface-muted: oklch(0.950 0.010 260.0);
  --border: oklch(0.900 0.015 260.0);
  --foreground: oklch(0.150 0.020 260.0);
  --foreground-muted: oklch(0.480 0.025 260.0);
  --primary: oklch(0.550 0.220 260.0);
  --primary-hover: oklch(0.480 0.220 260.0);
  --primary-foreground: oklch(0.990 0.000 0.0);
}

/* Dark Theme (Auto-inverted via OKLCH) */
.dark {
  --background: oklch(0.140 0.020 260.0);
  --surface: oklch(0.190 0.020 260.0);
  --surface-muted: oklch(0.250 0.025 260.0);
  --border: oklch(0.280 0.020 260.0);
  --foreground: oklch(0.970 0.005 260.0);
  --foreground-muted: oklch(0.700 0.015 260.0);
  --primary: oklch(0.700 0.187 260.0);
  --primary-hover: oklch(0.770 0.187 260.0);
  --primary-foreground: oklch(0.120 0.030 260.0);
}

```

---

### Step 3: Interactive Palette Previewer & Generator

---

### Rules of Thumb for OKLCH Dark Variations

* **Neutral Surface Hue Anchoring:** Always pass the brand's Hue value (`primary.h`) with a tiny chroma ($C \approx 0.01\text{–}0.02$) into dark backgrounds and surfaces to give the dark mode a cohesive, premium tint rather than flat gray.
* **Avoid True Black (`#000000` / `L: 0`):** Start dark backgrounds at $L \approx 0.14\text{–}0.16$. True black causes high visual glare with saturated text and eliminates the ability to create recessed depth layers.
* **Swap Primary Button Text Inversion:** In light mode, primary buttons have light text on a dark primary (`primary-foreground: L ≈ 0.99`). In dark mode, because the primary token is boosted in lightness ($L \approx 0.70$), the button text must shift to dark text ($L \approx 0.12$) to pass WCAG AA.
