*** copy 02-multi-step-form-wizard.md ***

# Problem: Build a Multi-Step Form Wizard

## Problem Statement

Build a multi-step form wizard component that manages which step is currently active plus each step's own form data, entirely with `useState` — supporting forward/back navigation without losing data entered on previous steps, and a final submit that has access to all steps' combined data.

## Requirements

- Track the current step index with `useState`.
- Track per-step form data in a single state object keyed by field name (not one `useState` per field), so navigating back to a previous step shows previously entered values.
- "Next" advances the step only if the current step's required field(s) are filled; "Back" always allowed (no re-validation needed going backward).
- Final step's "Submit" logs/returns the full combined form data across all steps.
- All state updates must use the immutable-update patterns from the theory notes (no direct mutation of the form-data object).

## Approach

A single `useState` object holds all fields across all steps (`{ name: '', email: '', plan: '' }`), updated immutably via the functional form's object-spread pattern on every field change — this avoids needing to merge/sync separate per-step state objects when the user navigates back and forth. A second, independent `useState` tracks just the numeric step index. Validation is a small per-step predicate checked before allowing `setStep(prev => prev + 1)`.

## Solution

```jsx
const STEPS = [
  { id: 'account', title: 'Account', fields: ['name', 'email'] },
  { id: 'plan', title: 'Plan', fields: ['plan'] },
  { id: 'review', title: 'Review', fields: [] },
];

function FormWizard({ onSubmit }) {
  const [stepIndex, setStepIndex] = React.useState(0);
  const [formData, setFormData] = React.useState({ name: '', email: '', plan: '' });

  const currentStep = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  function updateField(field, value) {
    setFormData(prev => ({ ...prev, [field]: value })); // immutable update, single source of truth
  }

  function isStepValid(step) {
    return step.fields.every(field => formData[field].trim() !== '');
  }

  function handleNext() {
    if (!isStepValid(currentStep)) return; // block advancing on invalid step
    setStepIndex(prev => Math.min(prev + 1, STEPS.length - 1));
  }

  function handleBack() {
    setStepIndex(prev => Math.max(prev - 1, 0)); // always allowed, no validation
  }

  function handleSubmit() {
    onSubmit(formData); // full combined data across every step
  }

  return (
    <div>
      <h2>Step {stepIndex + 1} of {STEPS.length}: {currentStep.title}</h2>

      {currentStep.id === 'account' && (
        <>
          <input
            placeholder="Name"
            value={formData.name}
            onChange={e => updateField('name', e.target.value)}
          />
          <input
            placeholder="Email"
            value={formData.email}
            onChange={e => updateField('email', e.target.value)}
          />
        </>
      )}

      {currentStep.id === 'plan' && (
        <select value={formData.plan} onChange={e => updateField('plan', e.target.value)}>
          <option value="">Select a plan…</option>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
        </select>
      )}

      {currentStep.id === 'review' && (
        <pre>{JSON.stringify(formData, null, 2)}</pre>
      )}

      <div>
        {stepIndex > 0 && <button onClick={handleBack}>Back</button>}
        {!isLastStep && (
          <button onClick={handleNext} disabled={!isStepValid(currentStep)}>
            Next
          </button>
        )}
        {isLastStep && <button onClick={handleSubmit}>Submit</button>}
      </div>
    </div>
  );
}

// --- verification (conceptual walk-through of the state transitions) ---
// 1. Mount: stepIndex = 0, formData = { name: '', email: '', plan: '' }
// 2. Type name/email -> formData updates immutably, stepIndex unchanged
// 3. Click Next (valid) -> stepIndex becomes 1; formData still has name/email filled in
// 4. Click Back -> stepIndex becomes 0; name/email inputs still show what was typed (data preserved)
// 5. Click Next, select a plan, click Next -> stepIndex becomes 2 (review), shows all 3 fields
// 6. Click Submit -> onSubmit({ name, email, plan }) called with everything collected so far
```

**Why this works:** Keeping all fields in one `formData` object (rather than one `useState` per field, or — worse — a separate state object per step) means there's nothing to reconcile when the user navigates back: the same object is simply displayed against a different step's fields, so "Back" never loses data by construction. Splitting `stepIndex` into its own `useState` keeps step navigation and form-data updates as two independent, uncoupled concerns, each following the immutable-update discipline from `../theory/04-state-immutability.md`.

**Extension points:** per-step validation here is a simple "all fields non-empty" check; a real wizard would likely swap in field-level validators (email format, etc.) and surface per-field error state — which would fit naturally as additional keys in the same `formData`-adjacent state shape (e.g. a sibling `errors` object updated the same immutable way).
