***  03-accessible-multi-nav-site.md ***

# Scenario: A Documentation Site with Global Nav, Sidebar Nav, and In-Page TOC

**Scenario:** You're building a docs site (think a framework's documentation) with three distinct navigational regions on every page: a global top nav, a collapsible sidebar with the full docs tree, and an in-page "on this page" table of contents. A screen reader user files a bug: "I can't tell which navigation region is which when I open the landmarks list." How do you fix it, and how do you structure the page overall?

**Diagnosis:** Each nav region is a real, distinct `<nav>` landmark — that part is already correct — but without an accessible name, they're all announced identically as just "navigation," so the landmarks list becomes useless for choosing between them at a glance.

**Fix:**

```html
<body>
  <header>
    <nav aria-label="Primary">
      <a href="/">Docs Home</a>
      <a href="/guides">Guides</a>
      <a href="/api">API Reference</a>
    </nav>
  </header>

  <div class="layout"> <!-- pure layout wrapper, no semantic meaning, div is correct here -->
    <nav aria-label="Documentation sections" class="sidebar">
      <ul>
        <li><a href="/guides/getting-started">Getting Started</a></li>
        <li><a href="/guides/routing">Routing</a></li>
      </ul>
    </nav>

    <main>
      <h1>Routing</h1>
      <p>...</p>

      <nav aria-label="On this page">
        <ul>
          <li><a href="#basic-routes">Basic Routes</a></li>
          <li><a href="#dynamic-routes">Dynamic Routes</a></li>
        </ul>
      </nav>

      <h2 id="basic-routes">Basic Routes</h2>
      <p>...</p>
      <h2 id="dynamic-routes">Dynamic Routes</h2>
      <p>...</p>
    </main>
  </div>

  <footer><!-- ... --></footer>
</body>
```

**Why this resolves the bug:** `aria-label` gives each `<nav>` a distinct accessible name — "Primary", "Documentation sections", "On this page" — so the landmarks list now reads as three clearly differentiated entries instead of three identical "navigation" ones. Note the outer `.layout` wrapper is deliberately a plain `<div>`: it exists purely to enable a CSS Grid/Flexbox two-column layout and carries no thematic meaning of its own, so reaching for a semantic tag there would actually be *wrong* — a reminder that "use semantic tags" doesn't mean eliminating `<div>` entirely, just using it only where nothing more specific applies.
