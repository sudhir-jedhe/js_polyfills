***  Create custom utility classes using @utility directive.md ***

In Tailwind CSS v4, custom utilities are defined using the `@utility` directive. Utilities registered with `@utility` automatically support all Tailwind modifiers, such as responsive prefixes (`md:`, `lg:`), state variants (`hover:`, `focus-visible:`), container queries (`@sm:`), and dark mode (`dark:`).

---

### Step 1: Define Custom Utilities in `globals.css`

Define static, functional, or dynamic `@utility` rules in your main stylesheet:

```css
/* app/globals.css */
@import "tailwindcss";

/* -------------------------------------------------------------------------- */
/* 1. STATIC UTILITY CLASSES                                                  */
/* -------------------------------------------------------------------------- */

/* Hide scrollbars while maintaining scrollability */
@utility no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

/* Glassmorphism frosted surface effect */
@utility glass-panel {
  background-color: color-mix(in oklch, var(--color-surface, #ffffff) 70%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid color-mix(in oklch, var(--color-surface-border, #e2e8f0) 50%, transparent);
}

/* GPU hardware acceleration for smooth transform/filter animations */
@utility gpu-accelerate {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

/* -------------------------------------------------------------------------- */
/* 2. DYNAMIC / FUNCTIONAL UTILITIES (With Argument Matching)                */
/* -------------------------------------------------------------------------- */

/* Fluid text-wrap balance with hyphenation fallback */
@utility text-balance-hyphen {
  text-wrap: balance;
  hyphens: auto;
  overflow-wrap: break-word;
}

/* Container-safe min-size protection */
@utility safe-min-w {
  min-width: 0;
  max-width: 100%;
}

```

---

### Step 2: Dynamic Functional Utilities with Parameters

In Tailwind v4, `@utility` supports dynamic and arbitrary values using the parameter matcher syntax `--*` or specialized tokens:

```css
/* app/globals.css */

/* Custom dynamic elevation shadow: elevation-1, elevation-2, elevation-[custom] */
@utility elevation-* {
  box-shadow: 0 calc(--value() * 2px) calc(--value() * 6px) rgba(0, 0, 0, 0.08);
}

/* Dynamic grid min-max auto-fit columns: grid-fit-240, grid-fit-[300px] */
@utility grid-fit-* {
  grid-template-columns: repeat(auto-fit, minmax(min(100%, --value(--width-*, [length])), 1fr));
}

```

---

### Step 3: Usage in HTML and React Components

All registered `@utility` classes inherit modifier composition automatically:

```tsx
// components/UtilityDemo.tsx
export function UtilityDemo() {
  return (
    <section className="mx-auto max-w-5xl p-6 space-y-6">
      
      {/* 1. Glass Panel with Hover & Dark Variants */}
      <div className="glass-panel hover:bg-surface/80 p-6 rounded-2xl transition-all shadow-md">
        <h2 className="text-xl font-bold text-foreground text-balance-hyphen">
          Dynamic Responsive Layout Architecture
        </h2>
        <p className="text-sm text-muted mt-2 text-balance-hyphen">
          This card uses <code className="font-mono text-xs">glass-panel</code>, which combines backdrop blurs, OKLCH surface mixing, and dynamic borders across themes.
        </p>
      </div>

      {/* 2. Dynamic Auto-Fit Grid using @utility grid-fit-* */}
      <div className="grid grid-fit-[260px] gap-4">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="p-4 rounded-xl border border-surface-border bg-surface shadow-sm safe-min-w"
          >
            <h3 className="font-semibold text-sm">Auto-fitting Column {item}</h3>
            <p className="text-xs text-muted mt-1">
              Columns scale down to 100% on small screens and wrap automatically.
            </p>
          </div>
        ))}
      </div>

      {/* 3. Horizontal Scroll Container with no-scrollbar */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
        {["Overview", "Tokens", "Typography", "Spacing", "Components", "Testing"].map((tag) => (
          <button
            key={tag}
            type="button"
            className="shrink-0 px-4 py-2 text-xs font-semibold rounded-xl bg-surface border border-surface-border hover:border-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {tag}
          </button>
        ))}
      </div>

    </section>
  );
}

```

---

### Step 4: `@utility` vs `@layer utilities` vs `@theme`

| Mechanism                         | Primary Use Case                                             | Variant Support (`hover:`, `dark:`, `md:`)              |
| --------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------- |
| **`@utility <name>`**             | Custom CSS class declarations and functional utilities       | Fully automatic on all variants                         |
| **`@theme { --spacing-*: ... }`** | Design tokens (colors, fonts, spacing, shadows, breakpoints) | Generates standard utility scale (`p-*`, `m-*`, `bg-*`) |
| **`@layer utilities`**            | Legacy Tailwind v3 compatibility for raw CSS blocks          | Requires manual `@variant` compilation in v4            |
