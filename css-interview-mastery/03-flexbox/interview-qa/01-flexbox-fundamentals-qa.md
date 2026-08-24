# Interview Q&A — Flexbox Fundamentals

**Q: What happens when you set `display: flex` on an element?**
The element becomes a flex container, and every one of its direct children automatically becomes a flex item, laid out along a main axis determined by `flex-direction` — no property needs to be set on the children themselves to opt them into flex-item behavior.

**Q: What's the difference between the main axis and the cross axis?**
The main axis is whatever direction `flex-direction` points along (`row` = horizontal, `column` = vertical); the cross axis is always perpendicular to it. `justify-content` always aligns along the main axis; `align-items`/`align-self`/`align-content` always align along the cross axis — switching `flex-direction` swaps which visual dimension each property controls.

**Q: What's the default value of `flex-grow`, `flex-shrink`, and `flex-basis`, and what does the `flex: 1` shorthand set them to?**
Defaults are `flex-grow: 0`, `flex-shrink: 1`, `flex-basis: auto`. `flex: 1` expands to `flex-grow: 1; flex-shrink: 1; flex-basis: 0%` — notably a basis of `0%`, not `auto`, meaning sizing is driven almost entirely by the grow ratio rather than each item's content size.

**Q: How do you perfectly center a single element both horizontally and vertically with flexbox?**
Make the parent a flex container and set both `justify-content: center` and `align-items: center` — this centers along the main and cross axes respectively, and works regardless of `flex-direction` since both axes get a `center` value.

**Q: What's the difference between `align-items` and `align-content`?**
`align-items` aligns items along the cross axis *within* a single flex line. `align-content` aligns the flex lines themselves (plural) along the cross axis when there's more than one line (`flex-wrap: wrap`) and leftover cross-axis space to distribute between them — it has no visible effect on a single-line flex container.

**Q: Does `order` change the DOM order?**
No — `order` only changes the *visual/paint* order of flex items, not their position in the DOM. Tab order and screen-reader reading order still follow DOM/source order, which is why `order` should be reserved for purely cosmetic reflow, not to compensate for genuinely incorrect markup order.
