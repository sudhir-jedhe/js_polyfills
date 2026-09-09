***  01-form-elements-input-types-qa.md ***

# Interview Q&A — Form Elements & Input Types

**Q: What's the default `type` of a `<button>` inside a `<form>`, and why does it matter?**
`type="submit"` — a common bug is adding a `<button>` intended purely for a JS click handler (e.g. "show more") without an explicit `type="button"`, causing it to unexpectedly submit/reload the form. Always be explicit about button type inside forms.

**Q: Does `type="tel"` validate phone number format?**
No — phone number formats vary too much across countries/regions, so browsers deliberately don't enforce a shape. `type="tel"` mainly changes the mobile virtual keyboard to a phone-optimized one; if you need format enforcement, add a `pattern` attribute explicitly.

**Q: What format does a `type="date"` input's value use in JavaScript, regardless of locale?**
Always `YYYY-MM-DD` (ISO 8601 date format) — the *displayed* picker UI may show a locale-specific format (e.g. `MM/DD/YYYY` in the US), but `input.value` and what gets submitted is always normalized to `YYYY-MM-DD`.

**Q: What's the practical accessibility/UX benefit of choosing `type="email"` over `type="text"` for an email field?**
Mobile devices show an optimized keyboard (with `@` and `.` easily accessible), the browser performs baseline shape validation for free, and screen readers can announce the field's purpose more specifically ("email edit text" vs. generic "edit text").

**Q: What does `<select multiple>` do, and how is its value read in JS?**
Allows selecting more than one `<option>` (typically via ctrl/cmd+click or a multi-row listbox rendering instead of a dropdown). Its value isn't a single string — you read the selected options via `select.selectedOptions` (a live `HTMLCollection`) or by checking each `<option>.selected`.

**Q: What's the difference between `<datalist>` and `<select>`?**
`<select>` restricts the user to exactly the listed options. `<datalist>` paired with an `<input list="...">` provides *suggestions* via autocomplete, but the user can still type any arbitrary value — it's not enforced, so you still need `pattern`/JS validation if the value must be constrained to the list.
