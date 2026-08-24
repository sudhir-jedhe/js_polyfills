Tailwind CSS v4 is designed around a **CSS-first, variable-native architecture**. While `@apply` is still supported via `@reference`, the core team explicitly recommends using **standard CSS variables (`var(--...)`)** or component abstractions over `@apply`.

---

### Why Tailwind Recommends CSS Variables Over `@apply`

**1. CSS Variables are First-Class in v4**
In Tailwind v4, all theme tokens defined under `@theme` are output directly as standard CSS custom properties on `:root` (e.g., `--color-blue-500`, `--font-sans`, `--spacing-4`). You don't need a build-step compiler just to read your design tokens—the browser can access them natively at runtime.

**2. Elimination of Compiler Indirection**
`@apply` requires the Tailwind compiler to look up utility rules, clone their declarations, resolve specificity quirks, and inject those rules into custom selectors. Using CSS variables directly bypasses the utility lookup entirely:

```css
/* Old approach with @apply (requires complex compilation) */
.btn-primary {
  @apply bg-blue-600 px-4 py-2 rounded-lg font-medium;
}

/* Recommended v4 CSS variable approach (clean standard CSS) */
.btn-primary {
  background-color: var(--color-blue-600);
  padding-inline: var(--spacing-4);
  padding-block: var(--spacing-2);
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
}

```

**3. Specificity and Cascade Predictability**
When using `@apply`, chaining pseudo-classes (`hover:`, `focus:`) or responsive modifiers inside custom CSS often creates unexpected selector specificity wars that are difficult to debug. Standard CSS variables follow the native cascade cleanly and predictably.

**4. Dynamic Runtime Theming**
`@apply` values are baked into the stylesheet at build time. CSS variables can be updated dynamically at runtime via JavaScript or inline style attributes (e.g., `<div style="--color-brand: #ff0055">`), allowing immediate UI updates without recompiling or shipping extra CSS.

---

### Performance Impacts

| Performance Area          | `@apply` Heavy Architecture                                                                 | CSS Variable / Utility Architecture                                                                     |
| ------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **CSS Bundle Size**       | **Larger:** Duplicates CSS property definitions across every custom class.                  | **Minimal:** Token values live once on `:root`; classes only reference variable pointers.               |
| **Build & Compile Speed** | **Slower:** Compiler must resolve, clone, and validate class dependencies for every rule.   | **Fastest:** Native variables require zero compiler translation or dependency mapping.                  |
| **Browser Parse & Paint** | **Higher overhead:** Larger stylesheets take longer to download and parse over the network. | **Lower overhead:** Leaner stylesheets, with GPU/engine optimized variable resolution.                  |
| **Theme Switching**       | **Heavy:** Requires separate stylesheets or bulky duplicate class definitions.              | **Instant:** Switching dark/light mode only requires flipping variable values on the root or container. |

---

### Recommended Patterns for Component Styling

* **In Component Frameworks (React, Vue, Svelte):** Keep utility classes directly in the markup or extract them into reusable component wrappers (`<Button variant="primary">`) instead of creating synthetic CSS classes.
* **In Standalone CSS / CSS Modules:** Use `var(--color-*)` and `var(--spacing-*)` tokens to maintain strict alignment with the design system while writing standard, zero-overhead CSS.
