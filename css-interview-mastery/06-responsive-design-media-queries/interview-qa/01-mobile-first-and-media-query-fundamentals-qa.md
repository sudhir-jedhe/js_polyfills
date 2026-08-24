# Interview Q&A — Mobile-First & Media Query Fundamentals

**Q: What does "mobile-first" mean in CSS, and why is it the modern default?**
It means unqualified (no media query) base styles target the smallest/simplest layout, and `min-width` media queries progressively add complexity as the viewport grows. It's preferred because it aligns with typically mobile-dominant traffic, avoids shipping and then overriding desktop-oriented CSS on weaker/slower mobile devices, and naturally encourages progressive enhancement (adding capability) rather than subtractive overriding (removing/undoing complexity for small screens, which is generally harder to get right).

**Q: What's the structural difference between a mobile-first and a desktop-first media query strategy?**
Mobile-first uses `min-width` conditions, so each query adds rules as the viewport grows past a threshold. Desktop-first uses `max-width` conditions, so each query overrides/removes rules as the viewport shrinks below a threshold. Mixing both strategies in one project is a common source of confusing override behavior in the range where both a `min-width` and a `max-width` query apply simultaneously.

**Q: What are the parts of an `@media` rule?**
An optional media type (`screen`, `print`, or `all` if omitted), and one or more parenthesized media features (like `(min-width: 768px)` or `(prefers-color-scheme: dark)`), combined with logical keywords `and`, `or` (via commas), and `not`.

**Q: What is the modern range syntax for media queries, and what problem does it solve versus the old `min-`/`max-` prefixed features?**
Range syntax lets you write conditions like `(768px <= width <= 1023px)` instead of `(min-width: 768px) and (max-width: 1023px)`. Beyond readability, it precisely expresses exclusive bounds (`width < 768px`) without the old rounding workaround of subtracting a fraction of a pixel (`max-width: 767.98px`) to avoid a "dead zone" at fractional viewport widths.

**Q: If two `@media` blocks both match the current viewport and target the same selector with the same specificity, which one's declarations win?**
Whichever one appears later in the source order — all matching media query blocks contribute their rules to the cascade simultaneously; there's no "closest match wins" behavior. This is exactly why mobile-first breakpoints are conventionally written in ascending `min-width` order in the stylesheet, so larger breakpoints (which should take priority once they also match) appear after smaller ones.

**Q: What's the difference between `@media` and `@supports`?**
`@media` conditions describe the *environment* the page is rendering in (viewport size, color scheme preference, print vs. screen, input type). `@supports` tests whether the browser *supports a given CSS feature/property value* (e.g. `@supports (display: grid)`), which is an entirely different kind of check, often confused with `@media` due to similar syntax but unrelated in purpose.
