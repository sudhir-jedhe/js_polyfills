# Scenario: Color Contrast Audit Fails on a Brand-Driven Design

**Scenario:** An accessibility audit flags several elements failing WCAG AA contrast: light-gray placeholder-style body text (`#999` on white, used as actual body copy, not just placeholders), a brand-teal "Learn More" link (`#4FD1C5` on white), and white text on a light-blue info banner (`#FFF` on `#7FB3E8`). The brand team is reluctant to change "their" colors. How do you approach the fix while respecting brand constraints as much as possible?

**Diagnosis and math:**

- `#999` on `#FFFFFF` → contrast ratio ≈ **2.85:1** — fails even the lowest AA bar (4.5:1 for normal text) badly.
- `#4FD1C5` (teal) on white → contrast ratio ≈ **1.9:1** — fails badly; light, saturated colors on white are a very common brand-vs-accessibility collision point.
- White on `#7FB3E8` → contrast ratio ≈ **1.8:1** — also fails badly.

**Fix approach — darken rather than replace, to preserve brand identity:**

```css
/* Before: #999 body text on white — 2.85:1, fails */
/* After: darkened to #595959 — ~7:1, passes AA (and AAA) while staying visually "gray" */
body { color: #595959; }

/* Before: #4FD1C5 link on white — 1.9:1, fails */
/* After: darkened teal, #0F8A80 — ~4.6:1, passes AA while remaining recognizably teal-branded */
a { color: #0F8A80; }

/* Before: white text on #7FB3E8 banner — 1.8:1, fails */
/* After: darken the BACKGROUND instead of the text, preserving white text (often a stronger brand requirement) */
.info-banner { background: #2E5C99; color: #FFFFFF; } /* ~5.1:1, passes AA */
```

**Negotiating with brand/design:** the practical framing that usually works is "the exact hex value isn't the brand asset — the recognizable *hue* is." Darkening a color by adjusting lightness while keeping hue and saturation roughly constant (in HSL terms) preserves "does this still look like our teal/blue" far better than picking an arbitrary different color, and most design systems can absorb a contrast-driven shade adjustment as a "darker variant" token (`teal-600` vs. `teal-400`) rather than a wholesale rebrand. For the banner specifically, darkening the *background* instead of lightening/darkening the text is often the better trade when white text itself is a fixed brand requirement (e.g. it's used across many contexts).

**Process fix to prevent recurrence:** contrast failures like this are cheapest to catch before a color ever ships broadly — add automated contrast checks (e.g. via Storybook a11y addon, or a CI step running axe against key pages) so a new brand color that fails AA is caught in a PR review, not in a post-launch audit that now requires touching every place the color was already used in production.
