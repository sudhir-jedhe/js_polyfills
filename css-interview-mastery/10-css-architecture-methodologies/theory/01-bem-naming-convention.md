# BEM: Block, Element, Modifier

BEM is a naming convention (not a build tool or framework) for writing flat, self-documenting, low-specificity class names. It exists to solve a very specific problem: as a codebase grows, nested selectors like `.card .title.active` become fragile — they depend on markup structure staying exactly the same, and their specificity creeps upward until overriding anything requires more nesting or `!important`.

## The three pieces

- **Block** — a standalone, reusable component: `.card`, `.nav`, `.button`
- **Element** — a part of a block that has no standalone meaning outside it, written as `block__element`: `.card__title`, `.card__image`, `.nav__item`
- **Modifier** — a variant or state of a block or element, written as `block--modifier` or `block__element--modifier`: `.card--featured`, `.button--disabled`, `.card__title--large`

```html
<div class="card card--featured">
  <img class="card__image" src="..." />
  <h3 class="card__title card__title--large">Featured Post</h3>
  <p class="card__body">...</p>
  <button class="card__cta card__cta--disabled" disabled>Read more</button>
</div>
```

```css
.card { border-radius: 8px; padding: 1rem; }
.card--featured { border: 2px solid gold; }
.card__title { font-size: 1.1rem; }
.card__title--large { font-size: 1.5rem; }
.card__cta--disabled { opacity: 0.5; pointer-events: none; }
```

## Why BEM keeps specificity flat

Every BEM class is a **single class selector** — specificity (0,1,0), always. There's no `.card .card__title` nesting in the CSS (even though `card__title` is nested in the *markup*), because the element's full context is already baked into its name. This means:

- No selector in a BEM-authored stylesheet is ever more specific than any other (barring modifiers stacked as extra classes, which is still flat: `0,2,0` at most for `block__element.block__element--modifier` written together).
- Overriding a BEM rule never requires escalating specificity — you just add a modifier class.
- A component's CSS can be understood by reading its class names alone, without needing to see the HTML nesting.

## Common BEM mistakes

| Mistake | Why it's a problem | Fix |
|---|---|---|
| `.card .card__title` (nesting element under block in CSS) | Reintroduces the specificity/coupling BEM exists to avoid | `.card__title` alone |
| Elements nested more than one level deep, e.g. `.card__header__title` | BEM elements shouldn't nest further — an element belongs to the block, not to another element | Flatten to `.card__title` even if visually nested inside `.card__header` |
| Modifier used without the base class, e.g. `<div class="card--featured">` alone | `--featured` alone carries no base styling, only the delta | Always pair: `class="card card--featured"` |

BEM is a naming discipline, and it pairs naturally with the structural ideas in OOCSS/SMACSS covered next — those methodologies are about *organizing* stylesheets, while BEM is about *naming* individual classes within them.
