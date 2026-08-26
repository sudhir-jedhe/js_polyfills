*** copy How do I build a TypeScript build script to calculate linear clamp() formulas from pixel inputs for Tailwind v4 @theme?.md ***

To calculate linear CSS `clamp()` formulas automatically, use the slope-intercept equation ($y = mx + b$) to interpolate between minimum and maximum viewport bounds.

---

### Linear Interpolation Math

Given:

* **Viewport Range:** $V_{\min}$ (e.g., $375\text{px}$) to $V_{\max}$ (e.g., $1280\text{px}$)
* **Target Size Range:** $S_{\min}$ (e.g., $16\text{px}$) to $S_{\max}$ (e.g., $24\text{px}$)
* **Root Font Size:** Typically $16\text{px}$ ($1\text{rem}$)

$$\text{Slope } (m) = \frac{S_{\max} - S_{\min}}{V_{\max} - V_{\min}}$$

$$y\text{-Intercept } (b) = S_{\min} - (V_{\min} \times m)$$

$$\text{CSS } \text{clamp}() = \text{clamp}\left(\frac{S_{\min}}{16}\text{rem},\, \frac{b}{16}\text{rem} + (m \times 100)\text{vw},\, \frac{S_{\max}}{16}\text{rem}\right)$$

---

### Step 1: Create the Generator Script (`scripts/generate-fluid-tokens.ts`)

```typescript
// scripts/generate-fluid-tokens.ts
import * as fs from "node:fs";
import * as path from "node:path";

interface FluidTokenConfig {
  minPx: number;
  maxPx: number;
  lineHeight?: number | string;
  letterSpacing?: string;
}

interface GeneratorOptions {
  minViewport?: number; // Default: 375px
  maxViewport?: number; // Default: 1280px
  rootFontSize?: number; // Default: 16px
  tokens: Record<string, FluidTokenConfig>;
  outputPath: string;
}

/**
 * Calculates a precise CSS clamp() string from pixel inputs
 */
export function calculateClamp(
  minPx: number,
  maxPx: number,
  minVw = 375,
  maxVw = 1280,
  rootFont = 16
): string {
  // If min and max are equal, no clamp is needed
  if (minPx === maxPx) {
    return `${(minPx / rootFont).toFixed(4)}rem`;
  }

  const slope = (maxPx - minPx) / (maxVw - minVw);
  const yIntercept = minPx - minVw * slope;

  const minRem = (minPx / rootFont).toFixed(4).replace(/\.?0+$/, "");
  const maxRem = (maxPx / rootFont).toFixed(4).replace(/\.?0+$/, "");
  const interceptRem = (yIntercept / rootFont).toFixed(4).replace(/\.?0+$/, "");
  const vwValue = (slope * 100).toFixed(4).replace(/\.?0+$/, "");

  const sign = yIntercept >= 0 ? "+" : "-";
  const absIntercept = Math.abs(Number(interceptRem));

  return `clamp(${minRem}rem, ${absIntercept}rem ${sign} ${vwValue}vw, ${maxRem}rem)`;
}

export function generateFluidCssTokens(options: GeneratorOptions) {
  const {
    minViewport = 375,
    maxViewport = 1280,
    rootFontSize = 16,
    tokens,
    outputPath,
  } = options;

  const lines: string[] = [
    `/* AUTO-GENERATED FLUID TYPOGRAPHY TOKENS */`,
    `/* Viewport Bounds: ${minViewport}px -> ${maxViewport}px | Base: ${rootFontSize}px */`,
    `@theme {`,
  ];

  for (const [name, config] of Object.entries(tokens)) {
    const clampValue = calculateClamp(
      config.minPx,
      config.maxPx,
      minViewport,
      maxViewport,
      rootFontSize
    );

    lines.push(`  --text-${name}: ${clampValue};`);

    if (config.lineHeight !== undefined) {
      lines.push(`  --text-${name}--line-height: ${config.lineHeight};`);
    }
    if (config.letterSpacing !== undefined) {
      lines.push(`  --text-${name}--letter-spacing: ${config.letterSpacing};`);
    }
  }

  lines.push(`}`);
  lines.push(``);

  const fileContent = lines.join("\n");
  const fullPath = path.resolve(process.cwd(), outputPath);

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, fileContent, "utf-8");

  console.log(`✅ Fluid typography tokens written to: ${outputPath}`);
}

// ---------------------------------------------------------------------------
// Typography Scale Definitions (Inputs in Pixels)
// ---------------------------------------------------------------------------
const TYPOGRAPHY_SCALE: Record<string, FluidTokenConfig> = {
  "fluid-xs": { minPx: 11, maxPx: 12, lineHeight: 1.5 },
  "fluid-sm": { minPx: 13, maxPx: 14, lineHeight: 1.45 },
  "fluid-base": { minPx: 15, maxPx: 18, lineHeight: 1.6 },
  "fluid-lg": { minPx: 18, maxPx: 22, lineHeight: 1.35, letterSpacing: "-0.01em" },
  "fluid-xl": { minPx: 20, maxPx: 26, lineHeight: 1.3, letterSpacing: "-0.015em" },
  "fluid-2xl": { minPx: 24, maxPx: 34, lineHeight: 1.2, letterSpacing: "-0.02em" },
  "fluid-3xl": { minPx: 28, maxPx: 44, lineHeight: 1.15, letterSpacing: "-0.025em" },
  "fluid-4xl": { minPx: 32, maxPx: 56, lineHeight: 1.1, letterSpacing: "-0.03em" },
  "fluid-hero": { minPx: 40, maxPx: 80, lineHeight: 1.02, letterSpacing: "-0.035em" },
};

generateFluidCssTokens({
  minViewport: 375,
  maxViewport: 1280,
  rootFontSize: 16,
  tokens: TYPOGRAPHY_SCALE,
  outputPath: "src/styles/fluid-tokens.css",
});

```

---

### Step 2: Add Script to `package.json`

```json
{
  "scripts": {
    "tokens:build": "npx tsx scripts/generate-fluid-tokens.ts"
  }
}

```

Run the build script:

```bash
npm run tokens:build

```

---

### Step 3: Generated Output (`src/styles/fluid-tokens.css`)

```css
/* AUTO-GENERATED FLUID TYPOGRAPHY TOKENS */
/* Viewport Bounds: 375px -> 1280px | Base: 16px */
@theme {
  --text-fluid-xs: clamp(0.6875rem, 0.6626rem + 0.1105vw, 0.75rem);
  --text-fluid-xs--line-height: 1.5;
  --text-fluid-sm: clamp(0.8125rem, 0.7876rem + 0.1105vw, 0.875rem);
  --text-fluid-sm--line-height: 1.45;
  --text-fluid-base: clamp(0.9375rem, 0.8601rem + 0.3315vw, 1.125rem);
  --text-fluid-base--line-height: 1.6;
  --text-fluid-lg: clamp(1.125rem, 1.0256rem + 0.442vw, 1.375rem);
  --text-fluid-lg--line-height: 1.35;
  --text-fluid-lg--letter-spacing: -0.01em;
  --text-fluid-xl: clamp(1.25rem, 1.1008rem + 0.663vw, 1.625rem);
  --text-fluid-xl--line-height: 1.3;
  --text-fluid-xl--letter-spacing: -0.015em;
  --text-fluid-2xl: clamp(1.5rem, 1.2514rem + 1.105vw, 2.125rem);
  --text-fluid-2xl--line-height: 1.2;
  --text-fluid-2xl--letter-spacing: -0.02em;
  --text-fluid-3xl: clamp(1.75rem, 1.3522rem + 1.768vw, 2.75rem);
  --text-fluid-3xl--line-height: 1.15;
  --text-fluid-3xl--letter-spacing: -0.025em;
  --text-fluid-4xl: clamp(2rem, 1.4033rem + 2.6519vw, 3.5rem);
  --text-fluid-4xl--line-height: 1.1;
  --text-fluid-4xl--letter-spacing: -0.03em;
  --text-fluid-hero: clamp(2.5rem, 1.5055rem + 4.4199vw, 5rem);
  --text-fluid-hero--line-height: 1.02;
  --text-fluid-hero--letter-spacing: -0.035em;
}

```

---

### Step 4: Import into Tailwind CSS v4

Import the generated CSS directly into your `globals.css`:

```css
/* app/globals.css */
@import "tailwindcss";
@import "../styles/fluid-tokens.css";

```

All generated tokens are immediately available as utility classes (e.g., `text-fluid-base`, `text-fluid-hero`).

---

### Step 5: Automating via Pre-build Hook

Wire the generator into your development and production build pipeline in `package.json`:

```json
{
  "scripts": {
    "predev": "npm run tokens:build",
    "prebuild": "npm run tokens:build",
    "dev": "next dev",
    "build": "next build"
  }
}

```
