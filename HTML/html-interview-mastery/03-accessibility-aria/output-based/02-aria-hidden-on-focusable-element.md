***  02-aria-hidden-on-focusable-element.md ***

# Output: `aria-hidden="true"` on a Focusable Element

```html
<button aria-hidden="true" onclick="submitForm()">Submit</button>
```

**Question:** Is this valid ARIA usage? What happens when a keyboard user tabs to this button?

**Answer:** This is an explicit ARIA anti-pattern flagged by automated tools (axe will report "aria-hidden element must not be focusable" as a serious violation). In practice, when a keyboard user tabs to it, the browser still moves visible focus to the button (it's still a native, focusable `<button>`), but the screen reader announces **nothing at all** — no name, no role, no "button" — because `aria-hidden="true"` removes it (and everything inside it) from the accessibility tree entirely, overriding its native semantics for AT purposes. The user experiences a silent, unlabeled focus stop with no indication of what it is or that pressing Enter would submit a form.

**Why:** `aria-hidden` controls accessibility-tree visibility, completely independent of the DOM's normal focusability/tab-order mechanics — the two systems don't automatically stay in sync with each other. This exact combination (hidden from AT, but still reachable by keyboard) is explicitly called out as invalid in the WAI-ARIA spec's rule set precisely because it produces this broken, confusing state. The fix is either removing `aria-hidden` entirely (if the button should be accessible) or, if it's genuinely meant to be hidden, also removing it from the tab order (`tabindex="-1"`, or better, `hidden`/`display: none` if it shouldn't be interactive at all).
