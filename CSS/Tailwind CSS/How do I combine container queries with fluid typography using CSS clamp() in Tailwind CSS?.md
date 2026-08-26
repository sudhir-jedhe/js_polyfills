*** copy How do I combine container queries with fluid typography using CSS clamp() in Tailwind CSS?.md ***

Combining container queries with fluid typography means text scales smoothly based on the **parent container's width** rather than the full viewport.

In modern CSS, this is achieved using `clamp()` paired with Container Query Units:

* **`1cqi`** = 1% of the query container's inline size (width in horizontal writing modes).
* **`1cqw`** = 1% of the query container's total width.

---

### Step 1: Define Fluid Tokens in `@theme`

In your main CSS file (`globals.css` / `index.css`), configure custom fluid font sizes using `clamp(min, preferred, max)` inside `@theme`:

```css
@import "tailwindcss";

@theme {
  /* clamp(minimum, preferred-cqi-rate, maximum) */
  --font-size-fluid-sm: clamp(0.875rem, 0.75rem + 1cqi, 1rem);
  --font-size-fluid-base: clamp(1rem, 0.85rem + 1.25cqi, 1.25rem);
  --font-size-fluid-lg: clamp(1.25rem, 1rem + 2cqi, 1.75rem);
  --font-size-fluid-xl: clamp(1.5rem, 1.1rem + 3cqi, 2.5rem);
  --font-size-fluid-display: clamp(2rem, 1.25rem + 4.5cqi, 4.5rem);
}

```

---

### Step 2: Build the Fluid Component

To make container units work, wrap the component in an `@container` parent element. The child typography will fluidly interpolate between the minimum and maximum boundaries without step-jumping.

```jsx
export function FluidHeroCard({ tag, title, description, ctaText }) {
  return (
    /* 1. Mark parent as container */
    <div className="@container w-full">
      <div className="bg-slate-900 text-white rounded-3xl p-6 @md:p-10 border border-slate-800 shadow-xl flex flex-col items-start gap-4">
        
        {/* Small Fluid Tag */}
        <span className="text-fluid-sm font-semibold tracking-wide uppercase text-indigo-400 bg-indigo-950/60 px-3 py-1 rounded-full border border-indigo-800/50">
          {tag}
        </span>

        {/* Fluid Display Title */}
        <h2 className="text-fluid-display font-extrabold leading-tight tracking-tight text-balance bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
          {title}
        </h2>

        {/* Fluid Paragraph Body */}
        <p className="text-fluid-base text-slate-300 max-w-2xl leading-relaxed">
          {description}
        </p>

        {/* Responsive Button using both container queries and fluid text */}
        <button className="mt-2 text-fluid-sm font-medium px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all w-full @sm:w-auto">
          {ctaText}
        </button>

      </div>
    </div>
  );
}

```

---

### Step 3: Inline Arbitrary Fluid Values (Alternative)

For one-off scenarios without defining variables in `@theme`, apply `clamp()` directly using arbitrary value syntax:

```html
<div class="@container">
  <!-- Scales from 20px (min) up to 48px (max) based on container width -->
  <h1 class="text-[clamp(1.25rem,0.75rem+2.5cqi,3rem)] font-bold">
    Direct Inline Fluid Title
  </h1>
</div>

```

---

### How Viewport Units vs. Container Units Compare

| Approach               | Unit Used                                 | Behavior                                         | Problem Solved                                                                       |
| ---------------------- | ----------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------ |
| **Viewport Fluidity**  | `vw` (`clamp(1rem, 2vw, 2rem)`)           | Responds strictly to browser window size.        | Text stays too large when placed inside a narrow sidebar or nested grid column.      |
| **Container Fluidity** | `cqi` / `cqw` (`clamp(1rem, 2cqi, 2rem)`) | Responds strictly to immediate parent container. | Scales proportionally anywhere the component is dropped (modals, columns, sidebars). |
