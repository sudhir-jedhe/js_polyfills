In modern frontend development, extracting reusable components with Tailwind CSS is typically handled at the **template/component layer** rather than writing custom CSS classes.

---

### Strategy 1: Component-Driven Extraction (Recommended)

In frameworks like React, Vue, Svelte, or Astro, extract repetitive class combinations directly into reusable template components.

#### Example: Button Component with Variants in React

Combine **`class-variance-authority` (CVA)** and **`tailwind-merge`** with **`clsx`** to create clean, typesafe variant props.

```bash
npm install class-variance-authority clsx tailwind-merge

```

**`src/components/Button.jsx`**

```jsx
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";
import { clsx } from "clsx";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  /* Base styles applied to all buttons */
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:ring-indigo-500",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100",
        outline: "border border-slate-300 bg-transparent hover:bg-slate-100 dark:border-slate-700",
        destructive: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-10 px-4 text-sm rounded-lg",
        lg: "h-12 px-6 text-base rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export function Button({ className, variant, size, children, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

```

**Usage:**

```jsx
<Button variant="primary" size="md">Save Changes</Button>
<Button variant="outline" size="sm" className="w-full">Cancel</Button>

```

---

### Strategy 2: Multi-Part Form Inputs

For composite UI elements (like form fields with labels, error states, and helper text), group sub-elements into a single component wrapper:

**`src/components/InputField.jsx`**

```jsx
export function InputField({ label, error, id, ...props }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          "w-full rounded-lg border px-3.5 py-2 text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all",
          error
            ? "border-red-500 focus:ring-red-400/30 focus:border-red-500"
            : "border-slate-300 dark:border-slate-700 focus:ring-indigo-500/30 focus:border-indigo-500"
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

```

---

### Strategy 3: CSS-First Extraction with `@utility` (Tailwind v4)

If you are not using a JS component framework (e.g., standard HTML templates or markdown), register the component class directly via the `@utility` directive in CSS:

```css
@import "tailwindcss";

@utility btn-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding-inline: var(--spacing-4);
  padding-block: var(--spacing-2);
  border-radius: var(--radius-lg);
  font-weight: var(--font-weight-medium);
  transition-property: color, background-color, border-color;
  transition-duration: 150ms;
}

```

```html
<button class="btn-base bg-indigo-600 text-white hover:bg-indigo-700">
  Submit
</button>

```

---

### Summary of Best Practices

| Use Case                           | Recommended Solution                 | Advantage                                                |
| ---------------------------------- | ------------------------------------ | -------------------------------------------------------- |
| **React / Vue / Svelte / Astro**   | JS/TS Components + CVA + `twMerge`   | Full props control, zero CSS duplication, type safety    |
| **Simple HTML / Server Templates** | Partials / Includes (`_button.html`) | Template-level reuse without custom CSS overhead         |
| **Pure CSS / Global Widgets**      | `@utility` directive in Tailwind v4  | Works across vanilla HTML without framework dependencies |
