In Tailwind CSS v4, **`@source`** and **`@reference`** solve two common architecture challenges: controlling file scanning for class generation, and sharing theme context without duplicating CSS output.

---

### 1. `@source` (Explicit Source Scanning)

Tailwind v4 features automatic content detection—it scans project files for class names while automatically ignoring everything in `.gitignore` (such as `node_modules` or build output directories).

The `@source` directive tells Tailwind to scan additional directories or external packages that are otherwise ignored by default.

#### When to Use `@source`

* Monorepo setups where shared packages or UI libraries reside outside the standard source root.
* Third-party UI component packages inside `node_modules` that ship raw Tailwind classes.
* Custom HTML/template directories outside the default scan range.

#### Example

In your main CSS file (`globals.css` / `index.css`):

```css
@import "tailwindcss";

/* Scan a component library inside node_modules */
@source "../node_modules/@my-company/ui-lib";

/* Scan a shared package in a monorepo workspace */
@source "../../packages/shared-components";

```

---

### 2. `@reference` (Context Import Without Duplication)

When writing styles in isolated scopes—such as **CSS Modules**, **Vue `<style>` blocks**, **Svelte `<style>` tags**, or **Astro components**—the local stylesheet is compiled independently. Because of this isolation, directives like `@apply` or `@variant` cannot see your `@theme` tokens or custom utilities.

Using `@import "tailwindcss"` inside every component will duplicate Tailwind's base CSS in every single file. **`@reference`** loads your theme, custom variants, and utility definitions for reference only, producing **zero duplicate CSS** in your output.

#### When to Use `@reference`

* Using `@apply` inside scoped `<style>` tags (Vue, Svelte, Astro).
* Using `@apply` or theme tokens inside `Component.module.css`.

#### Example

**Inside a Vue or Svelte Single File Component:**

```vue
<template>
  <button class="primary-btn">Click Me</button>
</template>

<style scoped>
/* Reference your main stylesheet to get custom tokens without duplicating global CSS */
@reference "../../app.css";

.primary-btn {
  @apply bg-brand-primary text-white px-4 py-2 rounded-lg hover:opacity-90;
}
</style>

```

**Inside a CSS Module (`Button.module.css`):**

```css
/* If you only need default Tailwind classes without custom @theme extensions */
@reference "tailwindcss";

.button {
  @apply rounded-md font-semibold transition-all;
}

```

---

### Summary Comparison

| Directive        | Purpose                                                       | Primary Use Case                                         | Output Effect                              |
| ---------------- | ------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------ |
| **`@source`**    | Tell compiler *where to scan* for class names                 | External UI libraries, monorepo packages, `node_modules` | Generates missing classes into your bundle |
| **`@reference`** | Give isolated CSS scopes *access to design tokens / `@apply*` | Vue/Svelte scoped styles, CSS Modules                    | Adds 0 KB to compiled CSS (metadata only)  |
