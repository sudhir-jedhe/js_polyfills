# Scenario: Mobile Hero Section Gets Cropped by the Address Bar

**Scenario:** A landing page has a full-screen hero section built with `height: 100vh`, intended to fill the screen exactly with no scrolling needed. On desktop it works perfectly. On mobile (particularly iOS Safari), users report the hero section appears cut off at the bottom on first load — part of the call-to-action button is hidden below the fold, and there's an unexpected sliver of scrollable space. How do you fix this?

**Diagnosis:**

This is the textbook `100vh`-on-mobile problem. Mobile browsers show and hide UI chrome (address bar, toolbars) dynamically as the user scrolls, and `100vh` has historically been defined against the viewport size *without* that chrome accounted for (effectively the "largest" possible viewport state) — not the size that's actually visible the moment the page loads, when the chrome is still fully expanded. So `100vh` computes to a value taller than the real, currently-visible screen area, pushing the bottom of the hero (and the CTA button inside it) below what the user can actually see without scrolling.

**Fix:**

```css
.hero {
  height: 100vh;   /* fallback for browsers that don't support dvh */
  height: 100dvh;  /* dynamic viewport height — tracks the actual visible area live */
  display: flex;
  flex-direction: column;
  justify-content: center;
}
```

`100dvh` is defined specifically to reflect the *current* state of the browser's UI chrome, not a fixed worst/best case — so on initial load, with the address bar expanded, `100dvh` correctly computes to the smaller, currently-visible height, and the hero (including the CTA) fits within what's actually visible without any scroll. Writing the `100vh` line first as a fallback is safe: browsers new enough to support `dvh` will simply have that later declaration override it, while older browsers that don't recognize `dvh` at all silently ignore that unsupported declaration and keep using the `vh` fallback.

**A related consideration:** if the hero's content needs guaranteed room even in the browser's most cramped/expanded-chrome state (rather than "fits at this moment, but might get slightly clipped if chrome expands further while scrolled"), `100svh` (small viewport height) is the more conservative choice — it always reflects the smallest the visible area ever gets, trading a slightly smaller worst-case hero for a guarantee it never gets cut off in any state.
