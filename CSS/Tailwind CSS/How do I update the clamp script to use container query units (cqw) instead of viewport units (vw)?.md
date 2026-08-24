To adapt the TypeScript clamp script to use container query width units (`cqw` where $1\text{cqw} = 1\%$ of the container's inline size), the interpolation math is mapped against **container width bounds** ($C_{\min}$ and $C_{\max}$) instead of viewport bounds.

---

### Step 1: Updated TypeScript Generator Script (`scripts/generate-container-tokens.ts`)

```typescript
// scripts/generate-container-tokens.ts
import * as fs from "node:fs";
import * as path from "node:path";

export type UnitType = "vw" | "cqw" | "cqh" | "cqmin" | "cqmax";

interface FluidTokenConfig {
  minPx: number;
  maxPx: number;
  lineHeight?: number | string;
  letterSpacing?: string;
}

interface GeneratorOptions {
  minContainer?: number; // Default: 320px (compact container/sidebar)
  maxContainer?: number; // Default: 800px (full column width)
  rootFontSize?: number; // Default: 16px
  unit?: UnitType;       // Default: "cqw"
  typographyTokens?: Record<string, FluidTokenConfig>;
  spacingTokens?: Record<string, FluidTokenConfig>;
  outputPath: string;
}

/**
 * Calculates a CSS clamp() formula parameterized for container query units (cqw)
 */
export function calculateContainerClamp(
  minPx: number,
  maxPx: number,
  minCq = 320,
  maxCq = 800,
  rootFont = 16,
  unit: UnitType = "cqw"
): string {
  if (minPx === maxPx) {
    return `${(minPx / rootFont).toFixed(4)}rem`;
  }

  const slope = (maxPx - minPx) / (maxCq - minCq);
  const yIntercept = minPx - minCq * slope;

  const minRem = (minPx / rootFont).toFixed(4).replace(/\.?0+$/, "");
  const maxRem = (maxPx / rootFont).toFixed(4).replace(/\.?0+$/, "");
  const interceptRem = (yIntercept / rootFont).toFixed(4).replace(/\.?0+$/, "");
  const unitValue = (slope * 100).toFixed(4).replace(/\.?0+$/, "");

  const sign = yIntercept >= 0 ? "+" : "-";
  const absIntercept = Math.abs(Number(interceptRem));

  return `clamp(${minRem}rem, ${absIntercept}rem ${sign} ${unitValue}${unit}, ${maxRem}rem)`;
}

export function generateContainerTokens(options: GeneratorOptions) {
  const {
    minContainer = 320,
    maxContainer = 800,
    rootFontSize = 16,
    unit = "cqw",
    typographyTokens = {},
    spacingTokens = {},
    outputPath,
  } = options;

  const lines: string[] = [
    `/* AUTO-GENERATED CONTAINER-QUERY FLUID TOKENS */`,
    `/* Container Range: ${minContainer}px -> ${maxContainer}px | Unit: ${unit} */`,
    `@theme {`,
  ];

  // 1. Spacing & Padding Scale (Container Relative)
  if (Object.keys(spacingTokens).length > 0) {
    lines.push(`  /* Fluid Container Spacing (--spacing-cq-*) */`);
    for (const [name, config] of Object.entries(spacingTokens)) {
      const clampValue = calculateContainerClamp(
        config.minPx,
        config.maxPx,
        minContainer,
        maxContainer,
        rootFontSize,
        unit
      );
      lines.push(`  --spacing-${name}: ${clampValue};`);
    }
    lines.push(``);
  }

  // 2. Typography Scale (Container Relative)
  if (Object.keys(typographyTokens).length > 0) {
    lines.push(`  /* Fluid Container Typography (--text-cq-*) */`);
    for (const [name, config] of Object.entries(typographyTokens)) {
      const clampValue = calculateContainerClamp(
        config.minPx,
        config.maxPx,
        minContainer,
        maxContainer,
        rootFontSize,
        unit
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

  console.log(`✅ Container-fluid tokens generated at: ${outputPath}`);
}

// ---------------------------------------------------------------------------
// Container-Scoped Scales (Bounds: 320px -> 800px Container Width)
// ---------------------------------------------------------------------------

const CONTAINER_SPACING: Record<string, FluidTokenConfig> = {
  "cq-sm": { minPx: 12, maxPx: 20 },
  "cq-md": { minPx: 16, maxPx: 28 },
  "cq-lg": { minPx: 24, maxPx: 44 },
  "cq-xl": { minPx: 32, maxPx: 64 },
};

const CONTAINER_TYPOGRAPHY: Record<string, FluidTokenConfig> = {
  "cq-sm": { minPx: 13, maxPx: 14, lineHeight: 1.45 },
  "cq-base": { minPx: 14, maxPx: 16, lineHeight: 1.5 },
  "cq-title": { minPx: 18, maxPx: 26, lineHeight: 1.25, letterSpacing: "-0.015em" },
  "cq-hero": { minPx: 24, maxPx: 48, lineHeight: 1.1, letterSpacing: "-0.025em" },
};

generateContainerTokens({
  minContainer: 320,
  maxContainer: 800,
  rootFontSize: 16,
  unit: "cqw",
  spacingTokens: CONTAINER_SPACING,
  typographyTokens: CONTAINER_TYPOGRAPHY,
  outputPath: "src/styles/container-tokens.css",
});

```

---

### Step 2: Generated CSS Output (`src/styles/container-tokens.css`)

Running the script outputs `@theme` rules using `cqw` units:

```css
/* AUTO-GENERATED CONTAINER-QUERY FLUID TOKENS */
/* Container Range: 320px -> 800px | Unit: cqw */
@theme {
  /* Fluid Container Spacing (--spacing-cq-*) */
  --spacing-cq-sm: clamp(0.75rem, 0.4167rem + 1.6667cqw, 1.25rem);
  --spacing-cq-md: clamp(1rem, 0.5rem + 2.5cqw, 1.75rem);
  --spacing-cq-lg: clamp(1.5rem, 0.6667rem + 4.1667cqw, 2.75rem);
  --spacing-cq-xl: clamp(2rem, 0.6667rem + 6.6667cqw, 4rem);

  /* Fluid Container Typography (--text-cq-*) */
  --text-cq-sm: clamp(0.8125rem, 0.7708rem + 0.2083cqw, 0.875rem);
  --text-cq-sm--line-height: 1.45;
  --text-cq-base: clamp(0.875rem, 0.7917rem + 0.4167cqw, 1rem);
  --text-cq-base--line-height: 1.5;
  --text-cq-title: clamp(1.125rem, 0.7917rem + 1.6667cqw, 1.625rem);
  --text-cq-title--line-height: 1.25;
  --text-cq-title--letter-spacing: -0.015em;
  --text-cq-hero: clamp(1.5rem, 0.5rem + 5cqw, 3rem);
  --text-cq-hero--line-height: 1.1;
  --text-cq-hero--letter-spacing: -0.025em;
}

```

---

### Step 3: Usage with Tailwind `@container` Directives

For container query units (`cqw`) to resolve, an ancestor element must declare `container-type: inline-size` (using Tailwind's `@container` class):

```tsx
// components/AdaptiveCard.tsx
export function AdaptiveCard() {
  return (
    // 1. Declare container context on parent wrapper
    <div className="@container">
      {/* 2. Padding (p-cq-lg), gap (gap-cq-md), and typography (text-cq-hero)
             scale directly with this component's width, whether in a sidebar
             or wide main content */}
      <article className="p-cq-lg rounded-2xl bg-surface border border-surface-border flex flex-col gap-cq-md">
        <h3 className="text-cq-hero font-extrabold text-foreground">
          Container-Fluid Card
        </h3>
        
        <p className="text-cq-base text-foreground/80">
          This layout automatically sizes its text and internal padding relative to its immediate parent container rather than the browser window viewport.
        </p>

        <div className="flex gap-cq-sm pt-2">
          <button className="px-cq-md py-cq-sm text-cq-sm font-semibold rounded-lg bg-primary text-primary-foreground">
            Action
          </button>
        </div>
      </article>
    </div>
  );
}

```

---

### Viewport (`vw`) vs. Container (`cqw`) Comparison

| Parameter            | Viewport Clamp (`vw`)                              | Container Query Clamp (`cqw`)                                                     |
| -------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------- |
| **Reference Anchor** | Entire browser window width                        | Closest ancestor with `@container` (`container-type: inline-size`)                |
| **Typical Range**    | $375\text{px} \to 1280\text{px}$                   | $320\text{px} \to 800\text{px}$                                                   |
| **Ideal For**        | Page gutters, hero banners, top-level nav          | Reusable multi-column cards, drawer sheets, sidebar widgets                       |
| **Failure Mode**     | Cards inside narrow sidebars render oversized text | Un-contained elements fallback to $0\text{cqw}$ (resolves to minimum clamp bound) |
