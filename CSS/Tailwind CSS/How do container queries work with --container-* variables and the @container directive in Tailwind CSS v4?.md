***  How do container queries work with --container-* variables and the @container directive in Tailwind CSS v4?.md ***

In Tailwind CSS v4, container queries are built natively into the core engine—no external `@tailwindcss/container-queries` plugin is required.

Instead of querying the global viewport width, container queries allow a child component to adapt its layout based on the width of its **direct parent container**.

---

### 1. The Core Workflow

**Step A: Mark the Parent Element as a Container**
Add the `@container` class to the parent wrapper (`container-type: inline-size;`).

**Step B: Apply Container Query Modifiers on Children**
Use the `@<breakpoint>:` prefix on child elements (e.g., `@sm:`, `@md:`, `@lg:`).

```html
<!-- Parent Container -->
<div class="@container">
  <!-- Child adjusts based on PARENT width, not viewport width -->
  <div class="flex flex-col @md:flex-row @xl:grid @xl:grid-cols-3 gap-4">
    <div>Item 1</div>
    <div>Item 2</div>
    <div>Item 3</div>
  </div>
</div>

```

---

### 2. Built-in Container Query Scale

Tailwind v4 provides a default container query size scale mapped via `--container-*` tokens:

| Variant | Default Container Width |
| ------- | ----------------------- |
| `@3xs:` | `16rem` (256px)         |
| `@2xs:` | `18rem` (288px)         |
| `@xs:`  | `20rem` (320px)         |
| `@sm:`  | `24rem` (384px)         |
| `@md:`  | `28rem` (448px)         |
| `@lg:`  | `32rem` (512px)         |
| `@xl:`  | `36rem` (576px)         |
| `@2xl:` | `42rem` (672px)         |
| `@3xl:` | `48rem` (768px)         |
| `@4xl:` | `56rem` (896px)         |
| `@5xl:` | `64rem` (1024px)        |
| `@6xl:` | `72rem` (1152px)        |
| `@7xl:` | `80rem` (1280px)        |

---

### 3. Customizing Container Widths with `--container-*`

Extend or override container breakpoints using the `@theme` directive in your main CSS file:

```css
@import "tailwindcss";

@theme {
  /* Add custom named container query widths */
  --container-card-sm: 20rem;   /* 320px */
  --container-card-lg: 38rem;   /* 608px */
  --container-sidebar: 250px;
}

```

**Usage:**

```html
<div class="@container">
  <div class="p-4 @card-sm:p-6 @card-lg:flex @card-lg:items-center">
    <p>Responsive to card size</p>
  </div>
</div>

```

---

### 4. Named Containers (Nested Contexts)

When nesting containers, child elements might need to query a specific ancestor rather than the immediate parent. You can name containers using `@container/<name>` and target them with `@<name>/<size>:`:

```html
<!-- Outer Container named 'sidebar' -->
<aside class="@container/sidebar w-80">
  
  <!-- Nested Inner Container named 'card' -->
  <div class="@container/card">
    
    <!-- Queries ONLY the outer 'sidebar' container width -->
    <div class="block @sidebar/md:hidden">
      Sidebar is small
    </div>

    <!-- Queries ONLY the immediate 'card' container width -->
    <div class="text-sm @card/lg:text-lg">
      Card title
    </div>

  </div>
</aside>

```

---

### 5. Arbitrary Container Query Values

For one-off adjustments without adding tokens to `@theme`, use bracket syntax:

```html
<div class="@container">
  <div class="hidden @[450px]:block @[35rem]:flex">
    Arbitrary container breakpoint
  </div>
</div>

```
