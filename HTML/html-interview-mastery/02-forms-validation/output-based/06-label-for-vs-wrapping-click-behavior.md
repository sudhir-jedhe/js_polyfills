*** copy 06-label-for-vs-wrapping-click-behavior.md ***

# Output: Clicking Label Text — `for`/`id` vs. Wrapping vs. Neither

```html
<!-- A -->
<label for="a">Subscribe</label>
<input id="a" type="checkbox">

<!-- B -->
<label>Subscribe <input type="checkbox"></label>

<!-- C -->
<p>Subscribe</p>
<input type="checkbox">
```

**Question:** In each case, does clicking the word "Subscribe" toggle the checkbox?

**Answer:** In **A** and **B**, yes — clicking anywhere on the label text toggles the associated checkbox. In **C**, no — clicking the `<p>` text does nothing to the checkbox; only clicking the small checkbox box itself toggles it.

**Why:** `<label>` has built-in browser behavior (no JS required) that forwards a click anywhere on the label to its associated form control — associated either explicitly via matching `for`/`id` (A) or implicitly by wrapping the control (B). A `<p>` has no such association mechanism, no matter how visually close it sits to the input; the browser has no way to know they're related without an actual `<label>` element. This is exactly why using `<label>` (rather than any other element styled to look like one) matters even from a pure UX standpoint, before accessibility is factored in at all — it's a larger, more forgiving click/tap target for free.
