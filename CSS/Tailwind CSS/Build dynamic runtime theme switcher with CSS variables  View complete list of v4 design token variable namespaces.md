***  Build dynamic runtime theme switcher with CSS variables  View complete list of v4 design token variable namespaces.md ***

In Tailwind CSS v4, the `@theme` directive maps specific CSS variable prefix namespaces directly to corresponding utility classes, modifiers, and design tokens.

---

### Complete `@theme` Variable Namespace Reference

| Namespace Prefix   | Target Utility / Property                                  | Example Variable       | Generated Utility / Modifier     |
| ------------------ | ---------------------------------------------------------- | ---------------------- | -------------------------------- |
| `--color-*`        | Colors (text, bg, border, ring, etc.)                      | `--color-brand-500`    | `bg-brand-500`, `text-brand-500` |
| `--font-*`         | Font Families                                              | `--font-display`       | `font-display`                   |
| `--font-size-*`    | Font Sizes (`font-size` + `line-height`)                   | `--font-size-2xl`      | `text-2xl`                       |
| `--font-weight-*`  | Font Weights                                               | `--font-weight-medium` | `font-medium`                    |
| `--tracking-*`     | Letter Spacing (`letter-spacing`)                          | `--tracking-wide`      | `tracking-wide`                  |
| `--leading-*`      | Line Height (`line-height`)                                | `--leading-tight`      | `leading-tight`                  |
| `--breakpoint-*`   | Responsive Media Query Variants                            | `--breakpoint-xs`      | `xs:flex`, `xs:p-4`              |
| `--container-*`    | Container Query Widths / Variants                          | `--container-sm`       | `@sm:grid-cols-2`                |
| `--spacing-*`      | Sizing, Padding, Margin, Gap, Inset                        | `--spacing-18`         | `p-18`, `h-18`, `gap-18`         |
| `--radius-*`       | Border Radius (`border-radius`)                            | `--radius-4xl`         | `rounded-4xl`                    |
| `--shadow-*`       | Box Shadows (`box-shadow`)                                 | `--shadow-glow`        | `shadow-glow`                    |
| `--inset-shadow-*` | Inset Shadows (`box-shadow: inset ...`)                    | `--inset-shadow-sm`    | `inset-shadow-sm`                |
| `--drop-shadow-*`  | Drop Shadow Filters (`filter: drop-shadow(...)`)           | `--drop-shadow-card`   | `drop-shadow-card`               |
| `--blur-*`         | Blur Filters (`filter: blur(...)`)                         | `--blur-xs`            | `blur-xs`, `backdrop-blur-xs`    |
| `--perspective-*`  | 3D Perspective (`perspective`)                             | `--perspective-mid`    | `perspective-mid`                |
| `--aspect-*`       | Aspect Ratios (`aspect-ratio`)                             | `--aspect-portrait`    | `aspect-portrait`                |
| `--ease-*`         | Transition Timing Functions (`transition-timing-function`) | `--ease-fluid`         | `ease-fluid`                     |
| `--animate-*`      | Keyframe Animations (`animation`)                          | `--animate-wiggle`     | `animate-wiggle`                 |

---

### Example `@theme` Implementation

```css
@import "tailwindcss";

@theme {
  /* Colors */
  --color-primary: #6366f1;
  
  /* Typography */
  --font-heading: "Poppins", sans-serif;
  --font-size-hero: 4rem;
  --leading-hero: 1.1;
  --tracking-wide: 0.05em;

  /* Layout & Sizing */
  --breakpoint-3xl: 1920px;
  --container-card: 400px;
  --spacing-128: 32rem;

  /* Shapes & Effects */
  --radius-badge: 9999px;
  --shadow-neon: 0 0 20px rgba(99, 102, 241, 0.6);
  --blur-heavy: 40px;

  /* Motion */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --animate-pulse-fast: pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

```

---

### Namespace Behavior Rules

* **Direct Token Access:** Every token registered in `@theme` is available natively in CSS via `var(--<namespace>-<name>)` (e.g., `var(--color-primary)`).
* **Resetting Namespaces:** To remove Tailwind's built-in defaults for an entire category and define only your own, set the wildcard to `initial`:

```css
@theme {
  --color-*: initial; /* Clears all default Tailwind colors */
  --color-black: #000;
  --color-white: #fff;
}

```
