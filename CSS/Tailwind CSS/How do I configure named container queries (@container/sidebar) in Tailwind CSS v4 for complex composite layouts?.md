***  sidebar) in Tailwind CSS v4 for complex composite layouts?.md ***

In Tailwind CSS v4, container queries are built-in natively and do not require the legacy `@tailwindcss/container-queries` plugin.

Named containers solve the problem of nested or composite layouts where a deeply nested child component needs to respond specifically to an outer panel or sidebar container rather than its closest parent container.

---

### Step 1: Define Named Container Sizes in `@theme`

Container size tokens are configured using the `--container-*` namespace in `globals.css`. You can define custom named container sizes or override the default widths:

```css
/* app/globals.css */
@import "tailwindcss";

@theme {
  /* Custom container query breakpoint tokens */
  --container-xs: 20rem;   /* 320px */
  --container-sm: 24rem;   /* 384px */
  --container-md: 28rem;   /* 448px */
  --container-lg: 32rem;   /* 512px */
  --container-xl: 36rem;   /* 576px */
  --container-2xl: 42rem;  /* 672px */
}

```

---

### Step 2: Declare Named Containers on Ancestor Elements

To name a container, apply `@container/{name}` to the parent container. This sets `container-type: inline-size` and assigns a `container-name` in CSS:

```html
<!-- Named container for a sidebar -->
<aside class="@container/sidebar w-full md:w-80">...</aside>

<!-- Named container for the main content area -->
<main class="@container/main flex-1">...</main>

```

---

### Step 3: Target Named Containers in Nested Components

Target a specific named container using the `@<size>/{name}:<utility>` or `@{name}:<utility>` syntax:

```tsx
// components/ComplexLayout.tsx
export function ComplexLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground">
      
      {/* 1. SIDEBAR CONTAINER */}
      <aside className="@container/sidebar w-full md:w-80 border-r border-border p-4">
        <h2 className="text-xs uppercase font-bold text-muted-foreground tracking-wider mb-4">
          Sidebar Panel
        </h2>

        {/* This card responds specifically to the sidebar's width */}
        <div className="p-4 rounded-xl bg-surface border border-border flex flex-col gap-2">
          {/* Default stacked layout; switches to row if sidebar expands past 384px (sm) */}
          <div className="flex flex-col @sm/sidebar:flex-row @sm/sidebar:items-center justify-between gap-2">
            <span className="font-semibold text-sm">Storage Usage</span>
            <span className="text-xs text-muted-foreground">78% used</span>
          </div>

          {/* Hide extra details when sidebar is narrower than md (448px) */}
          <p className="text-xs text-muted-foreground hidden @md/sidebar:block">
            Pro Plan includes unlimited team revisions and CDN storage.
          </p>
        </div>
      </aside>

      {/* 2. MAIN CONTENT CONTAINER */}
      <main className="@container/main flex-1 p-6">
        <div className="space-y-6">
          <header className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>
            <p className="text-sm text-muted-foreground">
              Components inside this region query the main viewport rather than the sidebar.
            </p>
          </header>

          {/* Grid that responds strictly to the main container's inline size */}
          <section className="grid grid-cols-1 @md/main:grid-cols-2 @xl/main:grid-cols-3 gap-4">
            <Card title="Analytics" />
            <Card title="Active Users" />
            <Card title="Revenue Stream" />
          </section>
        </div>
      </main>
    </div>
  );
}

function Card({ title }: { title: string }) {
  return (
    // Card uses unnamed @container for its own local micro-adaptations
    <div className="@container p-5 rounded-2xl bg-surface border border-border flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base">{title}</h3>
        {/* Badge appears only when the card itself is at least 320px wide */}
        <span className="hidden @xs:inline-block px-2 py-0.5 text-xs font-medium rounded-md bg-primary/10 text-primary">
          Live
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        Local padding and internal micro-spacing scale based on this individual card's inline size.
      </p>
    </div>
  );
}

```

---

### Step 4: Arbitrary Named Container Breakpoints

If you need a one-off inline threshold for a named container without registering a token in `@theme`, use Tailwind v4 arbitrary bracket syntax `@[<value>]/{name}`:

```html
<!-- Triggers flex-row when @container/sidebar is wider than 350px -->
<div class="flex flex-col @[350px]/sidebar:flex-row gap-4">
  <button class="w-full @[350px]/sidebar:w-auto px-4 py-2 bg-primary text-primary-foreground rounded-lg">
    Submit
  </button>
</div>

```

---

### Syntax Summary Reference

| Syntax Pattern              | CSS Equivalent                                                                             | Behavior                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------- |
| `@container`                | `container-type: inline-size;`                                                             | Anonymous container (queried by immediate descendants).                   |
| `@container/sidebar`        | `container-type: inline-size; container-name: sidebar;`                                    | Named container identifier.                                               |
| `@md/sidebar:flex-row`      | `@container sidebar (min-width: 28rem) { flex-direction: row; }`                           | Queries the named container `sidebar` against the `--container-md` token. |
| `@[400px]/main:grid-cols-2` | `@container main (min-width: 400px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }` | Arbitrary pixel threshold on named container `main`.                      |
| `@max-md/sidebar:hidden`    | `@container sidebar (max-width: 28rem) { display: none; }`                                 | Max-width query on named container `sidebar`.                             |
