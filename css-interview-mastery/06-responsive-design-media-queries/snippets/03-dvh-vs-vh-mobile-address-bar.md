# Snippet: `dvh` Fixes the Mobile Address-Bar `100vh` Problem

```html
<section class="hero-old">Uses 100vh — may be clipped/scroll on mobile load</section>
<section class="hero-fixed">Uses 100dvh — accurately fills the visible screen</section>
```

```css
.hero-old {
  height: 100vh; /* on many mobile browsers this resolves to the viewport height
                     WITHOUT the address bar accounted for, so on initial load
                     (address bar visible) the section is actually taller than
                     what's visible, causing an unwanted scroll or clipped content */
  display: grid;
  place-items: center;
}

.hero-fixed {
  height: 100vh;  /* fallback for browsers without dvh support */
  height: 100dvh; /* tracks the browser chrome live — accurate at every moment,
                      including immediately on load with the address bar showing */
  display: grid;
  place-items: center;
}
```

Writing the `100vh` line before `100dvh` is a safe progressive-enhancement pattern: browsers that don't understand `dvh` simply ignore that line (an unrecognized unit makes the whole declaration invalid, so it's dropped) and keep the `vh` value from the line above; browsers that do understand `dvh` apply it, overriding the fallback.
