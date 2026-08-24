To export tokens for **Figma Tokens Studio** (formerly Figma Tokens / W3C Design Tokens Community Group format) alongside your Tailwind v4 CSS, the generator must output a structured JSON schema containing explicit `$type`, `$value`, and `$description` properties.

Because Figma does not natively calculate runtime `clamp()` equations inside canvas artboards, the standard practice is to export:

1. **Desktop and Mobile resolved values** as mode-switchable pixel values (for Figma design canvas application).
2. **The CSS `clamp()` expression string** (in custom properties / metadata) so design and engineering share the exact production token contract.

---

### Step 1: Extended TypeScript Generator (`scripts/generate-tokens-studio.ts`)

```typescript
// scripts/generate-tokens-studio.ts
import * as fs from "node:fs";
import * as path from "node:path";

export type FluidUnit = "vw" | "cqw";

export interface PixelTokenConfig {
  minPx: number;
  maxPx: number;
  lineHeight?: number | string;
  letterSpacing?: string;
  description?: string;
}

export interface GeneratorConfig {
  minViewport: number;
  maxViewport: number;
  rootFontSize?: number;
  unit?: FluidUnit;
  spacing: Record<string, PixelTokenConfig>;
  typography?: Record<string, PixelTokenConfig>;
  outputCssPath: string;
  outputJsonPath: string;
}

/**
 * Calculates a linear clamp(minRem, interceptRem + slopeUnit, maxRem) formula
 */
export function calculateClamp(
  minPx: number,
  maxPx: number,
  minVw: number,
  maxVw: number,
  rootFont = 16,
  unit: FluidUnit = "vw"
): string {
  if (minPx === maxPx) {
    return `${(minPx / rootFont).toFixed(4).replace(/\.?0+$/, "")}rem`;
  }

  const slope = (maxPx - minPx) / (maxVw - minVw);
  const yIntercept = minPx - minVw * slope;

  const minRem = (minPx / rootFont).toFixed(4).replace(/\.?0+$/, "");
  const maxRem = (maxPx / rootFont).toFixed(4).replace(/\.?0+$/, "");
  const interceptRem = (yIntercept / rootFont).toFixed(4).replace(/\.?0+$/, "");
  const unitVal = (slope * 100).toFixed(4).replace(/\.?0+$/, "");

  const sign = yIntercept >= 0 ? "+" : "-";
  const absIntercept = Math.abs(Number(interceptRem));

  return `clamp(${minRem}rem, ${absIntercept}rem ${sign} ${unitVal}${unit}, ${maxRem}rem)`;
}

/**
 * Builds the Figma Tokens Studio (DTCG compatible) JSON structure
 */
export function buildTokensStudioJson(config: GeneratorConfig) {
  const { minViewport, maxViewport, rootFontSize = 16, unit = "vw", spacing, typography = {} } = config;

  const spacingTokens: Record<string, any> = {};
  const typographyTokens: Record<string, any> = {};

  // 1. Process Spacing Tokens
  for (const [key, token] of Object.entries(spacing)) {
    const clampFormula = calculateClamp(token.minPx, token.maxPx, minViewport, maxViewport, rootFontSize, unit);

    spacingTokens[key] = {
      $type: "spacing",
      $value: `${token.maxPx}px`, // Default Desktop Canvas Value
      $description: token.description || `Fluid space (${token.minPx}px @ ${minViewport}px -> ${token.maxPx}px @ ${maxViewport}px)`,
      $extensions: {
        "studio.tokens": {
          modify: {
            min: `${token.minPx}px`,
            max: `${token.maxPx}px`,
            clamp: clampFormula,
          },
        },
      },
    };
  }

  // 2. Process Typography Tokens
  for (const [key, token] of Object.entries(typography)) {
    const clampFormula = calculateClamp(token.minPx, token.maxPx, minViewport, maxViewport, rootFontSize, unit);

    typographyTokens[key] = {
      $type: "typography",
      $value: {
        fontSize: `${token.maxPx}px`,
        lineHeight: token.lineHeight ? String(token.lineHeight) : "1.5",
        letterSpacing: token.letterSpacing || "0px",
        fontFamily: "{fontFamilies.sans}",
        fontWeight: "400",
      },
      $description: token.description || `Fluid type (${token.minPx}px -> ${token.maxPx}px)`,
      $extensions: {
        "studio.tokens": {
          modify: {
            minFontSize: `${token.minPx}px`,
            maxFontSize: `${token.maxPx}px`,
            clamp: clampFormula,
          },
        },
      },
    };
  }

  // Tokens Studio Multi-set Structure
  return {
    global: {
      fontFamilies: {
        sans: {
          $type: "fontFamilies",
          $value: "Inter, system-ui, sans-serif",
        },
      },
      spacing: spacingTokens,
      typography: typographyTokens,
    },
    $themes: [
      {
        id: "fluid-default",
        name: "Fluid Production Set",
        selectedTokenSets: {
          global: "enabled",
        },
      },
    ],
    $metadata: {
      generator: "tailwind-fluid-theme-engine",
      viewportBounds: { min: `${minViewport}px`, max: `${maxViewport}px` },
      rootFontSize: `${rootFontSize}px`,
    },
  };
}

/**
 * Builds CSS output for Tailwind v4 @theme
 */
export function buildTailwindCss(config: GeneratorConfig): string {
  const { minViewport, maxViewport, rootFontSize = 16, unit = "vw", spacing, typography = {} } = config;
  const lines: string[] = [
    `/* AUTO-GENERATED TAILWIND V4 FLUID THEME TOKENS */`,
    `/* Viewport: ${minViewport}px -> ${maxViewport}px | Unit: ${unit} */`,
    `@theme {`,
  ];

  if (Object.keys(spacing).length > 0) {
    lines.push(`  /* Spacing */`);
    for (const [key, token] of Object.entries(spacing)) {
      lines.push(`  --spacing-${key}: ${calculateClamp(token.minPx, token.maxPx, minViewport, maxViewport, rootFontSize, unit)};`);
    }
    lines.push(``);
  }

  if (Object.keys(typography).length > 0) {
    lines.push(`  /* Typography */`);
    for (const [key, token] of Object.entries(typography)) {
      lines.push(`  --text-${key}: ${calculateClamp(token.minPx, token.maxPx, minViewport, maxViewport, rootFontSize, unit)};`);
      if (token.lineHeight !== undefined) lines.push(`  --text-${key}--line-height: ${token.lineHeight};`);
      if (token.letterSpacing !== undefined) lines.push(`  --text-${key}--letter-spacing: ${token.letterSpacing};`);
    }
  }

  lines.push(`}`);
  return lines.join("\n");
}

export function exportDualTokens(config: GeneratorConfig) {
  // 1. Generate & Write CSS
  const cssContent = buildTailwindCss(config);
  const cssPath = path.resolve(process.cwd(), config.outputCssPath);
  fs.mkdirSync(path.dirname(cssPath), { recursive: true });
  fs.writeFileSync(cssPath, cssContent, "utf-8");

  // 2. Generate & Write Tokens Studio JSON
  const jsonContent = buildTokensStudioJson(config);
  const jsonPath = path.resolve(process.cwd(), config.outputJsonPath);
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  fs.writeFileSync(jsonPath, JSON.stringify(jsonContent, null, 2), "utf-8");

  console.log(`✅ CSS Tokens -> ${config.outputCssPath}`);
  console.log(`✅ Tokens Studio JSON -> ${config.outputJsonPath}`);
}

// ---------------------------------------------------------------------------
// Execution Entrypoint
// ---------------------------------------------------------------------------

const SPACING_TOKENS: Record<string, PixelTokenConfig> = {
  "fluid-xs": { minPx: 4, maxPx: 8, description: "Micro insets & tag padding" },
  "fluid-sm": { minPx: 8, maxPx: 14, description: "Compact button & card insets" },
  "fluid-md": { minPx: 16, maxPx: 24, description: "Standard component padding & grid gaps" },
  "fluid-lg": { minPx: 24, maxPx: 40, description: "Section gaps & card spacing" },
  "fluid-xl": { minPx: 32, maxPx: 64, description: "Module dividers & layout blocks" },
  "fluid-gutter": { minPx: 16, maxPx: 48, description: "Responsive page margin gutters" },
};

const TYPOGRAPHY_TOKENS: Record<string, PixelTokenConfig> = {
  "fluid-sm": { minPx: 13, maxPx: 14, lineHeight: 1.45 },
  "fluid-base": { minPx: 15, maxPx: 18, lineHeight: 1.5 },
  "fluid-title": { minPx: 24, maxPx: 36, lineHeight: 1.2, letterSpacing: "-0.015em" },
  "fluid-hero": { minPx: 36, maxPx: 72, lineHeight: 1.08, letterSpacing: "-0.025em" },
};

exportDualTokens({
  minViewport: 375,
  maxViewport: 1280,
  rootFontSize: 16,
  unit: "vw",
  spacing: SPACING_TOKENS,
  typography: TYPOGRAPHY_TOKENS,
  outputCssPath: "src/styles/fluid-tokens.css",
  outputJsonPath: "tokens/tokens-studio.json",
});

```

---

### Step 2: Output JSON Format Sample (`tokens/tokens-studio.json`)

Running the script produces valid Tokens Studio JSON that can be imported directly into the plugin:

```json
{
  "global": {
    "fontFamilies": {
      "sans": {
        "$type": "fontFamilies",
        "$value": "Inter, system-ui, sans-serif"
      }
    },
    "spacing": {
      "fluid-md": {
        "$type": "spacing",
        "$value": "24px",
        "$description": "Standard component padding & grid gaps",
        "$extensions": {
          "studio.tokens": {
            "modify": {
              "min": "16px",
              "max": "24px",
              "clamp": "clamp(1rem, 0.7928rem + 0.884vw, 1.5rem)"
            }
          }
        }
      }
    },
    "typography": {
      "fluid-hero": {
        "$type": "typography",
        "$value": {
          "fontSize": "72px",
          "lineHeight": "1.08",
          "letterSpacing": "-0.025em",
          "fontFamily": "{fontFamilies.sans}",
          "fontWeight": "400"
        },
        "$description": "Fluid type (36px -> 72px)",
        "$extensions": {
          "studio.tokens": {
            "modify": {
              "minFontSize": "36px",
              "maxFontSize": "72px",
              "clamp": "clamp(2.25rem, 1.3177rem + 3.9779vw, 4.5rem)"
            }
          }
        }
      }
    }
  },
  "$themes": [
    {
      "id": "fluid-default",
      "name": "Fluid Production Set",
      "selectedTokenSets": {
        "global": "enabled"
      }
    }
  ]
}

```

---

### Step 3: Importing into Figma Tokens Studio

1. Open the **Tokens Studio for Figma** plugin.
2. Go to **Settings > Load from File** (or connect your GitHub repository sync).
3. Select `tokens/tokens-studio.json`.
4. The plugin loads your fluid spacing scale and typography tokens as native Figma variables and styles, while retaining the exact production `clamp()` definitions in token extensions for code export and documentation.
