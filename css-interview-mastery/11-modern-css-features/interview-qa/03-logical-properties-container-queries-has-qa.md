# Interview Q&A — Logical Properties, Container Queries, and `:has()` Together

**Q: What's the difference between `margin-left` and `margin-inline-start`?**
`margin-left` is a physical property — it always refers to the literal left edge of the box, regardless of document writing direction. `margin-inline-start` is a logical property — it refers to the *start* edge of the inline axis, which is the left edge in LTR writing modes but the right edge in RTL writing modes (and can map to a vertical edge entirely in vertical writing modes). They produce identical results in an LTR document but diverge under `dir="rtl"` or `writing-mode: vertical-rl`.

**Q: Why would a component library default to logical properties even for a product that currently only ships in English?**
Because it makes any future RTL/i18n expansion (or vertical-writing-mode support) require zero CSS changes to already-authored components — the properties already resolve correctly per writing direction. Authoring with physical properties from the start means every future locale expansion requires retrofitting override rules across the entire codebase, which is much larger, riskier work than simply defaulting to logical properties from day one when the cost of doing so is nearly identical.

**Q: How do container queries relate to `:has()` — could you use them together?**
Yes — they solve different problems that can compose. `:has()` lets a rule react to what's *inside* an element (its descendants/content); container queries let a rule react to an element's own *size*. A common combined pattern: use `:has()` to conditionally opt an element into being a query container (e.g. `.panel:has(.panel__chart) { container-type: inline-size; }`), then use `@container` to adjust that chart's layout once the container is wide enough. (Full container query depth — `container-type`, `container-name`, `@container` syntax — lives in the responsive design topic.)

**Q: Give an example of `:has()` combined with logical properties.**
A form field group that flips its icon to the opposite logical edge depending on validity state, using `:has()` to detect the input's validity and a logical property so the icon placement is correct in both LTR and RTL:
```css
.field:has(input:invalid) .field__icon {
  inset-inline-end: 0.5rem; /* "far edge" regardless of writing direction */
  color: crimson;
}
```

**Q: Why is grouping `:has()`, logical properties, and container queries together a reasonable interview framing, even though they're unrelated features individually?**
Because they represent the same broader shift in CSS: capabilities that previously required JavaScript (`:has()` for parent selection, container queries for element-relative responsiveness) or careful manual RTL overrides (logical properties) are now handled natively and composably, and real components frequently combine two or more of them at once rather than using each in isolation.
