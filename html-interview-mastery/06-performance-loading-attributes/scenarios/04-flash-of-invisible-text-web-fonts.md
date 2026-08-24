# Scenario: A Flash of Invisible Text on Every Page Load

**Scenario:** The site uses a custom web font loaded via `@font-face` inside a stylesheet referenced with a normal `<link rel="stylesheet">`. Users consistently see roughly half a second where all text is completely invisible before the custom font suddenly appears. Design wants the flash gone, but doesn't want to lose the custom font. How do you fix this?

**Diagnosis:** This is FOIT — Flash of Invisible Text — a specific behavior of some browsers where, by default, text using a not-yet-loaded custom font is rendered invisible (rather than with a fallback font) for a short "block" period before either the font loads or a fallback kicks in. There are two independent levers here: (1) how long the browser blocks text from *any* fallback rendering while waiting on the font, controlled by `font-display`, and (2) how *late* the font file itself starts downloading, which is affected by whether the browser discovers it early.

**Fix, part 1 — `font-display: swap`:**

```css
@font-face {
  font-family: 'Brand Sans';
  src: url('/fonts/brand-sans.woff2') format('woff2');
  font-display: swap; /* show fallback text IMMEDIATELY, swap to custom font once ready */
}
```

`font-display: swap` tells the browser to render text with a fallback font right away (no invisible-text block period at all) and simply swap the font in-place once the custom font finishes loading — eliminating the invisible-text flash entirely, at the cost of a brief, much less jarring font-swap moment instead.

**Fix, part 2 — `preload` the actual font file:**

```html
<link rel="preload" href="/fonts/brand-sans.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/styles/fonts.css">
```

Without `preload`, the browser doesn't even know the font file exists until it has fetched *and* parsed `fonts.css` and reached the `@font-face` rule inside it — a needless delay, since the font's URL is known ahead of time by the developer even if the browser can't discover it early on its own. `preload` starts that fetch immediately, in parallel with everything else, shortening the window during which `swap`'s fallback font is visibly showing before the real font takes over.

**Why both fixes together, not just one:** `font-display: swap` alone removes the *invisible* text but the fallback-to-custom-font swap would still happen later than necessary, since the font file itself starts downloading late. `preload` alone speeds up the fetch but doesn't change the default invisible-text blocking behavior on browsers that apply it. Combined, text is visible immediately (via `swap`'s fallback) and the custom font swaps in as early as technically possible (via `preload`) — the shortest possible window of "wrong" font, with zero invisible text at any point.
