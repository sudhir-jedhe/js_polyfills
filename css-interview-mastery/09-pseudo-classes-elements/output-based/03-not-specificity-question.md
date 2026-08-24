# Which Rule Wins: `:not()` Specificity

```html
<p class="lead">Some intro text.</p>
```

```css
p:not(.lead) { color: blue; }
p { color: green; }
.lead { color: purple; }
```

**Question:** What color is the text?

**Answer:** Purple.

**Why:** `p:not(.lead)` doesn't even match this element (it has the `.lead` class, so `:not(.lead)` explicitly excludes it) — it's irrelevant here regardless of specificity. Between the remaining two rules, `p` has specificity (0,0,1) and `.lead` has specificity (0,1,0); a class always outweighs a type selector, so `.lead`'s purple wins. The trap in this question is assuming `:not()`'s presence is what decides the outcome — it isn't, because it never matches this particular element at all. (Reminder for the specificity comparison itself: `:not(.lead)`, if it *had* matched an element, would carry the specificity of `.lead` — i.e. (0,1,0) — not zero.)
