# `vh` vs. `dvh`: What Happens on Page Load in Mobile Safari?

```css
.full-screen-vh {
  height: 100vh;
}
.full-screen-dvh {
  height: 100dvh;
}
```

**Question:** A user opens a page on an iPhone in Safari. The address bar is fully expanded (visible) at this moment, since the page was just loaded and hasn't been scrolled yet. For each element, does its rendered height exactly match the currently visible viewport area, or does it extend beyond what's visible?

**Answer:** `.full-screen-vh` extends *beyond* the currently visible area (its bottom portion is hidden below the fold, effectively requiring a scroll to reveal, or getting clipped depending on surrounding layout). `.full-screen-dvh` exactly matches the currently visible area.

**Why:** In Safari on iOS, `100vh` has historically resolved against the *largest* possible viewport state (address bar collapsed) rather than the actual current state — so on initial load, when the address bar is still expanded and taking up real screen space, `100vh` computes to a height taller than what's actually visible on screen at that moment, pushing content below the fold or causing unwanted scroll. `100dvh` is defined specifically to track the *dynamic, current* state of the browser chrome — at the moment of load with the address bar expanded, `100dvh` correctly computes to the smaller, currently-visible height. If the user then scrolls and the address bar auto-collapses, `100dvh` would grow live to match the newly larger visible area, while `100vh` stays at its original (already-too-tall) fixed value throughout.
