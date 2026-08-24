Exporting Tailwind CSS tokens to the **DTCG (Design Tokens Community Group)** standard requires converting your CSS variable definitions and Tailwind theme values into the standard `{ "$value": "...", "$type": "..." }` schema.

---

### 1. Understanding the DTCG JSON Format

The DTCG specification requires tokens to declare their `$value`, `$type` (such as `color`, `dimension`, `fontFamily`, `number`), and optional `$description`:

```json
{
  "color": {
    "brand": {
      "primary": {
        "$value": "#4f46e5",
        "$type": "color",
        "$description": "Primary brand action color"
      }
    }
  },
  "spacing": {
    "md": {
      "$value": "16px",
      "$type": "dimension"
    }
  },
  "borderRadius": {
    "lg": {
      "$value": "12px",
      "$type": "dimension"
    }
  }
}

```

---

### 2. Automated Exporter Script (`export-tokens.ts`)

This Node.js script reads your Tailwind tokens (from CSS custom properties, `@theme`, or a token map) and transforms them into DTCG-compliant JSON.

```bash
npm install -D typescript @types/node

```

```typescript
// scripts/export-tokens.ts
import * as fs from "node:fs";
import * as path from "node:path";

interface DtcgToken {
  $value: string | number;
  $type: "color" | "dimension" | "fontFamily" | "fontWeight" | "duration" | "number";
  $description?: string;
}

type DtcgGroup = {
  [key: string]: DtcgToken | DtcgGroup;
};

// 1. Raw Tailwind Theme Dictionary
const rawTokens = {
  color: {
    primary: {
      default: "#6366f1",
      hover: "#4f46e5",
      foreground: "#ffffff",
    },
    surface: {
      default: "#ffffff",
      muted: "#f8fafc",
      foreground: "#0f172a",
    },
    danger: {
      default: "#f43f5e",
      foreground: "#ffffff",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    full: "9999px",
  },
  fontSize: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "18px",
    xl: "20px",
  },
};

// 2. Transformer Helper: Determines DTCG $type by key hierarchy
function transformToDtcg(obj: Record<string, any>, category?: string): DtcgGroup {
  const result: DtcgGroup = {};

  for (const [key, val] of Object.entries(obj)) {
    const currentCategory = category || key;

    if (typeof val === "object" && val !== null) {
      result[key] = transformToDtcg(val, currentCategory);
    } else {
      let type: DtcgToken["$type"] = "dimension";

      if (currentCategory.toLowerCase().includes("color")) {
        type = "color";
      } else if (currentCategory.toLowerCase().includes("font")) {
        type = "dimension";
      } else if (currentCategory.toLowerCase().includes("weight")) {
        type = "fontWeight";
      } else if (currentCategory.toLowerCase().includes("duration")) {
        type = "duration";
      }

      result[key] = {
        $value: val,
        $type: type,
      };
    }
  }

  return result;
}

// 3. Generate and write JSON file
function generateTokensFile() {
  const dtcgOutput = transformToDtcg(rawTokens);
  const outputPath = path.resolve(process.cwd(), "tokens.dtcg.json");

  fs.writeFileSync(outputPath, JSON.stringify(dtcgOutput, null, 2), "utf-8");
  console.log(`✅ Successfully exported DTCG tokens to: ${outputPath}`);
}

generateTokensFile();

```

Run the generator:

```bash
npx tsx scripts/export-tokens.ts

```

---

### 3. Generated DTCG Output (`tokens.dtcg.json`)

```json
{
  "color": {
    "primary": {
      "default": {
        "$value": "#6366f1",
        "$type": "color"
      },
      "hover": {
        "$value": "#4f46e5",
        "$type": "color"
      },
      "foreground": {
        "$value": "#ffffff",
        "$type": "color"
      }
    },
    "surface": {
      "default": {
        "$value": "#ffffff",
        "$type": "color"
      }
    }
  },
  "spacing": {
    "md": {
      "$value": "16px",
      "$type": "dimension"
    }
  },
  "borderRadius": {
    "lg": {
      "$value": "12px",
      "$type": "dimension"
    }
  }
}

```

---

### 4. Importing Tokens into Figma

**Option A: Using Tokens Studio for Figma (Figma Plugin)**

1. Open your Figma file and launch the **Tokens Studio** plugin.
2. Go to **Settings** > **Load from file / Sync Providers**.
3. Select **JSON**, paste the contents of `tokens.dtcg.json`, or link directly to your Git repository holding the token file.
4. Click **Apply to Document** to generate styles and Figma Variables automatically.

**Option B: Figma Native REST API (Automated CI/CD Sync)**
For automated enterprise pipelines, push your JSON file directly to Figma's Variables API:

```typescript
// Example POST payload to Figma REST API endpoint: /v1/files/{file_key}/variables
const figmaApiPayload = {
  variableCollections: [
    { action: "CREATE", id: "coll_brand", name: "Brand Tokens" },
  ],
  variableModes: [
    { action: "CREATE", id: "mode_light", name: "Light", variableCollectionId: "coll_brand" },
  ],
  variables: [
    {
      action: "CREATE",
      id: "var_primary",
      name: "color/primary/default",
      variableCollectionId: "coll_brand",
      resolvedType: "COLOR",
      valuesByMode: {
        mode_light: { r: 0.388, g: 0.4, b: 0.945, a: 1 }, // sRGB normalized
      },
    },
  ],
};

```

---

### Key Conversion Rules

* **Color Format Compatibility:** While Tailwind v4 supports `oklch()` natively, Figma currently requires standard **HEX**, **RGB**, or normalized `[0..1] sRGB` values in token imports. Convert OKLCH values to HEX before exporting if targeting Figma Variables.
* **Unit Normalization:** Figma Tokens requires explicit units for dimensions (`px`, `rem`). Ensure spacing scales contain valid unit suffixes (e.g., `16px` rather than unitless numbers).
