*** copy Create a CSS-only clamp() calculator using custom properties.md ***

You can build a purely dynamic, **CSS-only linear interpolation engine** using CSS custom properties (`var()`) and `calc()`.

By defining your viewport boundaries and target pixel values as unitless variables in `:root`, the mathematical formula calculates the exact slope and $y$-intercept entirely inside standard CSS—no build steps or preprocessors required.

---

### Step 1: Pure CSS Clamp Calculator Engine

The linear equation $y = mx + b$ converts to `calc()` by calculating:

* **Slope ($m$):** `(max_size - min_size) / (max_viewport - min_viewport)`
* **$y$-Intercept ($b$):** `min_size - (min_viewport * slope)`
* **Preferred Value:** `calc(b_rem + slope * 100vw)`

Add this snippet to your base stylesheet or `globals.css`:

```css
/* ==========================================================================
   PURE CSS CLAMP CALCULATOR ENGINE
   ========================================================================== */

:root {
  /* 1. Global Viewport Anchors (Unitless Pixels) */
  --fluid-min-width: 375;
  --fluid-max-width: 1280;
  --fluid-base-font: 16;

  /* ------------------------------------------------------------------------
     Formula Helper Functions (Pure CSS)
     ------------------------------------------------------------------------ */

  /* Slope = (MaxPx - MinPx) / (MaxVw - MinVw) */
  /* Preferred Value = (MinPx - MinVw * Slope) / BaseFont * 1rem + (Slope * 100vw) */

  /* --- FLUID FONT SIZES (MinPx, MaxPx) --- */

  /* Body text: 15px -> 18px */
  --font-min-base: 15;
  --font-max-base: 18;
  --slope-base: calc((var(--font-max-base) - var(--font-min-base)) / (var(--fluid-max-width) - var(--fluid-min-width)));
  --intercept-base: calc((var(--font-min-base) - (var(--fluid-min-width) * var(--slope-base))) / var(--fluid-base-font) * 1rem);
  --font-fluid-base: clamp(
    calc(var(--font-min-base) / var(--fluid-base-font) * 1rem),
    calc(var(--intercept-base) + (var(--slope-base) * 100vw)),
    calc(var(--font-max-base) / var(--fluid-base-font) * 1rem)
  );

  /* Title Heading: 24px -> 36px */
  --font-min-title: 24;
  --font-max-title: 36;
  --slope-title: calc((var(--font-max-title) - var(--font-min-title)) / (var(--fluid-max-width) - var(--fluid-min-width)));
  --intercept-title: calc((var(--font-min-title) - (var(--fluid-min-width) * var(--slope-title))) / var(--fluid-base-font) * 1rem);
  --font-fluid-title: clamp(
    calc(var(--font-min-title) / var(--fluid-base-font) * 1rem),
    calc(var(--intercept-title) + (var(--slope-title) * 100vw)),
    calc(var(--font-max-title) / var(--fluid-base-font) * 1rem)
  );

  /* Hero Display: 36px -> 72px */
  --font-min-hero: 36;
  --font-max-hero: 72;
  --slope-hero: calc((var(--font-max-hero) - var(--font-min-hero)) / (var(--fluid-max-width) - var(--fluid-min-width)));
  --intercept-hero: calc((var(--font-min-hero) - (var(--fluid-min-width) * var(--slope-hero))) / var(--fluid-base-font) * 1rem);
  --font-fluid-hero: clamp(
    calc(var(--font-min-hero) / var(--fluid-base-font) * 1rem),
    calc(var(--intercept-hero) + (var(--slope-hero) * 100vw)),
    calc(var(--font-max-hero) / var(--fluid-base-font) * 1rem)
  );

  /* --- FLUID SPACING & GAPPINGS --- */

  /* Standard Spacing: 16px -> 32px */
  --space-min-md: 16;
  --space-max-md: 32;
  --slope-space-md: calc((var(--space-max-md) - var(--space-min-md)) / (var(--fluid-max-width) - var(--fluid-min-width)));
  --intercept-space-md: calc((var(--space-min-md) - (var(--fluid-min-width) * var(--slope-space-md))) / var(--fluid-base-font) * 1rem);
  --space-fluid-md: clamp(
    calc(var(--space-min-md) / var(--fluid-base-font) * 1rem),
    calc(var(--intercept-space-md) + (var(--slope-space-md) * 100vw)),
    calc(var(--space-max-md) / var(--fluid-base-font) * 1rem)
  );

  /* Page Gutter: 16px -> 64px */
  --gutter-min: 16;
  --gutter-max: 64;
  --slope-gutter: calc((var(--gutter-max) - var(--gutter-min)) / (var(--fluid-max-width) - var(--fluid-min-width)));
  --intercept-gutter: calc((var(--gutter-min) - (var(--fluid-min-width) * var(--slope-gutter))) / var(--fluid-base-font) * 1rem);
  --space-fluid-gutter: clamp(
    calc(var(--gutter-min) / var(--fluid-base-font) * 1rem),
    calc(var(--intercept-gutter) + (var(--slope-gutter) * 100vw)),
    calc(var(--gutter-max) / var(--fluid-base-font) * 1rem)
  );
}

```

---

### Step 2: One-Off Dynamic Clamp Mixin for Scoped Elements

If an individual component needs arbitrary bounds without polluting `:root`, declare local custom properties directly on that selector:

```css
/* Reusable inline fluid property wrapper */
.fluid-custom-box {
  /* Set parameters locally in pixels (unitless) */
  --min-px: 12;
  --max-px: 40;
  --min-vw: 320;
  --max-vw: 1024;

  /* Automatic local calculation */
  --slope: calc((var(--max-px) - var(--min-px)) / (var(--max-vw) - var(--min-vw)));
  --intercept: calc((var(--min-px) - (var(--min-vw) * var(--slope))) / 16 * 1rem);
  
  /* Apply fluid value to padding, margin, or font-size */
  padding: clamp(
    calc(var(--min-px) / 16 * 1rem),
    calc(var(--intercept) + (var(--slope) * 100vw)),
    calc(var(--max-px) / 16 * 1rem)
  );
}

```

---

### Step 3: Integrating with Tailwind CSS v4 `@theme`

Bind these computed variables to Tailwind utility classes inside `@theme`:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  --text-fluid-base: var(--font-fluid-base);
  --text-fluid-title: var(--font-fluid-title);
  --text-fluid-hero: var(--font-fluid-hero);

  --spacing-fluid-md: var(--space-fluid-md);
  --spacing-fluid-gutter: var(--space-fluid-gutter);
}

```

---

### Step 4: Practical Usage in HTML / JSX

```html
<section class="px-[var(--space-fluid-gutter)] py-[var(--space-fluid-md)] max-w-6xl mx-auto">
  <h1 class="text-[length:var(--font-fluid-hero)] font-black leading-tight tracking-tight">
    Computed Fluid Typography
  </h1>
  
  <p class="text-[length:var(--font-fluid-base)] leading-relaxed text-slate-600 mt-4">
    This font size interpolates smoothly from 15px at 375px viewport to 18px at 1280px viewport without a single build tool or JavaScript function.
  </p>

  <div class="mt-8 p-[var(--space-fluid-md)] rounded-2xl bg-slate-100 border border-slate-200">
    <h2 class="text-[length:var(--font-fluid-title)] font-bold">
      Fluid Spacing & Padding Box
    </h2>
  </div>
</section>

```

---

### Key Advantages of the CSS-Only Approach

* **Zero Build Step:** Works natively in plain CSS, static HTML, or any JS framework without preprocessor plugins.
* **Global Theming Overrides:** Updating `--fluid-min-width` or `--fluid-max-width` on `:root` dynamically recalibrates every single typography and spacing token across the entire site instantly.
* **Full Zoom Accessibility:** Because minimum and maximum boundaries output `rem` values, text still respects user-defined browser font zoom settings.
