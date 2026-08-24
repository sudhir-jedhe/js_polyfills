# Snippet: Multiple `<nav>` Regions on One Page

A page can have more than one `<nav>` — primary navigation, breadcrumbs, table of contents, pagination — but each one needs a distinct accessible name via `aria-label` so screen reader users can tell them apart when they're listed together in a landmarks menu.

```html
<header>
  <nav aria-label="Primary">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/docs">Docs</a></li>
    </ul>
  </nav>
</header>

<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/docs">Docs</a></li>
    <li><a href="/docs/html">HTML</a></li>
    <li aria-current="page">Semantic Elements</li>
  </ol>
</nav>

<main>
  <article>
    <h1>Semantic Elements</h1>
    <p>Article content…</p>

    <nav aria-label="Table of contents">
      <ul>
        <li><a href="#intro">Introduction</a></li>
        <li><a href="#usage">Usage</a></li>
      </ul>
    </nav>
  </article>

  <nav aria-label="Pagination">
    <a href="/docs/html/previous">&larr; Previous</a>
    <a href="/docs/html/next">Next &rarr;</a>
  </nav>
</main>
```

Without `aria-label`, a screen reader's landmarks list would show four entries all just labeled "navigation," forcing the user to open each one to figure out which is which — the label turns that into "Primary navigation," "Breadcrumb navigation," "Table of contents navigation," "Pagination navigation."
