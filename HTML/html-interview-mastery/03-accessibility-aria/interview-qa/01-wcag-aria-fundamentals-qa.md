*** copy 01-wcag-aria-fundamentals-qa.md ***

# Interview Q&A — WCAG & ARIA Fundamentals

**Q: What does POUR stand for in WCAG, and give one example criterion for each.**
Perceivable (e.g. text alternatives for images), Operable (e.g. all functionality available via keyboard), Understandable (e.g. clear labels/instructions on forms), Robust (e.g. valid markup and correctly-used ARIA that works across assistive technology).

**Q: What WCAG conformance level do most companies/legal requirements actually target?**
Level AA (from WCAG 2.1 or 2.2) — this is the de facto industry standard referenced by most accessibility lawsuits and regulations (ADA-related litigation, Section 508, EU/UK accessibility regulations). Level AAA is generally treated as aspirational and isn't fully achievable site-wide for some criteria.

**Q: What's the "no ARIA is better than bad ARIA" rule, and why does it exist?**
Misused ARIA overrides an element's native semantics/behavior in the accessibility tree, and can make a page actively worse than having no ARIA at all — e.g. `role="button"` on a `<div>` with no keyboard handling announces as a button but doesn't behave like one, which is more confusing than an unstyled `<div>` a screen reader user would correctly perceive as non-interactive.

**Q: What are the "five rules of ARIA use"?**
(1) Prefer a native HTML element/attribute over adding a role to a non-semantic one. (2) Don't change native semantics unless necessary. (3) All interactive ARIA controls must be fully keyboard-operable. (4) Never use `aria-hidden="true"` on a focusable element. (5) Every interactive element must have an accessible name.

**Q: Does adding `role="button"` to a `<div>` make it keyboard-accessible?**
No — ARIA only changes what's exposed to the accessibility tree (the announced role), never actual behavior. `role="button"` alone doesn't add focusability or keyboard event handling; you'd still need to manually add `tabindex="0"` and Enter/Space keydown handlers to reach parity with a native `<button>`.

**Q: Give an example of a widget where ARIA is genuinely necessary because there's no native HTML equivalent.**
A tabbed interface (`role="tablist"`/`tab`/`tabpanel`) — HTML has no native `<tabs>` element, so building an accessible tab UI requires ARIA roles plus manual keyboard arrow-navigation, following the WAI-ARIA Authoring Practices' documented tabs pattern.
