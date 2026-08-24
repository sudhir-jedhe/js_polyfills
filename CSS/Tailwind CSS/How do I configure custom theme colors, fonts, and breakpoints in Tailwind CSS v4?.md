In Tailwind CSS v4, configuration is **CSS-first**. Instead of using a JavaScript `tailwind.config.js` file, you define custom design tokens directly inside your CSS file using the `@theme` directive.

Tailwind uses the variable namespace (e.g., `--color-*`, `--font-*`, `--breakpoint-*`) to automatically generate matching utility classes.

---

### Step 1: Add Custom Tokens in Your CSS File

In your main stylesheet (e.g., `src/index.css` or `app/globals.css`), define your tokens inside `@theme` after `@import "tailwindcss";`:

```css
@import "tailwindcss";

@theme {
  /* 1. Custom Theme Colors */
  --color-brand-primary: #2563eb;
  --color-brand-secondary: #0f172a;
  --color-brand-accent: oklch(0.72 0.18 140);

  /* 2. Custom Fonts */
  --font-display: "Cabinet Grotesk", sans-serif;
  --font-sans: "Inter Variable", system-ui, sans-serif;

  /* 3. Custom Breakpoints */
  --breakpoint-xs: 30rem;    /* 480px */
  --breakpoint-3xl: 120rem;  /* 1920px */
}

```

---

### Step 2: Use the Generated Utility Classes

Tailwind automatically registers utility classes and variants based on your `@theme` variable names:

* **Colors** (`--color-*`): Generates `bg-brand-primary`, `text-brand-secondary`, `border-brand-accent`, `hover:bg-brand-primary`, etc.
* **Fonts** (`--font-*`): Generates `font-display`, `font-sans`, etc.
* **Breakpoints** (`--breakpoint-*`): Generates responsive variant prefixes like `xs:` and `3xl:`.

**Usage in HTML / JSX:**

```jsx
export default function HeroSection() {
  return (
    <section className="bg-brand-secondary text-white p-6 xs:p-8 3xl:p-16">
      <h1 className="font-display text-3xl xs:text-5xl text-brand-accent">
        Custom Design System
      </h1>
      <p className="font-sans text-slate-300 mt-3">
        Configured directly in CSS using Tailwind v4.
      </p>
      <button className="mt-6 px-4 py-2 bg-brand-primary hover:opacity-90 rounded-md">
        Get Started
      </button>
    </section>
  );
}

```

---

### Overriding vs. Extending Defaults

* **Extending (Default behavior):** Declaring individual properties in `@theme` adds new tokens while keeping all standard Tailwind defaults intact.
* **Overriding entire namespaces:** To wipe out standard defaults and start from scratch for a namespace, reset the namespace using `--*: initial;`:

```css
@theme {
  /* Resets all default colors so ONLY your custom palette exists */
  --color-*: initial;
  --color-black: #000;
  --color-white: #fff;
  --color-primary: #3b82f6;
}

```
