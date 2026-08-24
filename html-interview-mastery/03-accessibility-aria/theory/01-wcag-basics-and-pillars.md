# WCAG Basics: The Four Pillars and Conformance Levels

## What WCAG is

The **Web Content Accessibility Guidelines** (WCAG), published by the W3C, is the standard reference for what "accessible" means on the web. It's organized into testable **success criteria**, grouped under four top-level principles — commonly remembered by the acronym **POUR**.

## The POUR principles

| Principle | Means | Example failure |
|---|---|---|
| **Perceivable** | Information must be presentable in ways users can perceive, regardless of sense | An `<img>` with no `alt` text is imperceptible to a screen reader user; low-contrast text is imperceptible to low-vision users |
| **Operable** | UI components must be operable by any input method | A click-only dropdown with no keyboard support is inoperable for keyboard-only users |
| **Understandable** | Content and UI operation must be understandable | Unlabeled form fields, unpredictable navigation, unclear error messages |
| **Robust** | Content must work reliably across a wide range of user agents, including assistive technology | Invalid HTML, misused ARIA that produces a broken or nonsensical accessibility tree |

## Conformance levels: A, AA, AAA

| Level | Meaning |
|---|---|
| **A** | Minimum — baseline barriers removed (e.g. all images have `alt` text, no keyboard traps) |
| **AA** | The industry-standard target — most legal accessibility requirements (ADA-related lawsuits, EU/UK regulations, Section 508) reference **WCAG 2.1/2.2 Level AA** specifically |
| **AAA** | The strictest level — often not fully achievable across an entire site (some AAA criteria are content-dependent, e.g. sign-language interpretation for all video) and generally treated as aspirational rather than a blanket target |

**Practical takeaway for interviews:** when someone says "we need to be WCAG compliant," they almost always mean **Level AA**, not AAA — knowing this distinction and being able to name it precisely is a strong signal of real-world a11y experience versus surface familiarity.

## A few concrete, frequently-cited success criteria

- **1.1.1 Non-text Content (A):** every image conveying information needs a text alternative (`alt`).
- **1.4.3 Contrast (Minimum) (AA):** text needs at least 4.5:1 contrast against its background (3:1 for large text) — see the color-contrast theory file for detail.
- **2.1.1 Keyboard (A):** all functionality must be operable via keyboard alone.
- **2.1.2 No Keyboard Trap (A):** keyboard focus must never get stuck somewhere the user can't Tab/Escape out of.
- **2.4.7 Focus Visible (AA):** keyboard focus must have a visible indicator — this is exactly why `outline: none` without a replacement is a common, serious a11y regression.
- **3.3.2 Labels or Instructions (A):** form inputs need clear labels/instructions.
- **4.1.2 Name, Role, Value (A):** every UI component needs a programmatically determinable name, role, and (where applicable) state — this is the criterion most directly connected to correct ARIA usage.

## WCAG is a floor, not a design goal

Passing every automated WCAG check (e.g. via axe or Lighthouse) does not guarantee a genuinely usable experience for people using assistive technology — automated tools catch roughly 30-50% of real issues (missing labels, contrast failures, missing alt text) but can't evaluate things like "does this custom dropdown's keyboard interaction actually make sense," "is this error message understandable," or "is the reading order logical." Manual testing with an actual screen reader (VoiceOver, NVDA, JAWS) and keyboard-only navigation remains necessary for real confidence, especially on custom interactive components.
