*** copy Show me how to package dynamic fluid typography into a reusable Tailwind CSS v4 CSS-first preset.md ***

In Tailwind CSS v4, presets and plugins are authored directly in CSS. You package reusable systems as standalone `.css` files that expose `@theme` tokens, root custom properties, and `@utility` rules, which consuming projects can import with a single `@import` statement.

---

### Step 1: Create the Reusable Preset File

Create a standalone CSS file—for instance, `packages/tailwind-fluid-preset/index.css` (or publish it to npm as `@your-org/tailwind-fluid-preset`):

```css
/* ==========================================================================
   Tailwind CSS v4 Fluid Typography Preset
   ========================================================================== */

/* 1. Base configuration variables on :root */
:root {
  /* Default container boundaries (in rem factors: 320px to 1280px) */
  --fluid-min-w: 20;
  --fluid-max-w: 80;

  /* Universal Fluid Calculation Engine */
  --fluid-engine: calc(
    (var(--min-font) * 1rem) + 
    (var(--max-font) - var(--min-font)) * 
    (100cqi - (var(--fluid-min-w) * 1rem)) / 
    (var(--fluid-max-w) - var(--fluid-min-w))
  );
}

/* 2. Parametric Typography Utilities */
@utility text-fluid-xs {
  --min-font: 0.75;  /* 12px */
  --max-font: 0.875; /* 14px */
  font-size: clamp(calc(var(--min-font) * 1rem), var(--fluid-engine), calc(var(--max-font) * 1rem));
}

@utility text-fluid-sm {
  --min-font: 0.875; /* 14px */
  --max-font: 1;     /* 16px */
  font-size: clamp(calc(var(--min-font) * 1rem), var(--fluid-engine), calc(var(--max-font) * 1rem));
}

@utility text-fluid-base {
  --min-font: 1;     /* 16px */
  --max-font: 1.125; /* 18px */
  font-size: clamp(calc(var(--min-font) * 1rem), var(--fluid-engine), calc(var(--max-font) * 1rem));
}

@utility text-fluid-lg {
  --min-font: 1.125; /* 18px */
  --max-font: 1.375; /* 22px */
  font-size: clamp(calc(var(--min-font) * 1rem), var(--fluid-engine), calc(var(--max-font) * 1rem));
}

@utility text-fluid-xl {
  --min-font: 1.25;  /* 20px */
  --max-font: 1.75;  /* 28px */
  font-size: clamp(calc(var(--min-font) * 1rem), var(--fluid-engine), calc(var(--max-font) * 1rem));
}

@utility text-fluid-2xl {
  --min-font: 1.5;   /* 24px */
  --max-font: 2.25;  /* 36px */
  font-size: clamp(calc(var(--min-font) * 1rem), var(--fluid-engine), calc(var(--max-font) * 1rem));
}

@utility text-fluid-3xl {
  --min-font: 1.875; /* 30px */
  --max-font: 3;     /* 48px */
  font-size: clamp(calc(var(--min-font) * 1rem), var(--fluid-engine), calc(var(--max-font) * 1rem));
}

@utility text-fluid-display {
  --min-font: 2.25;  /* 36px */
  --max-font: 4.5;   /* 72px */
  font-size: clamp(calc(var(--min-font) * 1rem), var(--fluid-engine), calc(var(--max-font) * 1rem));
}

```

---

### Step 2: Package Setup (`package.json`)

If publishing to npm or a private registry, structure `package.json` with an export map pointing to the CSS file:

```json
{
  "name": "@your-org/tailwind-fluid-preset",
  "version": "1.0.0",
  "main": "index.css",
  "style": "index.css",
  "exports": {
    ".": "./index.css"
  },
  "files": [
    "index.css"
  ],
  "peerDependencies": {
    "tailwindcss": ">=4.0.0"
  }
}

```

---

### Step 3: Consuming the Preset in Any App

In any project using Tailwind CSS v4, import your preset directly into the global stylesheet:

```css
/* app/globals.css or src/index.css */
@import "tailwindcss";
@import "@your-org/tailwind-fluid-preset";

/* Optional: Override container boundaries globally */
:root {
  --fluid-min-w: 24;  /* Start scaling at 384px */
  --fluid-max-w: 90;  /* Stop scaling at 1440px */
}

```

---

### Step 4: Component Usage

```jsx
export function HeroBanner() {
  return (
    <div className="@container w-full">
      <div className="p-6 @md:p-12 bg-slate-950 text-white rounded-2xl">
        
        {/* Scales fluidly across container dimensions */}
        <h1 className="text-fluid-display font-extrabold tracking-tight">
          Adaptive Architecture
        </h1>

        <p className="mt-4 text-fluid-base text-slate-300 max-w-xl">
          Zero build plugins. Fully CSS-native design tokens.
        </p>

        {/* Ad-hoc override on a specific component */}
        <div style={{ "--min-font": "1.25", "--max-font": "2.5" }}>
          <h3 className="text-fluid-base font-semibold text-sky-400 mt-6">
            Custom Bounds Override
          </h3>
        </div>

      </div>
    </div>
  );
}

```
