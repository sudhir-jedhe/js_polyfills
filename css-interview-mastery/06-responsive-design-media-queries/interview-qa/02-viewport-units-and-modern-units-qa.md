# Interview Q&A — Viewport Units & Modern Units

**Q: What do `vw` and `vh` mean?**
`1vw` is 1% of the viewport's width; `1vh` is 1% of the viewport's height. `vmin` is the smaller of the two at any given moment, `vmax` is the larger.

**Q: Why does `height: 100vh` cause problems on mobile browsers specifically?**
Mobile browsers show and hide dynamic UI chrome (address bar, toolbars) as the user scrolls, which changes how much screen space is actually available for content. Historically, `100vh` resolved against a viewport definition that doesn't account for that chrome in its currently-visible state (often effectively the "largest" possible viewport, with chrome collapsed) — so on initial page load, with chrome still expanded, `100vh` computes taller than what's actually visible, cropping content or forcing an unwanted scroll.

**Q: What's the difference between `svh`, `lvh`, and `dvh`?**
`svh` (small viewport height) reflects the viewport at its smallest — when browser chrome is fully expanded — guaranteeing content fits even in the most cramped state. `lvh` (large viewport height) reflects the viewport at its largest — chrome fully collapsed. `dvh` (dynamic viewport height) tracks the actual, current state of the browser chrome live, resizing in real time as the user scrolls and chrome shows/hides — it's generally the correct default choice for "fill the visible screen accurately at all times."

**Q: If you write both `height: 100vh` and `height: 100dvh` on the same element, what happens, and why would you do that?**
The second, later declaration wins in any browser that understands the `dvh` unit (normal cascade behavior — later declarations of equal specificity override earlier ones). In a browser that doesn't recognize `dvh` at all, that entire declaration is treated as invalid and dropped, leaving the earlier `100vh` declaration in effect. Writing both is a defensive fallback pattern: modern browsers get the accurate `dvh` behavior, older browsers still get a reasonable (if imperfect) `vh` fallback instead of no height at all.

**Q: Are `vh`/`dvh`/`svh`/`lvh` typically different values on desktop browsers?**
Generally no — desktop browser chrome doesn't dynamically resize the content area during normal scrolling the way mobile browsers' address bars do, so all four units typically resolve to the same value on desktop. The distinction is specifically a mobile-browser-behavior concern, which is why it's such a commonly probed "do you actually understand real device rendering, not just the spec" interview question.
