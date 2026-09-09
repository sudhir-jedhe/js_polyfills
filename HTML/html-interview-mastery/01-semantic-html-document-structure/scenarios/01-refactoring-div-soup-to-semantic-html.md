***  01-refactoring-div-soup-to-semantic-html.md ***

# Scenario: Refactoring a Legacy "Div Soup" Page

**Scenario:** You inherit a marketing page built entirely from nested `<div>`s with classes like `div-header`, `div-nav`, `div-content`, `div-sidebar`, `div-footer`. It renders fine visually, but a recent accessibility audit flagged "no landmarks found" and Lighthouse's SEO score is lower than competitors with similar content. Product wants a fix that doesn't touch the CSS (too risky to restyle right now). How do you approach it?

**Diagnosis:** The visual rendering is driven entirely by class-based CSS, which is decoupled from the tag names — this is actually good news, because it means the div-to-semantic-tag swap can, in most cases, be done as a **pure find-and-replace on tag names**, keeping every class attribute (and therefore every CSS rule) untouched.

**Fix — swap tags, keep classes and CSS intact:**

```html
<!-- Before -->
<div class="div-header">
  <div class="div-nav"><a href="/">Home</a></div>
</div>
<div class="div-content">...</div>
<div class="div-sidebar">...</div>
<div class="div-footer">...</div>

<!-- After: same classes, same CSS, different tags -->
<header class="div-header">
  <nav class="div-nav"><a href="/">Home</a></nav>
</header>
<main class="div-content">...</main>
<aside class="div-sidebar">...</aside>
<footer class="div-footer">...</footer>
```

Since `header`, `nav`, `main`, `aside`, `footer` are all block-level by default in the UA stylesheet (same as `div`), and the existing class selectors (`.div-header`, `.div-nav`, etc.) don't care what tag they're attached to, the visual output is pixel-identical before and after — the CSS never has to change.

**Rollout plan:**
1. Swap the outer layout tags first (header/nav/main/aside/footer) — highest landmark impact, lowest risk, verify visually unchanged.
2. Add `aria-label` to any duplicate landmark types (e.g. if there are two `<nav>`s) so they're distinguishable in a screen reader's landmarks list.
3. Fix the heading hierarchy next as a separate pass — semantic containers alone don't fix a broken `h1`→`h4` skip inside the content area.
4. Re-run the accessibility audit and Lighthouse SEO score to confirm the landmark warnings clear, then tackle deeper issues (`alt` text, color contrast) as follow-up work — landmarks were the highest-leverage, lowest-risk fix to ship first.
