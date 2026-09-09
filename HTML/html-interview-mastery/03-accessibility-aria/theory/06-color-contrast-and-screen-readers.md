***  06-color-contrast-and-screen-readers.md ***

# Color Contrast Basics and Screen Reader Considerations

## WCAG contrast ratios

Contrast ratio is a mathematical measure (from 1:1 to 21:1) of the luminance difference between foreground text and its background, defined by a formula in the WCAG spec — not a subjective "does it look readable" judgment.

| Content type | WCAG AA minimum | WCAG AAA minimum |
|---|---|---|
| Normal text | 4.5:1 | 7:1 |
| Large text (≥18pt, or ≥14pt bold) | 3:1 | 4.5:1 |
| UI components / graphical objects (icons, input borders, focus indicators) | 3:1 (WCAG 2.1, criterion 1.4.11) | — (no AAA-specific value defined) |

"Large text" gets a lower bar because larger glyphs remain legible at lower contrast than small text does — this is a real, deliberate distinction in the spec, not an approximation.

## Why contrast matters beyond "low vision users"

Low contrast affects far more people than a narrow "visually impaired" category suggests: anyone using a phone outdoors in bright sunlight, anyone with an aging or lower-quality monitor, anyone with even mild, undiagnosed color-vision differences (color-vision deficiency affects roughly 1 in 12 men), and anyone simply tired or in a low-light environment browsing a bright screen. This is why contrast fixes tend to have unusually broad, immediate impact relative to effort.

## Tools

- **Browser DevTools** (Chrome/Firefox): inspecting a text element's color shows a contrast ratio directly in the color picker, often with a pass/fail indicator against AA/AAA.
- **WebAIM Contrast Checker** — a standalone tool for checking two hex colors against each other.
- **axe DevTools / Lighthouse** — automated page-wide contrast auditing (though these can't catch contrast issues in dynamically-generated content or images-of-text without additional configuration).

## Color alone must never be the only signal

WCAG 1.4.1 (Use of Color) requires that information conveyed by color also be conveyed through at least one other means (text, icon, pattern, underline) — a form field that turns red on error but has no icon/text change is inaccessible to colorblind users who may not perceive the red at all, and to screen reader users regardless of their vision.

```html
<!-- BAD: color is the only signal -->
<input style="border-color: red">

<!-- GOOD: color + icon + text, and the actual state is programmatically exposed too -->
<input aria-invalid="true" aria-describedby="err">
<p id="err">⚠ This field is required.</p>
```

## Core screen reader behavior concepts

- Screen readers read the **accessibility tree**, not raw visual layout — visually hiding something with `display: none`/`visibility: hidden` also removes it from the accessibility tree (correctly, for genuinely non-content decoration); but visually hiding text with only `opacity: 0` or `color: transparent` typically does **not** remove it from the accessibility tree, meaning sighted users and screen reader users can end up perceiving completely different content if this distinction is used incorrectly.
- A **visually-hidden but AT-accessible** utility class (see the snippets folder for the exact CSS) is the standard technique for content that should be announced but not visually shown — e.g. an icon button's textual label when the icon alone is meant to be the visual affordance.
- Screen readers announce content largely in **DOM order**, not CSS visual order — this is the same underlying principle as focus order (see the keyboard-navigation theory file): a CSS-only visual reordering (`order`, `position`) can create a mismatch between what's seen and what's heard/tabbed to.
- `aria-hidden="true"` removes an element (and its descendants) from the accessibility tree entirely, even if it's still visually present — useful for purely decorative icons/images sitting next to real text, but dangerous if applied to something containing the *only* copy of otherwise-important content, or to an ancestor of a focusable element (rule 4 from the ARIA theory file).
