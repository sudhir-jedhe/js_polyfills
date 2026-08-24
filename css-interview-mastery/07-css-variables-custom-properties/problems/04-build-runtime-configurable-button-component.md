# Problem: Build a Runtime-Configurable Button Component (No Rebuild, No New CSS Classes per Variant)

## Problem Statement

Build a single `.btn` component whose color, size, and corner roundness can each be configured per-instance, purely via inline custom properties (e.g. set through a JS design tool, a CMS-driven page builder, or a Storybook-style controls panel) — without needing a new CSS class or a rebuild for every possible combination of color/size/roundness a content editor might want.

## Requirements

- A single `.btn` class with sensible defaults.
- Per-instance overrides for background color, text color, size (padding + font-size, as a coordinated pair, not independently), and corner radius — settable via inline `style` attributes or JS, without writing new CSS.
- Hover and focus states must correctly derive from whatever color is configured, not be hardcoded to one fixed brand color.
- Must remain usable/legible with arbitrary consumer-provided colors (i.e. don't hardcode assumptions that only work for the default blue).

## Approach

Expose every visually-configurable aspect as a custom property with a default, including a "size" token that itself expands into multiple concrete values via `calc()`, and derive the hover state from the base color using `filter` (works for arbitrary colors, unlike a hardcoded darker hex value that would only look right for one specific brand color) rather than a second hardcoded custom property that a consumer would otherwise have to remember to set in sync with the base color.

## Solution

```html
<button class="btn">Default</button>

<button class="btn" style="--btn-bg: #16a34a; --btn-radius: 999px;">
  Custom green, pill-shaped
</button>

<button class="btn" style="--btn-size: 1.25;">
  Larger
</button>
```

```css
.btn {
  --btn-bg: #3b82f6;
  --btn-text: #ffffff;
  --btn-radius: 6px;
  --btn-size: 1; /* a single scale multiplier — NOT independently-set padding/font-size */

  background: var(--btn-bg);
  color: var(--btn-text);
  border: none;
  border-radius: var(--btn-radius);
  padding: calc(8px * var(--btn-size)) calc(16px * var(--btn-size));
  font-size: calc(0.9375rem * var(--btn-size));
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.05s ease;
}

.btn:hover {
  /* Derives a hover state from whatever --btn-bg happens to be, rather than a second
     hardcoded custom property a consumer could forget to keep in sync — works correctly
     for ANY consumer-provided color, not just the default blue. */
  filter: brightness(0.9);
}

.btn:active {
  transform: scale(0.97);
}

.btn:focus-visible {
  outline: 2px solid var(--btn-bg);
  outline-offset: 2px;
}
```

**Why `--btn-size` is a single multiplier rather than separately-settable `--btn-padding`/`--btn-font-size`:** coupling padding and font-size to one scale value guarantees they always change together proportionally — a consumer setting only `--btn-size: 1.25` gets a coherently larger button, rather than risking an awkward combination like large padding with unchanged (relatively tiny-looking) text, which could happen if the two were independent custom properties a consumer might only think to set one of.

**Why `filter: brightness(0.9)` instead of a second `--btn-bg-hover` custom property:** a second custom property would need to be manually kept in sync with `--btn-bg` by every consumer setting a custom color — easy to forget, and easy to get subtly wrong (a hover shade that doesn't actually read as "the same color, slightly darker"). Deriving the hover state algorithmically from whichever `--btn-bg` is actually in effect guarantees a correct, coherent hover state for literally any color a consumer provides, with zero additional configuration required, at the cost of losing fine-grained manual control over the exact hover shade — an acceptable tradeoff for a general-purpose, runtime-configurable component like this one.
