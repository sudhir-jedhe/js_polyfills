# `calc()` and Mixed-Unit Sizing

`calc()` lets you compute a CSS value from an expression that mixes **different units** — something plain arithmetic in CSS couldn't do before it (you can't otherwise combine, say, a percentage and a fixed pixel gutter into one value).

## Basic usage

```css
.sidebar-content {
  /* full width, minus a fixed 250px sidebar and a fixed 32px gap — impossible with a single % or px value alone */
  width: calc(100% - 250px - 32px);
}
```

Supported operators: `+`, `-`, `*`, `/`. Spacing around `+` and `-` is **required** (`calc(100% -20px)` is invalid and silently ignored — parsed as a single malformed token, not `100% - 20px`); `*` and `/` don't require spacing but it's conventional to include it anyway for readability.

## Common real-world patterns

```css
/* viewport height minus a fixed header, so a full-height section accounts for a sticky header */
.hero { height: calc(100vh - 64px); }

/* n equal columns with fixed gaps between them, in a non-grid/flex layout */
.column { width: calc((100% - 2 * 16px) / 3); } /* 3 columns, 16px gaps, 2 gaps total between 3 columns */

/* responsive font size that scales with viewport but has a floor */
.heading { font-size: calc(1rem + 1vw); }

/* mixing CSS custom properties into calc() */
.box { width: calc(var(--base-size) * 2); }
```

## Nesting and combining with `min()`/`max()`/`clamp()`

`calc()` can be nested inside `min()`, `max()`, and `clamp()` (and vice versa) for more expressive responsive sizing without media queries:

```css
/* never smaller than 1rem, never larger than 3rem, otherwise scales fluidly with viewport width */
.heading { font-size: clamp(1rem, 0.5rem + 2vw, 3rem); }

/* whichever is smaller: 90% of the viewport, or a hard 600px cap */
.modal { width: min(90vw, 600px); }
```

`clamp(MIN, PREFERRED, MAX)` is shorthand for `max(MIN, min(PREFERRED, MAX))` and has become the standard modern tool for fluid typography and spacing that used to require several breakpoint-specific media queries.
