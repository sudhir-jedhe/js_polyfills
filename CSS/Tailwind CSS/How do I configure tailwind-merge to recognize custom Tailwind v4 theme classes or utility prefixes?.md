By default, `tailwind-merge` knows standard Tailwind class names. When you introduce custom `@theme` namespaces, custom utilities via `@utility`, or non-standard class patterns in Tailwind v4, `tailwind-merge` won't know which CSS properties they target and might not merge them properly.

To fix this, configure a custom merger using **`createTailwindMerge`** and **`extendTailwindMerge`**.

---

### Step 1: Create a Custom `twMerge` Instance

In your utility helper file (`src/lib/utils.ts`), replace standard `twMerge` with a customized instance:

```typescript
import { clsx, type ClassValue } from "clsx";
import { createTailwindMerge, getDefaultConfig } from "tailwind-merge";

// Define your custom Tailwind v4 tokens & class rules
export const customTwMerge = createTailwindMerge(() => {
  const defaultConfig = getDefaultConfig();

  return {
    ...defaultConfig,
    extend: {
      classGroups: {
        /* 1. Custom Theme Colors (e.g., bg-brand-primary, text-brand-accent) */
        "bg-color": [{ bg: ["brand-primary", "brand-secondary", "brand-accent"] }],
        "text-color": [{ text: ["brand-primary", "brand-secondary", "brand-accent"] }],
        
        /* 2. Custom Fluid Typography Scale (e.g., text-fluid-sm, text-fluid-h1) */
        "font-size": [
          {
            "text-fluid": ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "display", "h1", "body"],
          },
        ],

        /* 3. Custom Fluid Spacing Scale (e.g., p-fluid-md, gap-fluid-lg) */
        p: [{ "p-fluid": ["sm", "md", "lg", "xl", "section"] }],
        px: [{ "px-fluid": ["sm", "md", "lg", "xl", "section"] }],
        py: [{ "py-fluid": ["sm", "md", "lg", "xl", "section"] }],
        gap: [{ "gap-fluid": ["sm", "md", "lg", "xl", "section"] }],

        /* 4. Custom @utility classes (e.g., tab-4, content-auto, neon-glow) */
        "shadow": ["neon-glow"],
        "tab-size": ["tab-4", "tab-8"],
      },
      conflictingClassGroups: {
        /* Ensure p-fluid-* overrides px/py, matching standard Tailwind behavior */
        p: ["px", "py", "pt", "pr", "pb", "pl"],
      },
    },
  };
});

// Export updated cn() helper
export function cn(...inputs: ClassValue[]): string {
  return customTwMerge(clsx(inputs));
}

```

---

### Step 2: Handling Custom Prefix Configs (If Using a Prefix)

If your Tailwind setup uses a global class prefix (such as `tw-`), pass the prefix configuration so `tailwind-merge` resolves prefixed utilities:

```typescript
import { extendTailwindMerge } from "tailwind-merge";

export const customTwMerge = extendTailwindMerge({
  prefix: "tw",
  override: {
    // custom rules...
  }
});

```

---

### Step 3: How the Configured `cn()` Resolves Conflicts

Now `customTwMerge` recognizes that your custom tokens and utilities target the same CSS properties as standard utilities:

```typescript
// 1. Custom colors override standard colors properly:
cn("bg-slate-900", "bg-brand-primary");
// Output: "bg-brand-primary" (previously would output: "bg-slate-900 bg-brand-primary")

// 2. Fluid typography overrides fixed typography:
cn("text-lg font-bold", "text-fluid-h1");
// Output: "font-bold text-fluid-h1"

// 3. Fluid padding overrides standard padding:
cn("p-4 px-2", "p-fluid-section");
// Output: "p-fluid-section"

// 4. Custom shadow utilities override each other:
cn("shadow-lg", "neon-glow");
// Output: "neon-glow"

```

---

### Configuration Strategy Summary

* **Adding simple values to existing groups:** Extend the relevant `classGroups` key (`bg-color`, `font-size`, `rounded`, `shadow`, etc.).
* **Registering new standalone utility concepts:** Create a new custom key in `classGroups` (e.g., `"tab-size": ["tab-4"]`).
* **Managing overrides:** Use `conflictingClassGroups` whenever a broad utility (like all-direction padding) should replace directional utilities.
