# OOCSS and SMACSS

Both predate BEM's popularity and address a broader question: not just how to *name* classes, but how to *organize* and *think about* CSS so it scales.

## OOCSS — Object-Oriented CSS

OOCSS (Nicole Sullivan) proposes two core principles:

**1. Separate structure from skin.** Structural properties (layout, sizing, positioning) go in one class; visual/"skin" properties (colors, borders, shadows) go in another, so the same structure can be reused with different skins.

```css
/* structure */
.btn {
  display: inline-block;
  padding: 0.6em 1.2em;
  border-radius: 6px;
  font-weight: 600;
}
/* skins — mixed and matched onto the same structural class */
.btn-primary { background: #2563eb; color: white; }
.btn-outline { background: transparent; border: 1px solid #2563eb; color: #2563eb; }
```

**2. Separate container from content.** A component shouldn't be styled based on *where* it lives in the page (`.sidebar h3 { ... }`), because that ties its appearance to a specific layout location and breaks the moment it's reused elsewhere. Style the component by its own class instead.

```css
/* Bad — tightly coupled to being inside .sidebar */
.sidebar h3 { font-size: 1.1rem; color: #333; }

/* Good — works anywhere the component is placed */
.widget-title { font-size: 1.1rem; color: #333; }
```

OOCSS's main contribution is the mindset: think in terms of reusable visual "objects," not page-specific selectors.

## SMACSS — Scalable and Modular Architecture for CSS

SMACSS (Jonathan Snook) proposes categorizing every rule into one of five buckets, which also implies a file/import order:

| Category | Purpose | Example |
|---|---|---|
| **Base** | Element defaults, no classes — resets and base typography | `body { }`, `a { }`, `h1 { }` |
| **Layout** | Major structural regions of a page | `.l-header`, `.l-sidebar`, `.grid` |
| **Module** | Reusable, self-contained components | `.card`, `.nav`, `.modal` |
| **State** | A JS-toggled or conditional state, often with `!important` reserved for genuine overrides | `.is-active`, `.is-hidden`, `.is-loading` |
| **Theme** | Visual theming that can be swapped independently of structure | `.theme-dark .card { }` |

SMACSS's state category is a useful, often-missed idea: state classes like `.is-active` are prefixed distinctly so it's immediately obvious in markup that a class is JS-toggled rather than a permanent structural/visual class — this distinction reduces confusion about which classes are "always on" versus conditionally applied.

## How these relate to BEM

BEM, OOCSS, and SMACSS aren't mutually exclusive — a very common real-world stack is: SMACSS-style file/category organization, OOCSS's structure/skin separation as a design principle, and BEM as the actual class-naming syntax used within Module-category files. None of them require a specific build tool; they're conventions you can adopt incrementally.
