In Tailwind CSS v4, custom fonts, theme colors, and design tokens are declared directly inside your CSS file using the **`@theme`** directive and standard CSS custom properties.

---

### Step 1: Load Custom Fonts (`next/font` or `@font-face`)

Define custom font variables in Next.js using `next/font/google` (or `next/font/local`) and inject their CSS variable names into the `<html>` element:

```tsx
// app/layout.tsx
import { Plus_Jakarta_Sans, JetBrains_Mono, Calistoga } from "next/font/google";
import "@/app/globals.css";

const sansFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans-custom",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-custom",
  display: "swap",
});

const displayFont = Calistoga({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-custom",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${monoFont.variable} ${displayFont.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}

```

---

### Step 2: Configure `@theme` Tokens in `globals.css`

Register your fonts, semantic colors, border radii, and elevation scales in `globals.css`.

```css
/* app/globals.css */
@import "tailwindcss";

/* -------------------------------------------------------------------------- */
/* 1. TAILWIND V4 THEME EXTENSIONS                                           */
/* -------------------------------------------------------------------------- */
@theme {
  /* Font Family Tokens */
  --font-sans: var(--font-sans-custom), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-mono-custom), ui-monospace, monospace;
  --font-display: var(--font-display-custom), Georgia, serif;

  /* Typography Scale Tokens */
  --text-display-2xl: 4.5rem;
  --text-display-2xl--line-height: 1.05;
  --text-display-2xl--letter-spacing: -0.03em;

  --text-display-xl: 3.75rem;
  --text-display-xl--line-height: 1.1;
  --text-display-xl--letter-spacing: -0.025em;

  /* Border Radii Tokens */
  --radius-xs: 0.25rem;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;

  /* Semantic Theme Color Bindings */
  --color-background: var(--background);
  --color-foreground: var(--foreground);

  --color-surface: var(--surface);
  --color-surface-muted: var(--surface-muted);
  --color-surface-border: var(--surface-border);

  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-primary-hover: var(--primary-hover);

  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);

  --color-ring: var(--ring);
}

/* -------------------------------------------------------------------------- */
/* 2. BASE LIGHT MODE TOKENS (Default)                                       */
/* -------------------------------------------------------------------------- */
:root {
  --background: oklch(0.99 0.002 240);
  --foreground: oklch(0.15 0.02 240);

  --surface: oklch(1 0 0);
  --surface-muted: oklch(0.96 0.01 240);
  --surface-border: oklch(0.91 0.01 240);

  --primary: oklch(0.55 0.22 260);        /* Deep Indigo */
  --primary-foreground: oklch(0.99 0 0);
  --primary-hover: oklch(0.48 0.22 260);

  --accent: oklch(0.65 0.19 155);         /* Emerald Accent */
  --accent-foreground: oklch(0.99 0 0);

  --ring: oklch(0.55 0.22 260 / 0.35);
}

/* -------------------------------------------------------------------------- */
/* 3. BASE DARK MODE TOKENS                                                  */
/* -------------------------------------------------------------------------- */
.dark {
  --background: oklch(0.13 0.02 240);
  --foreground: oklch(0.98 0 0);

  --surface: oklch(0.18 0.02 240);
  --surface-muted: oklch(0.24 0.02 240);
  --surface-border: oklch(0.28 0.02 240);

  --primary: oklch(0.68 0.18 260);        /* Elevated Lightness for Dark UI */
  --primary-foreground: oklch(0.12 0.03 260);
  --primary-hover: oklch(0.74 0.16 260);

  --accent: oklch(0.72 0.16 155);
  --accent-foreground: oklch(0.1 0.03 155);

  --ring: oklch(0.68 0.18 260 / 0.45);
}

```

---

### Step 3: Consume Tokens in CVA Components

Because your tokens map directly to Tailwind utility classes (`font-display`, `font-mono`, `rounded-xl`, `bg-primary`, `border-surface-border`), your CVA components remain clean, strongly typed, and completely dynamic across themes:

```tsx
// components/Card.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const cardVariants = cva(
  "relative transition-all select-none border border-surface-border",
  {
    variants: {
      variant: {
        default: "bg-surface text-foreground shadow-sm",
        muted: "bg-surface-muted text-foreground",
        hero: "bg-gradient-to-b from-surface to-surface-muted text-foreground shadow-xl ring-1 ring-primary/10",
      },
      radius: {
        sm: "rounded-sm p-4",
        md: "rounded-md p-5",
        lg: "rounded-lg p-6",
        xl: "rounded-xl p-8",
        "2xl": "rounded-2xl p-10",
      },
    },
    defaultVariants: {
      variant: "default",
      radius: "lg",
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  title: string;
  tag?: string;
  codeSnippet?: string;
}

export function Card({
  title,
  tag,
  codeSnippet,
  variant,
  radius,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div className={cn(cardVariants({ variant, radius }), className)} {...props}>
      <div className="flex items-center justify-between gap-4 mb-3">
        {tag && (
          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-sm bg-accent/10 text-accent border border-accent/20">
            {tag}
          </span>
        )}
        <span className="text-xs text-foreground/50 font-mono">v4.0.0</span>
      </div>

      <h3 className="font-display text-2xl tracking-tight font-normal text-foreground mb-2">
        {title}
      </h3>

      <div className="font-sans text-sm text-foreground/80 leading-relaxed space-y-3">
        {children}
      </div>

      {codeSnippet && (
        <pre className="mt-4 p-3 rounded-md bg-background border border-surface-border font-mono text-xs text-foreground/90 overflow-x-auto">
          <code>{codeSnippet}</code>
        </pre>
      )}
    </div>
  );
}

```

---

### Step 4: Token Usage Showcase Page

```tsx
// app/page.tsx
import { Card } from "@/components/Card";

export function DesignSystemShowcase() {
  return (
    <main className="max-w-4xl mx-auto p-8 space-y-8 font-sans">
      <header className="space-y-2">
        <span className="font-mono text-xs uppercase tracking-widest text-accent font-bold">
          Token Architecture
        </span>
        <h1 className="font-display text-display-xl font-normal text-foreground">
          Editorial Typography & Theme Engine
        </h1>
        <p className="text-foreground/70 text-base max-w-xl">
          Demonstrating custom serif display headers, standard sans body text, and monospace code blocks bound to semantic OKLCH tokens.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card
          title="Display Serif Header"
          tag="Design Token"
          variant="hero"
          radius="xl"
          codeSnippet={`font-family: var(--font-display);`}
        >
          This card renders a serif title via <code className="font-mono text-xs font-bold">font-display</code>, sans body copy, and OKLCH elevation backgrounds.
        </Card>

        <Card
          title="Monospace Component"
          tag="Code Engine"
          variant="default"
          radius="xl"
          codeSnippet={`const tokens = { primary: "oklch(0.55 0.22 260)" };`}
        >
          All utility classes (<code className="font-mono text-xs font-bold">bg-primary</code>, <code className="font-mono text-xs font-bold">text-foreground</code>) adapt automatically across light and dark themes.
        </Card>
      </div>
    </main>
  );
}

```

---

### Quick Reference Token Mappings

| Token Category       | Tailwind Utility Prefix                                  | Definition Location                 |
| -------------------- | -------------------------------------------------------- | ----------------------------------- |
| **Fonts**            | `font-sans`, `font-mono`, `font-display`                 | `@theme { --font-display: ... }`    |
| **Typography Scale** | `text-display-xl`, `text-display-2xl`                    | `@theme { --text-display-xl: ... }` |
| **Colors**           | `bg-primary`, `text-foreground`, `border-surface-border` | `@theme` + `:root` / `.dark`        |
| **Border Radii**     | `rounded-xs`, `rounded-lg`, `rounded-2xl`                | `@theme { --radius-xl: ... }`       |
