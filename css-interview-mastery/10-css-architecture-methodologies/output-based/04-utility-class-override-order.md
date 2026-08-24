# Utility Class Conflict: Which One Wins?

```html
<div class="text-left text-center">Hello</div>
```

```css
.text-left { text-align: left; }
.text-center { text-align: center; }
```

**Question:** What's the final text alignment?

**Answer:** `center` — but only because `.text-center` is declared *after* `.text-left` in the stylesheet's source order. If the two rules were swapped in the CSS file (with the HTML unchanged), the result would be `left` instead.

**Why:** Both classes have identical specificity (0,1,0), and both are applied to the same element. With no `@layer` involved and no `!important`, ties in specificity are broken purely by **source order** in the compiled stylesheet — not by the order the classes appear in the `class` attribute (that order is irrelevant to CSS resolution; only markup order for other purposes, like class-list APIs, cares about attribute order). This is exactly why real utility-class frameworks like Tailwind ship a specific, deliberate rule-generation order (and often layer their utilities via `@layer utilities`) — so that "last utility class listed in HTML wins" isn't accidentally reversed by whatever order the build tool happens to emit the CSS in.
