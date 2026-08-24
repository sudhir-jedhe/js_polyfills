# Labels, Fieldset/Legend, and Form Accessibility

## Why `<label>` is not optional polish

A `<label>` programmatically associates descriptive text with a form control. Without it, a screen reader announces a bare "edit text" with no indication of what to type — visually sighted users infer meaning from placement, but that inference doesn't exist for non-visual users, and it also **increases the clickable/tappable target**: clicking anywhere on the label text focuses/activates the associated control, which matters a lot for small checkboxes/radios on touch devices.

## Two ways to associate a label — both valid, one usually preferable

```html
<!-- Explicit association via matching for/id — works even if they're not adjacent in the DOM -->
<label for="email">Email address</label>
<input id="email" type="email" name="email">

<!-- Implicit association via wrapping — no id/for needed -->
<label>
  Email address
  <input type="email" name="email">
</label>
```

Explicit `for`/`id` is generally preferred in larger codebases because it doesn't constrain your layout (the label and input don't have to be DOM-adjacent, so you can style them independently, e.g. in a CSS grid with the label in one column and input in another) and it's less ambiguous for tooling. Wrapping is convenient for quick/small forms.

## What a missing/broken label actually breaks

```html
<!-- BROKEN: placeholder is NOT a label substitute -->
<input type="text" placeholder="Email address">
```

A placeholder disappears the instant the user types, is not consistently announced by every screen reader/browser combination as a substitute for a label, and typically fails color-contrast requirements since placeholder text is usually styled lighter than real input text. `placeholder` is a *hint about format* (e.g. "MM/DD/YYYY"), never a replacement for a real, permanently-visible `<label>`.

## `<fieldset>` and `<legend>` for grouping

`<fieldset>` groups a set of related controls (most commonly radio buttons or checkboxes), and `<legend>` is its caption — announced by screen readers as context for every control inside, which a `<label>` on each individual control can't provide on its own.

```html
<fieldset>
  <legend>Preferred contact method</legend>
  <label><input type="radio" name="contact" value="email"> Email</label>
  <label><input type="radio" name="contact" value="phone"> Phone</label>
  <label><input type="radio" name="contact" value="text"> Text message</label>
</fieldset>
```

Without the `<fieldset>`/`<legend>`, a screen reader announces each radio as just "Email, radio button," "Phone, radio button" — with it, it announces "Preferred contact method — Email, radio button" for each one, giving critical context that would otherwise only be conveyed by nearby visual heading text a screen reader user might not associate with the group.

## Accessible error messaging

```html
<label for="email">Email</label>
<input id="email" type="email" required aria-describedby="email-error" aria-invalid="true">
<p id="email-error" role="alert">Please enter a valid email address.</p>
```

`aria-describedby` links the input to its error message so a screen reader announces the error as part of the field's description when focused. `role="alert"` (or an `aria-live` region) ensures the error is announced immediately when it appears, even if the field isn't currently focused — critical for errors that show up after an async/server-side check.

## Comparison: what each accessibility mechanism solves

| Mechanism | Solves |
|---|---|
| `<label for>` | Gives the control a name at all |
| `<fieldset>`/`<legend>` | Gives a *group* of controls shared context |
| `aria-describedby` | Attaches extra descriptive/error text beyond the label |
| `aria-invalid="true"` | Announces the field is currently in an error state |
| `role="alert"` / `aria-live` | Ensures dynamically-appearing error text is actually announced |
