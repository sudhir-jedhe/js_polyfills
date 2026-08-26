*** copy 04-tabindex-values-comparison.md ***

# Output: `tabindex="-1"` vs. `tabindex="0"` vs. `tabindex="5"`

```html
<button>A (no tabindex)</button>
<div role="button" tabindex="0">B</div>
<div tabindex="-1" id="c">C</div>
<input tabindex="5" placeholder="D">
```

**Question:** In what order does pressing Tab repeatedly move focus through these four elements, starting from the top of the page? Can element C ever receive focus?

**Answer:** Tab order visits: **D** (tabindex="5", positive values always go first, in ascending numeric order) → **A** (default, DOM order) → **B** (tabindex="0", DOM order, grouped with all zero/default-tabbable elements) → and **C is skipped entirely** by the Tab key. C *can* still receive focus, but only programmatically via JavaScript — `document.getElementById('c').focus()` — never through normal keyboard tabbing.

**Why:** The browser's tab-order algorithm processes all positive-`tabindex` elements first, strictly by ascending value, *before* any element with `tabindex="0"` or a naturally-focusable default — this is exactly why positive tabindex is discouraged: it silently pulls one element far out of its natural document position in the tab sequence, disconnected from visual/DOM order, purely because of a number that has nothing to do with the page's actual layout. `tabindex="-1"` is a deliberate exception mechanism — it opts an element *out* of the Tab-key sequence while still allowing `.focus()` calls to target it, which is exactly the mechanism modals and skip-link targets rely on.
