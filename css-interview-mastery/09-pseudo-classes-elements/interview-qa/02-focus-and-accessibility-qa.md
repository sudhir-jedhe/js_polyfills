# Interview Q&A — Focus & Accessibility

**Q: Why is `outline: none` on `:focus` considered a serious anti-pattern?**
Because it removes the only built-in visual indicator of keyboard focus for every user, not just mouse users. Sighted keyboard users and many assistive-technology users rely on the focus ring to know which element is currently active; removing it site-wide (a common but wrong "fix" for the ring appearing on mouse clicks) makes the site effectively unusable via keyboard, which is a WCAG failure (2.4.7 Focus Visible).

**Q: How does `:focus-visible` solve the problem that led people to write `outline: none` in the first place?**
`:focus-visible` lets the browser apply its own heuristic to decide whether a given focus event likely came from keyboard/assistive-technology navigation (show the ring) versus a mouse/touch interaction (usually suppress it). This means you can safely do `:focus { outline: none } :focus-visible { outline: ... }` and get the visually "clean" mouse-click behavior people wanted, without sacrificing the keyboard accessibility that plain `outline: none` broke.

**Q: What does `:focus-within` do, and when would you use it over `:focus`?**
`:focus-within` matches an element if it or *any descendant* currently has focus. Use it to style a whole container (a search bar, a form section, a card with an embedded action) as "active" whenever the user is interacting with anything inside it — something `:focus` alone can't do, since `:focus` only matches the element directly receiving focus, not its ancestors.

**Q: If you visually hide a native `<input type="checkbox">` to build a custom-styled control, what must you avoid to keep it accessible?**
Avoid `display: none` or `visibility: hidden`, both of which remove the element from the accessibility tree and from the natural Tab order, making it unreachable by keyboard and invisible to screen readers. Instead, hide it visually while keeping it operable — e.g. `position: absolute; opacity: 0; width: 1px; height: 1px;` (sometimes called a "visually hidden" pattern) — so it stays focusable and announced, and drive the visible custom control's appearance off its `:checked`/`:focus-visible` state via sibling combinators.

**Q: Is `:active` a reliable way to give keyboard users press feedback?**
Not fully — `:active` is primarily a pointer-interaction pseudo-class (matches during a mouse/touch press) and its behavior for keyboard activation (e.g. pressing Enter/Space on a focused button) is less consistent across browsers/elements than pointer-driven `:active`. For consistent feedback across input methods, don't rely on `:active` alone; ensure `:focus-visible` styling is also strong enough to communicate state.
