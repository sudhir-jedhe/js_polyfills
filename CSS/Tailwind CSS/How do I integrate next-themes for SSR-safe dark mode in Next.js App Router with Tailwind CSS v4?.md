Integrating `next-themes` with Tailwind CSS v4 in the Next.js App Router prevents flash of unstyled content (FOUC) and ensures server-safe hydration when switching themes.

---

### Step 1: Install `next-themes`

```bash
npm install next-themes

```

---

### Step 2: Configure Theme Variables in Tailwind CSS v4

In Tailwind v4, configure your color variables in `globals.css` and use the `.dark` class selector so `next-themes` can toggle the `.dark` class on the `<html>` element.

```css
/* app/globals.css */
@import "tailwindcss";

/* 1. Register semantic colors in @theme */
@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-border: var(--card-border);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
}

/* 2. Light theme variables (Default) */
:root {
  --background: oklch(0.99 0 0);
  --foreground: oklch(0.15 0.02 240);
  --card: oklch(1 0 0);
  --card-border: oklch(0.92 0.01 240);
  --primary: oklch(0.55 0.22 260);
  --primary-foreground: oklch(0.99 0 0);
  --muted: oklch(0.95 0.01 240);
  --muted-foreground: oklch(0.45 0.02 240);
}

/* 3. Dark theme variables (Applied when next-themes adds .dark to <html>) */
.dark {
  --background: oklch(0.14 0.02 240);
  --foreground: oklch(0.98 0 0);
  --card: oklch(0.18 0.02 240);
  --card-border: oklch(0.28 0.02 240);
  --primary: oklch(0.65 0.2 260);
  --primary-foreground: oklch(0.1 0.02 240);
  --muted: oklch(0.22 0.02 240);
  --muted-foreground: oklch(0.7 0.01 240);
}

```

---

### Step 3: Create the Client-Side Theme Provider Wrapper

Because `next-themes` uses React Context, wrap it in a client component:

```tsx
// components/theme-provider.tsx
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

```

---

### Step 4: Add Provider to Root Layout

In your root `app/layout.tsx`, wrap the app in `ThemeProvider` and pass **`suppressHydrationWarning`** to `<html>`.

`suppressHydrationWarning` is **required** because `next-themes` updates the `<html>` attributes on the client before hydration to prevent flickering.

```tsx
// app/layout.tsx
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "App with Tailwind v4 & next-themes",
  description: "SSR-safe dark mode setup",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased transition-colors duration-200">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

```

---

### Step 5: Build a Mounted-Safe Theme Toggle Component

When rendering UI that depends on the current theme (e.g., icons or labels), check if the component is mounted to prevent hydration mismatches:

```tsx
// components/theme-toggle.tsx
"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch by waiting until mounted on client
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render an equivalent skeleton placeholder to prevent layout shift
    return <div className="h-9 w-9 rounded-lg bg-muted animate-pulse" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="inline-flex items-center justify-center h-9 w-9 rounded-lg border border-card-border bg-card text-foreground hover:bg-muted transition-colors"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        /* Sun Icon */
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        /* Moon Icon */
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      )}
    </button>
  );
}

```

---

### Step 6: Use in Server or Client Pages

Server Components can safely use the theme semantic classes because the classes resolve in pure CSS:

```tsx
// app/page.tsx
import { ThemeToggle } from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <main className="max-w-xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <ThemeToggle />
      </div>

      <div className="p-6 rounded-2xl bg-card border border-card-border shadow-sm space-y-3">
        <h2 className="text-lg font-semibold">Themed Card Component</h2>
        <p className="text-sm text-muted-foreground">
          This card reacts immediately to theme changes without flash of unstyled content or hydration warnings.
        </p>
        <button className="px-4 py-2 text-sm font-medium rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
          Action Button
        </button>
      </div>
    </main>
  );
}

```

---

### Key Takeaways for Next.js App Router & Tailwind v4

* **`attribute="class"`**: Tells `next-themes` to inject the `dark` class on `<html>`, matching Tailwind v4's `.dark` CSS block.
* **`suppressHydrationWarning` on `<html>**`: Prevents Next.js warnings about mismatched HTML attributes caused by the theme injection script.
* **`disableTransitionOnChange`**: Disables CSS transitions during the initial theme swap to prevent unwanted color flashing while the page is mounting.
