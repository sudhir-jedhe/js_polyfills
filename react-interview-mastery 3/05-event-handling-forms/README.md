## Event Handling & Forms

React wraps native DOM events in a cross-browser `SyntheticEvent` wrapper and normalizes how handlers are attached, which changes a few things from vanilla JS event handling that trip people up — especially around `this` (a non-issue with function components, but closures still matter), form input control, and where listeners actually live in the DOM. This topic covers the SyntheticEvent system, controlled vs. uncontrolled inputs, handling multiple form fields with a single generic handler, form submission and `preventDefault`, debouncing rapid input events, and why React's root-level event delegation model affects `stopPropagation` behavior in ways that differ from attaching listeners directly to each DOM node.

**What's covered:**
- The `SyntheticEvent` system
- Event handlers in function components (no `this`, but closures matter)
- Controlled vs. uncontrolled form inputs
- Handling multiple form fields with one handler
- Form submission and `preventDefault`
- Debouncing input handlers
- Event delegation at the root and its effect on `stopPropagation`

## Structure

- `theory/` — concept notes, one file per topic area
- `snippets/` — one short standalone example per file
- `output-based/` — "what does this log/render" questions with answers
- `scenarios/` — realistic problem → approach walkthroughs
- `interview-qa/` — Q&A grouped by theme, including comparison tables
- `problems/` — hand-implemented build exercises (controlled form, validation, debounce)
- `assets/` — supporting images/PDFs (see below)

> Looking for your original notes on this? See `../SOURCE-MAP.md`.
