# Scenario: Validating a Multi-Step Signup Wizard

**Scenario:** You're building a 3-step signup wizard (account info → profile details → payment) rendered as a single `<form>` where only one step's fields are visually shown at a time (others `display: none`). QA reports that clicking "Next" on step 1 sometimes triggers a validation error bubble pointing at a *hidden* field from step 3. How do you fix this, and how should final submission validation work?

**Diagnosis:** All fields live in the same `<form>`, so the browser's constraint validation considers *every* field in the DOM when `checkValidity()`/`reportValidity()` runs — including ones currently hidden with `display: none`. Hidden-but-still-`required` fields from later steps are exactly the kind of thing that gets flagged when validating too broadly.

**Fix — scope validation to only the currently visible step:**

```js
const steps = [...document.querySelectorAll('.form-step')];
let currentStep = 0;

function goToNextStep() {
  const currentFields = steps[currentStep].querySelectorAll('input, select, textarea');
  let allValid = true;

  for (const field of currentFields) {
    if (!field.checkValidity()) {
      field.reportValidity(); // shows the bubble on the correct, visible field
      allValid = false;
      break; // stop at first invalid field, matching native single-field-at-a-time behavior
    }
  }

  if (allValid) {
    steps[currentStep].hidden = true;
    currentStep++;
    steps[currentStep].hidden = false;
  }
}
```

An alternative, often cleaner approach: mark each step's `<fieldset>` as `disabled` when it's not the active step. Disabled form controls are automatically **excluded** from constraint validation and from form submission entirely (they're not even included in `FormData`), which sidesteps the "hidden but still required" problem structurally rather than by manually filtering per click:

```html
<fieldset id="step-3" disabled hidden>
  <legend>Payment details</legend>
  <input required name="cc-number">
</fieldset>
```

```js
function activateStep(index) {
  steps.forEach((step, i) => {
    step.disabled = (i !== index); // disable everything except the active step
    step.hidden = (i !== index);
  });
}
```

**Final submission:** on the actual last-step submit, either re-enable every step's fieldset just before calling `form.checkValidity()` (so all steps' data is genuinely validated together, since disabled fields are skipped) or, more robustly, re-validate each step's data server-side regardless — client-side multi-step validation is a UX convenience, never a substitute for server-side validation of the complete payload.
