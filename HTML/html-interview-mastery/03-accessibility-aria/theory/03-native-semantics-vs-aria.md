*** copy 03-native-semantics-vs-aria.md ***

# Native Semantics vs. ARIA: "No ARIA Is Better Than Bad ARIA"

This is the single most important mental model in this entire topic, and it's a direct quote from the WAI-ARIA Authoring Practices: **"No ARIA is better than Bad ARIA."** Misused ARIA doesn't just fail to help — it actively overrides correct native behavior and can make a page *less* accessible than having no ARIA attributes at all.

## Why native elements are almost always the right default

A native `<button>` gives you, for free, with zero extra code:
- A `button` role announced automatically
- Keyboard focusability (part of the default tab order)
- Enter and Space both trigger its `click` behavior
- Correct disabled-state handling (`disabled` attribute removes it from the tab order and announces "dimmed"/"unavailable")
- Correct behavior inside forms (submit type by default)

Re-implementing this with a `<div role="button">` requires you to manually add all of the above — and it's extremely easy to miss one:

```html
<!-- Incomplete — announced as "button" but NOT actually keyboard operable -->
<div role="button" onclick="submit()">Submit</div>
```

A screen reader user tabbing through the page won't even land on this element (`<div>` isn't in the tab order by default), so despite being announced correctly *if* somehow focused, it's functionally invisible to keyboard-only and screen-reader users. This is strictly worse than a plain unstyled `<div>` with no `role` at all, because the `role="button"` creates a false promise the implementation doesn't keep — some AT users may even try pressing Enter on it as any button, and nothing happens, without a way to tell whether the "button" is genuinely broken or if they mis-pressed.

## The correct, complete re-implementation (when you truly can't use `<button>`)

```html
<div role="button" tabindex="0"
     onclick="submit()"
     onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); submit(); }">
  Submit
</div>
```

Even this "complete" version is still missing: disabled-state handling, correct behavior when nested inside a `<label>` or `<form>`, and any assurance that every browser/AT combination treats `role="button"` identically to a real `<button>` (in practice, most do, but native is still the safer bet). This is exactly why the first rule of ARIA use is: **if a native element already does what you need, use it — don't reach for ARIA at all.**

## When ARIA is genuinely necessary

ARIA earns its keep specifically when there's **no native HTML equivalent** for the widget you're building:

- A tabbed interface (`role="tablist"`/`tab`/`tabpanel`) — no native `<tabs>` element exists in HTML
- A combobox/typeahead autocomplete (`role="combobox"`) — `<datalist>` exists but has much more limited styling/behavior control
- A tree view (`role="tree"`/`treeitem`) — file explorers, nested navigation
- A live region announcing dynamic content changes (`aria-live`) — nothing native covers "announce this text when it changes"
- A modal dialog with focus trapping (`role="dialog"`/`aria-modal="true"`) — HTML now has native `<dialog>`, which is a good example of the platform catching up and reducing how often manual ARIA dialogs are needed

## Quick decision framework

1. Does a native HTML element already provide this semantics/behavior? → **Use it, no ARIA needed.**
2. Does a native element provide the semantics, but you need to expose *dynamic state*? → **Use the native element + a state/property ARIA attribute** (`aria-expanded`, `aria-invalid`, etc.) — this is the most common legitimate ARIA use case.
3. Is there truly no native equivalent for this UI pattern? → **Use a role + full manual behavior/keyboard implementation**, following the WAI-ARIA Authoring Practices pattern for that specific widget (don't invent your own keyboard scheme).
