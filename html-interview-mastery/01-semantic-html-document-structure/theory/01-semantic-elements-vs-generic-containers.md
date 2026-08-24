# Semantic Elements vs. Generic Containers

"Semantic HTML" means picking an element because of what it *means*, not because of how a browser happens to style it by default. `<div>` and `<span>` carry zero semantic meaning — they exist purely as generic hooks for CSS/JS. Every other structural element carries meaning that assistive technology, search engines, and browsers can act on.

## The core landmark elements

| Element | Meaning | Landmark role (implicit ARIA) |
|---|---|---|
| `<header>` | Introductory content for its nearest sectioning ancestor (or the page, if top-level) — usually a logo, title, nav | `banner` (only when a direct child of `<body>`) |
| `<nav>` | A block of major navigation links | `navigation` |
| `<main>` | The dominant, unique content of the document — excludes repeated boilerplate like nav/header/footer | `main` (one per page) |
| `<article>` | Self-contained content that would make sense distributed/syndicated on its own (a blog post, a forum comment, a product card) | `article` |
| `<section>` | A thematic grouping of content, typically with its own heading | `region` (only if it has an accessible name) |
| `<aside>` | Content tangentially related to the surrounding content (sidebars, pull quotes, ads) | `complementary` |
| `<footer>` | Closing content for its nearest sectioning ancestor (or the page) — copyright, links, author info | `contentinfo` (only when a direct child of `<body>`) |

Each of these, when used correctly, is automatically exposed as a **landmark** in the accessibility tree. Screen reader users can jump directly between landmarks (e.g. "go to main content", "go to navigation") the same way sighted users visually scan a page layout — this navigation shortcut simply doesn't exist for a page built entirely out of `<div>`s.

## `<header>`/`<footer>` are contextual, not singular

A common misconception is that `<header>` and `<footer>` can only appear once per page. In fact they're scoped to their nearest sectioning ancestor — an `<article>` can have its own `<header>` (byline, publish date) and `<footer>` (tags, author bio) completely independent of the page's global header/footer:

```html
<body>
  <header>Site logo + global nav</header>
  <main>
    <article>
      <header><h2>Post Title</h2><p>By Jane, March 2026</p></header>
      <p>Post content…</p>
      <footer>Tags: html, accessibility</footer>
    </article>
  </main>
  <footer>© 2026 Site Name</footer>
</body>
```

## `<article>` vs. `<section>` — the test that actually works

This is the single most-asked distinction in interviews:

- **`<article>`**: ask "would this content still make complete sense if I pulled it out and put it on a completely different site, in an RSS feed, or syndicated elsewhere?" A blog post, a news story, a single product listing, a forum post, a user comment — all yes.
- **`<section>`**: a thematic chunk of a *larger* document that doesn't stand alone. A "Reviews" section on a product page, or a "Skills" section on a resume — meaningless outside the page they live in.

Articles can contain sections (a long article broken into thematic parts), and sections can contain articles (a "Latest Posts" section containing several `<article>` blog post previews) — nesting depends on which one is the standalone unit.

## When `<div>`/`<span>` are still correct

`<div>` and `<span>` are not "bad" — they're correct whenever there is **no semantic meaning to express**, and you just need a styling/scripting hook:

- A wrapper purely for a CSS Grid/Flexbox layout that has no thematic meaning of its own
- A generic container for a JS widget's internal DOM structure
- Wrapping inline text purely to target it with a class (`<span class="highlight">`) when no more specific inline element (`<em>`, `<strong>`, `<mark>`, `<code>`) applies

The rule of thumb: **reach for a semantic element first; fall back to `div`/`span` only when nothing more specific fits.** Using `<section>` as a pure styling wrapper (with no heading, no thematic identity) is arguably worse than a `<div>`, because it pollutes the accessibility tree and document outline with a meaningless landmark.

## Comparison table: choosing the right element

| Need | Right choice |
|---|---|
| Page/site-wide navigation menu | `<nav>` |
| A self-contained blog post / comment / product card | `<article>` |
| A themed chunk of a longer document (with a heading) | `<section>` |
| Sidebar, pull quote, related links | `<aside>` |
| Purely visual grouping for layout, no meaning | `<div>` |
| Inline text needing a style hook, no semantic inline tag fits | `<span>` |
| Emphasized text (semantic stress) | `<em>` |
| Strong importance (semantic, not just bold) | `<strong>` |
