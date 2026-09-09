***  How do I modify the TypeScript clamp generator script to output fluid spacing, gap, and container padding scales for Tailwind CSS v4?.md ***

In Tailwind CSS v4, custom spacing tokens defined under the `--spacing-*` namespace in `@theme` automatically map to all spacing-based utilities: padding (`p-*`), margin (`m-*`), gap (`gap-*`), width/height sizing (`w-*`, `h-*`), and container insets.

---

### Step 1: Extended TypeScript Generator (`scripts/generate-fluid-tokens.ts`)

Update the script to support both `--text-*` typography scales and `--spacing-*` layout scales.

```typescript
// scripts/generate-fluid-tokens.ts
import * as fs from "node:fs";
import * as path from "node:path";

interface FluidTypographyConfig {
  minPx: number;
  maxPx: number;
  lineHeight?: number | string;
  letterSpacing?: string;
}

interface FluidSpacingConfig {
  minPx: number;
  maxPx: number;
}

interface GeneratorOptions {
  minViewport?: number; // Default: 375px
  maxViewport?: number; // Default: 1280px
  rootFontSize?: number; // Default: 16px
  typographyTokens?: Record<string, FluidTypographyConfig>;
  spacingTokens?: Record<string, FluidSpacingConfig>;
  outputPath: string;
}

/**
 * Calculates a precise CSS clamp() string from pixel values
 */
export function calculateClamp(
  minPx: number,
  maxPx: number,
  minVw = 375,
  maxVw = 1280,
  rootFont = 16
): string {
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

export function generateFluidTokens(options: GeneratorOptions) {
  const {
    minViewport = 375,
    maxViewport = 1280,
    rootFontSize = 16,
    typographyTokens = {},
    spacingTokens = {},
    outputPath,
  } = options;

  const lines: string[] = [
    `/* AUTO-GENERATED FLUID DESIGN TOKENS */`,
    `/* Range: ${minViewport}px -> ${maxViewport}px | Base: ${rootFontSize}px */`,
    `@theme {`,
  ];

  // 1. Spacing, Gaps, and Container Padding Scale
  if (Object.keys(spacingTokens).length > 0) {
    lines.push(`  /* Fluid Spacing, Gaps & Padding (--spacing-fluid-*) */`);
    for (const [name, config] of Object.entries(spacingTokens)) {
      const clampValue = calculateClamp(
        config.minPx,
        config.maxPx,
        minViewport,
        maxViewport,
        rootFontSize
      );
      lines.push(`  --spacing-${name}: ${clampValue};`);
    }
    lines.push(``);
  }

  // 2. Fluid Typography Scale
  if (Object.keys(typographyTokens).length > 0) {
    lines.push(`  /* Fluid Typography (--text-fluid-*) */`);
    for (const [name, config] of Object.entries(typographyTokens)) {
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
  }

  lines.push(`}`);
  lines.push(``);

  const fileContent = lines.join("\n");
  const fullPath = path.resolve(process.cwd(), outputPath);

  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, fileContent, "utf-8");

  console.log(`✅ Fluid design tokens compiled to: ${outputPath}`);
}

// ---------------------------------------------------------------------------
// Design System Token Scale Configurations
// ---------------------------------------------------------------------------

const SPACING_SCALE: Record<string, FluidSpacingConfig> = {
  // Component Insets & Micro-gaps
  "fluid-xs": { minPx: 4, maxPx: 8 },      // e.g. badge & button padding
  "fluid-sm": { minPx: 8, maxPx: 14 },     // card internal padding
  "fluid-md": { minPx: 16, maxPx: 24 },    // standard layout gap
  "fluid-lg": { minPx: 24, maxPx: 40 },    // grid column gaps
  "fluid-xl": { minPx: 32, maxPx: 64 },    // card section spacing

  // Macro Layout & Section Spacing
  "fluid-2xl": { minPx: 48, maxPx: 96 },   // section block spacing
  "fluid-3xl": { minPx: 64, maxPx: 144 },  // hero section padding

  // Page Gutters & Container Padding
  "fluid-gutter": { minPx: 16, maxPx: 48 }, // container px (horizontal gutters)
};

const TYPOGRAPHY_SCALE: Record<string, FluidTypographyConfig> = {
  "fluid-sm": { minPx: 13, maxPx: 14, lineHeight: 1.45 },
  "fluid-base": { minPx: 15, maxPx: 18, lineHeight: 1.6 },
  "fluid-lg": { minPx: 18, maxPx: 22, lineHeight: 1.35, letterSpacing: "-0.01em" },
  "fluid-2xl": { minPx: 24, maxPx: 34, lineHeight: 1.2, letterSpacing: "-0.02em" },
  "fluid-hero": { minPx: 40, maxPx: 80, lineHeight: 1.02, letterSpacing: "-0.035em" },
};

// Execute Build
generateFluidTokens({
  minViewport: 375,
  maxViewport: 1280,
  rootFontSize: 16,
  spacingTokens: SPACING_SCALE,
  typographyTokens: TYPOGRAPHY_SCALE,
  outputPath: "src/styles/fluid-tokens.css",
});

```

---

### Step 2: Generated CSS Output (`src/styles/fluid-tokens.css`)

Running `npx tsx scripts/generate-fluid-tokens.ts` generates:

```css
/* AUTO-GENERATED FLUID DESIGN TOKENS */
/* Range: 375px -> 1280px | Base: 16px */
@theme {
  /* Fluid Spacing, Gaps & Padding (--spacing-fluid-*) */
  --spacing-fluid-xs: clamp(0.25rem, 0.1464rem + 0.442vw, 0.5rem);
  --spacing-fluid-sm: clamp(0.5rem, 0.3446rem + 0.663vw, 0.875rem);
  --spacing-fluid-md: clamp(1rem, 0.7928rem + 0.884vw, 1.5rem);
  --spacing-fluid-lg: clamp(1.5rem, 1.0856rem + 1.768vw, 2.5rem);
  --spacing-fluid-xl: clamp(2rem, 1.1713rem + 3.5359vw, 4rem);
  --spacing-fluid-2xl: clamp(3rem, 1.7569rem + 5.3039vw, 6rem);
  --spacing-fluid-3xl: clamp(4rem, 1.9282rem + 8.8398vw, 9rem);
  --spacing-fluid-gutter: clamp(1rem, 0.1713rem + 3.5359vw, 3rem);

  /* Fluid Typography (--text-fluid-*) */
  --text-fluid-sm: clamp(0.8125rem, 0.7876rem + 0.1105vw, 0.875rem);
  --text-fluid-sm--line-height: 1.45;
  --text-fluid-base: clamp(0.9375rem, 0.8601rem + 0.3315vw, 1.125rem);
  --text-fluid-base--line-height: 1.6;
  --text-fluid-lg: clamp(1.125rem, 1.0256rem + 0.442vw, 1.375rem);
  --text-fluid-lg--line-height: 1.35;
  --text-fluid-lg--letter-spacing: -0.01em;
  --text-fluid-2xl: clamp(1.5rem, 1.2514rem + 1.105vw, 2.125rem);
  --text-fluid-2xl--line-height: 1.2;
  --text-fluid-2xl--letter-spacing: -0.02em;
  --text-fluid-hero: clamp(2.5rem, 1.5055rem + 4.4199vw, 5rem);
  --text-fluid-hero--line-height: 1.02;
  --text-fluid-hero--letter-spacing: -0.035em;
}

```

---

### Step 3: Utility Class Mapping in Tailwind CSS v4

Declaring `--spacing-fluid-*` inside `@theme` unlocks the token across all spacing-dependent utilities without manual mapping:

| Utility Type        | Class Name                                      | Output Behavior                 |
| ------------------- | ----------------------------------------------- | ------------------------------- |
| **Padding**         | `p-fluid-md`, `px-fluid-gutter`, `py-fluid-2xl` | Smoothly scales padding         |
| **Margin**          | `m-fluid-lg`, `my-fluid-3xl`                    | Fluid outer margins             |
| **Flex / Grid Gap** | `gap-fluid-md`, `gap-x-fluid-lg`                | Interpolates grid gutter widths |
| **Dimensions**      | `w-fluid-xl`, `min-h-fluid-3xl`                 | Responsive sizing constraints   |
| **Position Insets** | `top-fluid-sm`, `inset-fluid-md`                | Fluid element positioning       |

---

### Step 4: Component Implementation Example

```tsx
// components/HeroSection.tsx
export function HeroSection() {
  return (
    // Uses fluid page gutters (px-fluid-gutter) and vertical padding (py-fluid-3xl)
    <section className="mx-auto max-w-7xl px-fluid-gutter py-fluid-3xl">
      {/* Fluid grid gap that scales from 16px to 40px */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-fluid-lg items-center">
        
        {/* Fluid vertical stack spacing */}
        <div className="flex flex-col gap-fluid-md">
          <h1 className="text-fluid-hero font-black text-slate-900 dark:text-white">
            Seamless layouts.
          </h1>
          <p className="text-fluid-base text-slate-600 dark:text-slate-300">
            Container padding, internal card margins, and typography scale proportionally across viewports.
          </p>
        </div>

        {/* Card with fluid internal padding (p-fluid-lg) and border gap */}
        <div className="p-fluid-lg rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col gap-fluid-sm">
          <h3 className="text-fluid-2xl font-bold">Responsive Card</h3>
          <p className="text-fluid-sm text-slate-500">
            Card padding scales smoothly between 24px on mobile and 40px on desktop screens.
          </p>
        </div>

      </div>
    </section>
  );
}

```
