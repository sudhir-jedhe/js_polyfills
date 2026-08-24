In Tailwind CSS v4, custom utility classes are registered using the **`@utility`** directive directly in your CSS.

Utilities created with `@utility` automatically support all Tailwind modifiers, such as responsive prefixes (`sm:`, `lg:`), state variants (`hover:`, `focus:`), and dark mode (`dark:`).

---

### Basic Utility

Add your custom utilities to your main CSS file (e.g., `globals.css` or `index.css`) alongside `@import "tailwindcss";`:

```css
@import "tailwindcss";

/* Creates the utility class .tab-4 */
@utility tab-4 {
  tab-size: 4;
}

/* Creates the utility class .content-auto */
@utility content-auto {
  content-visibility: auto;
}

```

**Usage in HTML / JSX:**

```jsx
<pre className="tab-4 hover:content-auto">
  <code>const x = 10;</code>
</pre>

```

---

### Utilities with Theme Integration

You can reference design tokens defined in your `@theme` block inside a `@utility` using CSS variables or standard `var()` notation:

```css
@import "tailwindcss";

@theme {
  --color-neon-cyan: #00f2fe;
}

@utility neon-glow {
  box-shadow: 0 0 15px var(--color-neon-cyan);
}

```

**Usage:**

```jsx
<button className="neon-glow hover:opacity-80">
  Glowing Action
</button>

```

---

### Dynamic Value Utilities (`--value()`)

For utilities that should accept dynamic or custom scale values (like `inset-shadow-*` or custom padding scales), use the `--value()` function:

```css
@import "tailwindcss";

/* Handles classes like: scroll-m-sm, scroll-m-md, scroll-m-[20px] */
@utility scroll-m-* {
  scroll-margin: --value(--spacing-*);
}

/* Handles arbitrary values directly */
@utility perspective-* {
  perspective: --value(integer);
}

```

**Usage:**

```jsx
<div className="scroll-m-4 hover:perspective-500">
  Content
</div>

```

---

### Key Advantages of `@utility` over Standard CSS Classes

* **Full Variant Compatibility:** Standard custom CSS classes like `.my-button` cannot be prefixed with `hover:my-button` or `md:my-button` out of the box. Utilities declared via `@utility` integrate directly into the compiler's variant pipeline.
* **Dead Code Pruning:** Tailwind will only include the `@utility` in your compiled bundle if the class name is actually used in your template files.
* **No `tailwind.config.js` Plugins Needed:** Replaces the legacy `addUtilities()` JavaScript plugin API with a pure CSS approach.
