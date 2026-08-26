*** copy README.md ***

# Accessibility & ARIA

Accessibility (a11y) is about making sure the web works for people using assistive technology — screen readers, switch devices, voice control, keyboard-only navigation — and ARIA (Accessible Rich Internet Applications) is the attribute vocabulary that fills in gaps native HTML can't express on its own. The single most important rule, and the one interviewers probe hardest, is: **native HTML semantics are almost always better than ARIA** — a real `<button>` gives you focusability, keyboard activation, and a role for free; a `<div role="button">` requires you to manually reimplement all three, and getting any one of them wrong produces a broken, sometimes actively worse, experience than having no ARIA at all. This topic covers WCAG fundamentals, when ARIA is genuinely needed vs. harmful, keyboard navigation, and the classic accessible-component interview scenarios (modals, custom dropdowns).

## Folder structure

- **`theory/`** — WCAG basics, ARIA roles/states/properties, native semantics vs. ARIA ("no ARIA is better than bad ARIA"), keyboard navigation and focus management, accessible names, and color contrast/screen reader considerations.
- **`snippets/`** — 7 runnable examples: accessible buttons, skip links, live regions, icon buttons, tabindex usage, visually-hidden text, and ARIA toggle states.
- **`output-based/`** — 6 "what does assistive tech actually do here?" questions covering keyboard behavior, ARIA misuse, and naming precedence.
- **`scenarios/`** — 5 real-world situations: modal focus trapping, an accessible custom dropdown/combobox, icon-only buttons, a keyboard trap in a third-party widget, and a color contrast audit.
- **`interview-qa/`** — 3 themed files: WCAG/ARIA fundamentals, keyboard/focus, and accessible naming.
- **`problems/`** — 4 hands-on build challenges: an accessible modal with focus trapping, a custom dropdown, a skip link + landmark nav, and an accessible tabs component.
- **`assets/`** — placeholder for diagrams/images (see `assets/README.md`).

## What's covered

- WCAG's four principles (Perceivable, Operable, Understandable, Robust — POUR) and the conformance levels (A, AA, AAA)
- ARIA roles, states, and properties, and the five rules of ARIA use (including "if you can use a native element, do")
- When native HTML already provides accessibility for free vs. when ARIA is genuinely required (custom widgets with no native equivalent)
- Keyboard navigation: `tabindex` values and their meanings, focus order, focus management for dynamic UI, and skip links
- Accessible names: the precedence order between `aria-labelledby`, `aria-label`, and native `<label>`/text content
- Color contrast basics (WCAG AA/AAA ratios) and core screen reader behavior concepts
- The two classic accessible-component interview builds: a focus-trapping modal and an accessible custom dropdown/combobox
