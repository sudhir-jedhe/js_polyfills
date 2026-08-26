*** copy 05-accessible-names.md ***

# Accessible Names: `<label>` vs. `aria-label` vs. `aria-labelledby`

The **accessible name** is the string a screen reader announces to identify a UI element — every interactive element needs one (WCAG 4.1.2). There are multiple ways to provide it, and browsers/AT compute the final name using a well-defined precedence order called the **accessible name computation algorithm**.

## The three main mechanisms

| Mechanism | How it works | When to prefer it |
|---|---|---|
| `<label for="id">` / wrapping `<label>` | Native HTML association with a form control | Default choice for any form field — visible, works for sighted and non-sighted users alike |
| `aria-labelledby="id"` | Points to the `id` of one or more *other* elements whose text content becomes the name | When the visible label text already exists elsewhere in the DOM and you don't want to duplicate it |
| `aria-label="text"` | A string provided directly in the attribute, with **no visible on-screen text** | Icon-only buttons, or any control with no visual text label at all |

## Precedence: what wins when multiple are present

```html
<button aria-labelledby="lbl" aria-label="Ignored label" title="Also ignored">
  Visible text (also ignored)
</button>
<span id="lbl">Actual announced name</span>
```

The precedence order (highest to lowest) is roughly:

1. `aria-labelledby` (if present, wins outright over everything else)
2. `aria-label`
3. Native labeling mechanism (`<label for>`, or for non-form elements, visible text content)
4. `title` attribute (last resort — also shows a tooltip, but is unreliable for touch/keyboard users who can't hover)

**This means `aria-label` silently overrides visible text content** — a very common real bug: adding `aria-label="Submit"` to a `<button>Send Message</button>` makes screen readers announce "Submit" while sighted users see "Send Message," creating a confusing mismatch for anyone switching between input modes (e.g. voice control users who say what they visually see, then are confused it doesn't match what's programmatically exposed).

## Concrete comparison example

```html
<!-- Native label — best default for form fields -->
<label for="search">Search</label>
<input id="search" type="search">

<!-- aria-labelledby — reuses existing visible text as the name -->
<h2 id="billing-heading">Billing Address</h2>
<section aria-labelledby="billing-heading">...</section>

<!-- aria-label — no visible text exists, so provide the name directly -->
<button aria-label="Close dialog">
  <svg aria-hidden="true"><!-- X icon --></svg>
</button>
```

In the icon-button example, `aria-hidden="true"` on the SVG prevents the icon's own content (if any text/title exists inside it) from being announced redundantly alongside the button's `aria-label` — the button's accessible name is the sole source of truth for what gets announced.

## Accessible name vs. accessible description

These are two distinct concepts that are easy to conflate:
- **Name** (`aria-label`/`aria-labelledby`/`<label>`) — identifies *what* the element is.
- **Description** (`aria-describedby`) — provides *additional* supplementary detail, announced after the name, typically on focus (e.g. an error message, a hint, extra format instructions).

```html
<label for="pw">Password</label>
<input id="pw" type="password" aria-describedby="pw-hint">
<p id="pw-hint">Must be at least 8 characters, including one number.</p>
```

A screen reader announces something like "Password, edit text, protected — Must be at least 8 characters, including one number" — the name and description are concatenated but semantically distinct in the accessibility tree, and only the name is used for things like "find this control by its name" voice-control commands.
