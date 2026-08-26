*** copy How do I create custom variants and pseudo-class modifiers using the @variant directive in Tailwind CSS v4?.md ***

In Tailwind CSS v4, custom variant behaviors are handled via two dedicated CSS directives:

* **`@custom-variant`**: Defines a new variant modifier prefix (e.g., `pointer-fine:`, `theme-cyber:`, `active-tab:`).
* **`@variant`**: Applies an existing variant to standard CSS selectors inside your stylesheet (especially useful for styling third-party widgets).

---

### 1. Creating Custom Variants with `@custom-variant`

Use `@custom-variant` to register a new modifier prefix that works directly in your HTML/JSX class lists. Use `&` as the placeholder representing the current element.

#### Example A: Media and Feature Queries

```css
@import "tailwindcss";

/* Target devices with a precise mouse/pointer */
@custom-variant pointer-fine (@media (pointer: fine));

/* Target devices in high-contrast mode */
@custom-variant contrast-more (@media (prefers-contrast: more));

```

#### Example B: Attribute, State, and Selector Variants

```css
/* Target elements with custom data attributes */
@custom-variant current (&[data-current="true"]);

/* Custom class-based dark mode selector */
@custom-variant dark (&:is(.dark *));

/* Target active tab buttons */
@custom-variant active-tab (&[aria-selected="true"]);

```

#### Usage in Markup

```jsx
<button className="bg-gray-200 text-gray-700 pointer-fine:hover:scale-105 active-tab:bg-blue-600 active-tab:text-white">
  Tab 1
</button>

```

---

### 2. Nesting Variants Inside CSS with `@variant`

The `@variant` at-rule applies variant rules directly inside plain CSS classes or third-party selectors without touching the HTML:

```css
@import "tailwindcss";

.rich-text-editor {
  /* Apply hover styles directly via @variant */
  @variant hover {
    border-color: var(--color-blue-500);
  }

  /* Apply responsive styles */
  @variant md {
    padding: 2rem;
  }

  /* Apply custom-defined variants */
  @variant dark {
    background-color: var(--color-slate-900);
    color: var(--color-slate-100);
  }
}

```

---

### Key Capabilities

* **Stackable:** Custom variants chain with all built-in modifiers (e.g., `dark:pointer-fine:hover:bg-blue-500`).
* **Zero Plugin Boilerplate:** Replaces the legacy `addVariant()` plugin API from JavaScript with a single line of standard CSS.
* **JIT-Compiled:** Variants are compiled on demand and only add bytes to your production build if actually invoked in your source markup.
