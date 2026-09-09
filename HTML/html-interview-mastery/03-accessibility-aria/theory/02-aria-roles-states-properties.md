***  02-aria-roles-states-properties.md ***

# ARIA Roles, States, and Properties

ARIA (Accessible Rich Internet Applications) is an attribute vocabulary, not a behavior implementation — it changes what's exposed to the **accessibility tree**, but it never adds keyboard handling, focus behavior, or any other actual functionality. This distinction trips people up constantly: adding `role="button"` to a `<div>` makes assistive technology *announce* it as a button, but the `<div>` still isn't focusable and still doesn't respond to Enter/Space unless you separately add `tabindex="0"` and JS keydown handlers.

## Three categories

| Category | Purpose | Examples |
|---|---|---|
| **Roles** | What kind of thing an element is | `role="button"`, `role="dialog"`, `role="navigation"`, `role="alert"`, `role="tablist"` |
| **States** | Current, often-changing condition | `aria-expanded`, `aria-checked`, `aria-selected`, `aria-disabled`, `aria-hidden` |
| **Properties** | Characteristics that are generally more stable/structural | `aria-label`, `aria-labelledby`, `aria-describedby`, `aria-required`, `aria-haspopup` |

(The states-vs-properties line is somewhat fuzzy by design in the spec — the practical distinction that matters is roles/states/properties collectively define what's announced, not what happens when a key is pressed.)

## The five rules of ARIA use (WAI-ARIA Authoring Practices)

1. **If a native HTML element or attribute has the semantics/behavior you need, use it instead of re-purposing an element and adding ARIA.** (`<button>`, not `<div role="button">`.)
2. **Do not change native semantics unless you really have to.** (Don't put `role="heading"` on a `<button>`.)
3. **All interactive ARIA controls must be usable with the keyboard.** (Adding `role="button"` obligates you to also implement the keyboard behavior — the role alone doesn't provide it.)
4. **Don't use `role="presentation"`/`aria-hidden="true"` on a focusable element.** (This creates a nonsensical state: a keyboard-focusable but "invisible to AT" element — a screen reader user could tab to something with no announced name/role at all.)
5. **All interactive elements must have an accessible name.** (A `role="button"` with no visible text and no `aria-label` announces as just "button" — useless.)

## Common roles reference

| Role | Use case |
|---|---|
| `dialog` / `alertdialog` | Modal dialogs (`alertdialog` for ones requiring an immediate response, e.g. a confirm-delete prompt) |
| `tablist` / `tab` / `tabpanel` | Tabbed interfaces |
| `listbox` / `option` | Custom select-like widgets |
| `combobox` | Text input + associated popup listbox (autocomplete/typeahead) |
| `alert` | Important, time-sensitive message — implicitly an assertive live region |
| `status` | Advisory, non-critical status message — implicitly a polite live region |
| `menu` / `menuitem` | Application-style menus (not the same as a navigation `<nav>` list of links) |

## `aria-*` attributes that don't require a role change

Some of the most useful ARIA attributes are added to elements that already have correct native semantics, purely to expose dynamic state:

```html
<button aria-expanded="false" aria-controls="menu-panel">Menu</button>
<div id="menu-panel" hidden>...</div>
```

```html
<input type="text" aria-invalid="true" aria-describedby="email-error">
<p id="email-error">Please enter a valid email.</p>
```

Here, no `role` attribute is needed at all — `<button>` and `<input>` already have correct implicit roles; only their *state* (`aria-expanded`, `aria-invalid`) and *relationships* (`aria-controls`, `aria-describedby`) need ARIA, which is the single most common — and safest — real-world use of ARIA in practice.
