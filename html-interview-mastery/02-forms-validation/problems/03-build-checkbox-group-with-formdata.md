# Problem: Build a Multi-Select Checkbox Group and Read It via `FormData`

## Problem Statement

Build a "select your interests" checkbox group (at least 4 options sharing the same `name`, wrapped in a `<fieldset>`/`<legend>`) requiring at least one selection, and write the JS to correctly read *all* selected values on submit — not just the last one.

## Constraints

- All checkboxes must share the same `name` so they submit as a single grouped field.
- Must enforce "at least one checked" without JS-only logic where possible (native HTML has no `required` support for checkbox *groups* — only individual checkboxes — so identify and implement the correct workaround).
- Reading values must correctly return an array of all checked values, not just one.

## Solution

```html
<form id="interests-form" novalidate>
  <fieldset>
    <legend>Select your interests (choose at least one)</legend>
    <label><input type="checkbox" name="interests" value="html"> HTML</label>
    <label><input type="checkbox" name="interests" value="css"> CSS</label>
    <label><input type="checkbox" name="interests" value="js"> JavaScript</label>
    <label><input type="checkbox" name="interests" value="a11y"> Accessibility</label>
  </fieldset>

  <p id="interests-error" role="alert" hidden>Please select at least one interest.</p>
  <button type="submit">Continue</button>
</form>
```

```js
const form = document.getElementById('interests-form');
const errorEl = document.getElementById('interests-error');

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const formData = new FormData(form);
  const selected = formData.getAll('interests'); // returns an ARRAY of every checked value

  if (selected.length === 0) {
    errorEl.hidden = false;
    form.querySelector('input[name="interests"]').focus();
    return;
  }

  errorEl.hidden = true;
  console.log('Selected interests:', selected); // e.g. ["html", "js"]
});
```

**Why this satisfies the constraints:** native HTML's `required` attribute only works per-checkbox (meaning "this specific box must be checked"), not "at least one of this named group" — there's no declarative attribute for group-level minimum selection, so this is correctly handled with a manual JS check via `FormData.getAll('interests')`, which is the key detail: `formData.get('interests')` would silently return only the *first* checked value, while `.getAll()` correctly returns every checked value as an array. The `<fieldset>`/`<legend>` gives the group accessible context, and the error is placed in a `role="alert"` region plus focus is moved to the group on failure, mirroring accessible-error-messaging conventions from elsewhere in this topic.
