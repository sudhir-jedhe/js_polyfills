# Scenario: Auto-Adding a Required-Field Asterisk with `:has()`

**Situation:** Every required form field's `<label>` needs a red asterisk. Historically this meant manually adding `<span class="required">*</span>` inside every required label, which is easy to forget when a new field is added.

**Approach:** Use `:has()` to detect that the labeled input is `required`, and generate the asterisk automatically.

```html
<div class="field">
  <label for="name">Full name</label>
  <input id="name" type="text" required />
</div>
<div class="field">
  <label for="notes">Notes</label>
  <input id="notes" type="text" />
</div>
```

```css
/* label's own :has() looks at its NEXT sibling input via the general sibling combinator */
label:has(+ input:required)::after {
  content: " *";
  color: crimson;
}
```

**Why this works:** `:has(+ input:required)` reads as "a `<label>` immediately followed by a required `<input>`." Because this is driven entirely by the `required` attribute already on the input, the asterisk appears and disappears automatically as fields are marked required/optional — no duplicated markup, and no risk of the visual indicator drifting out of sync with the actual validation rule. If labels don't sit as immediate siblings of their inputs in your markup (e.g. the input is wrapped in a container), swap `+` for the more permissive `~` sibling combinator, or restructure `:has()` to look at a shared ancestor instead: `.field:has(input:required) label::after`.
