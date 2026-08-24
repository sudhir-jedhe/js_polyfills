# Viewport Units: `vw`/`vh` and Why `dvh`/`svh`/`lvh` Exist

## The classic units

- `1vw` = 1% of the viewport's width
- `1vh` = 1% of the viewport's height
- `vmin` = the smaller of `vw`/`vh` at any given moment
- `vmax` = the larger of `vw`/`vh` at any given moment

```css
.hero {
  height: 100vh; /* intended: fill the full screen height */
  width: 100vw;
}
```

## The mobile problem: `100vh` is wrong on most mobile browsers

Mobile browsers (Safari on iOS being the most notorious example, but Chrome on Android has its own variant of this too) show and hide browser UI chrome — the address bar, tab bar, bottom toolbar — as the user scrolls. That UI chrome takes up real screen space that changes dynamically. The question "what counts as the viewport height" then has more than one reasonable answer, and historically, `vh` picked a *fixed* answer (usually the "largest" possible viewport, i.e. address bar hidden) that doesn't match what's actually visible the moment the page loads (address bar shown). This causes the classic mobile bug: a `height: 100vh` hero section is taller than the visible screen when the page first loads (because the address bar is still showing, eating into the real visible area), forcing an unwanted scroll or clipping content at the bottom, and then the layout can visibly shift as the user scrolls and the browser chrome collapses/reappears, since `100vh`'s fixed answer doesn't track it.

## The fix: dynamic, small, and large viewport units

Three new unit families were introduced specifically to give explicit control over which "viewport" definition you mean:

- **`svh` (small viewport height)** — height when the browser UI is at its *largest* / most expanded (address bar, toolbars all visible) — i.e. the *smallest* the available content area ever gets. `100svh` guarantees content fits even in the most cramped state, with no risk of the initial-load clipping problem.
- **`lvh` (large viewport height)** — height when the browser UI is at its *smallest* / fully collapsed (address bar hidden) — i.e. the *largest* the available content area ever gets. This is roughly what old `100vh` used to approximate on many mobile browsers.
- **`dvh` (dynamic viewport height)** — tracks the *actual current* state of the browser UI in real time, resizing live as the address bar shows/hides while the user scrolls. `100dvh` is almost always what you actually want for "fill the visible screen" — it's accurate at every moment, not just at load or only in one particular chrome state.

Same idea applies to the width axis (`svw`/`lvh`/`dvw`), though the width-side problem is far less common in practice since mobile browser chrome resizing is almost always a height/vertical phenomenon.

```css
.hero {
  height: 100vh;   /* legacy fallback for browsers without dvh support */
  height: 100dvh;  /* modern browsers override with the live, accurate value */
}
```

Writing both is a defensive pattern: the `100vh` line is understood/ignored-then-overridden by any browser new enough to support `dvh`, while it still provides a reasonable fallback in older browsers that don't recognize the `dvh` unit at all (an unsupported value in a CSS declaration is simply ignored, leaving the previous valid declaration in place).

## Comparison table

| Unit | Meaning | Best use case |
|---|---|---|
| `vh` | 1% of *a* viewport height (historically ambiguous on mobile — often resolves to the "large" state) | Desktop-oriented layouts, or as a fallback line before `dvh` |
| `svh` | 1% of the *smallest* possible viewport height (chrome fully expanded) | Guaranteeing content is never clipped, even in the worst case |
| `lvh` | 1% of the *largest* possible viewport height (chrome fully collapsed) | Rarely needed directly; mostly historical/edge-case use |
| `dvh` | 1% of the *current, live* viewport height, updates as chrome shows/hides | The correct default choice for "fill the visible screen" on mobile |

## A note on `svh`/`lvh`/`dvh` on desktop

On desktop browsers, where UI chrome doesn't dynamically resize the content area during scrolling, `vh`, `svh`, `lvh`, and `dvh` are typically all equal — the distinction is specifically a mobile-browser concern, which is exactly why this is such a commonly asked "do you actually understand mobile rendering" interview question rather than a purely academic one.
