# Interview Q&A — Keyboard Navigation & Focus

**Q: What's the difference between `tabindex="0"` and `tabindex="-1"`?**
`tabindex="0"` inserts an otherwise non-focusable element into the natural tab order at its DOM position. `tabindex="-1"` removes an element from the Tab-key sequence entirely, while still allowing it to be focused programmatically via `.focus()` — used for things like a modal's heading or a skip link's target.

**Q: Why is positive `tabindex` (e.g. `tabindex="5"`) generally considered an anti-pattern?**
Positive values create a separate tab sequence that's visited (in ascending numeric order) before any `tabindex="0"`/default-focusable element, completely disconnected from DOM/visual order — this produces a disorienting tab order for keyboard and screen reader users. The correct way to influence tab order is almost always to reorder the actual DOM, not assign positive tabindex values.

**Q: What is a "keyboard trap," and how is a well-built modal's focus containment different from one?**
A keyboard trap (a WCAG 2.1.2 violation) is focus that gets stuck somewhere with no way to escape via keyboard. A modal's focus containment is deliberately similar (Tab/Shift+Tab cycle only within the modal) but is not a trap because it always provides an explicit exit — typically the `Escape` key, or a focus-eligible close button — that returns focus to the page.

**Q: When a modal closes, where should keyboard focus go, and why does it matter?**
Focus should return to the element that originally triggered the modal (e.g. the button that opened it) — not left unmanaged. If focus isn't explicitly restored, many browsers reset it to `<body>`, forcing a keyboard/screen reader user to navigate from the very top of the page to relocate where they were.

**Q: What's a skip link, and why must it be visible on focus rather than always hidden?**
A skip link is the first focusable element on a page, letting keyboard users bypass repeated navigation and jump straight to main content. It should be visually hidden by default but become visible when it receives keyboard focus — permanently hiding it (`display: none`) would remove it from the tab order entirely, and leaving it invisible even when focused gives sighted keyboard users no indication that pressing Tab did anything.

**Q: Can CSS visually reorder content without affecting tab/focus order? Give an example where this causes a bug.**
Yes — properties like Flexbox/Grid's `order`, or `position: absolute`, change visual position without touching DOM order, which is what focus order follows. A CSS Grid layout using `grid-column`/`grid-row` to visually rearrange cards independent of their source order is a common real case where a sighted keyboard user sees focus "jump" to a place that doesn't match the expected visual reading order.
