*** copy How do I install and configure the typography and container queries plugins in Tailwind CSS?.md ***

In modern Tailwind CSS (v4), **container queries are built into core** (no plugin needed), while the **typography plugin** (`@tailwindcss/typography`) is imported directly in your CSS using standard `@plugin` directives.

---

### Step 1: Container Queries (Built-in Core Feature)

You do **not** need to install `@tailwindcss/container-queries`. It works out of the box.

#### Defining Breakpoints in `@theme`

```css
/* app/globals.css or src/index.css */
@import "tailwindcss";

@theme {
  --container-xs: 20rem;   /* 320px */
  --container-sm: 24rem;   /* 384px */
  --container-md: 28rem;   /* 448px */
  --container-lg: 32rem;   /* 512px */
  --container-xl: 38rem;   /* 608px */
}

```

#### Usage in HTML/JSX

```tsx
export function Card() {
  return (
    /* 1. Mark the parent as a container */
    <div className="@container">
      {/* 2. Style children using @<breakpoint> modifiers */}
      <article className="flex flex-col @sm:flex-row gap-4 p-4 bg-surface rounded-xl">
        <div className="w-full @sm:w-32 aspect-video bg-slate-200 rounded-lg shrink-0" />
        <div className="flex-1">
          <h3 className="text-base @md:text-lg font-bold">Responsive Card Title</h3>
          <p className="text-sm text-muted line-clamp-2 @lg:line-clamp-none">
            This card responds to its container width rather than the viewport.
          </p>
        </div>
      </article>
    </div>
  );
}

```

---

### Step 2: Typography Plugin (`@tailwindcss/typography`)

The typography plugin provides the `prose` classes for styling raw HTML/Markdown content.

#### 1. Install the Plugin Package

```bash
npm install -D @tailwindcss/typography

```

#### 2. Register via `@plugin` in CSS

Load the plugin directly in your CSS entry point:

```css
/* app/globals.css or src/index.css */
@import "tailwindcss";
@plugin "@tailwindcss/typography";

```

#### 3. Usage with Markdown & Rich Text

Apply `prose` to any container wrapping rendered HTML:

```tsx
export function BlogPost({ contentHtml }: { contentHtml: string }) {
  return (
    <article
      className="prose prose-slate dark:prose-invert prose-headings:font-bold prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-img:rounded-2xl max-w-none"
      dangerouslySetInnerHTML={{ __html: contentHtml }}
    />
  );
}

```

---

### Step 3: Customizing Typography with `@theme`

You can customize the prose styles and colors via CSS custom properties and standard variant modifiers:

```css
/* app/globals.css */
@import "tailwindcss";
@plugin "@tailwindcss/typography";

/* Global overrides for prose elements */
@layer components {
  .prose {
    --tw-prose-body: var(--color-foreground);
    --tw-prose-headings: var(--color-foreground);
    --tw-prose-links: var(--color-primary);
    --tw-prose-code: var(--color-primary);
    --tw-prose-quotes: var(--color-muted);
  }
}

```

---

### Legacy Note (Tailwind CSS v3 Setup)

If you are maintaining a legacy Tailwind CSS v3 project with `tailwind.config.js`:

1. Install both packages:

```bash
npm install -D @tailwindcss/typography @tailwindcss/container-queries

```

1. Add them to `plugins` in `tailwind.config.js`:

```javascript
// tailwind.config.js (v3 only)
module.exports = {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/container-queries"),
  ],
};

```
