***   Handling multi-step wizards with React 19 form actions.md ***

In React 19, you can build multi-step wizards without external state management libraries by combining **`useActionState`**, **hidden `<input>` fields / progressive `FormData` accumulation**, and server or client validation.

The standard pattern uses the accumulated `state` returned from `useActionState` to track the current step, collect values across previous steps, and execute the final mutation on the last step.

---

### Step 1: Define the Wizard Action & State Schema

The action handler inspects the current `step` from `FormData`, validates only that step's inputs, and merges the new data into the persistent accumulator.

```typescript
// app/actions/wizardAction.ts
'use server';

export interface WizardState {
  currentStep: number;
  data: {
    fullName?: string;
    email?: string;
    plan?: string;
    billingPeriod?: string;
  };
  errors?: Record<string, string>;
  isComplete?: boolean;
}

export async function wizardAction(
  prevState: WizardState,
  formData: FormData
): Promise<WizardState> {
  const step = Number(formData.get('step') ?? prevState.currentStep);
  const direction = formData.get('direction') as 'next' | 'prev' | 'submit';

  // Handle "Back" navigation without validation
  if (direction === 'prev') {
    return {
      ...prevState,
      currentStep: Math.max(1, step - 1),
      errors: {},
    };
  }

  // Step 1 Validation & Accumulation
  if (step === 1) {
    const fullName = (formData.get('fullName') as string)?.trim();
    const email = (formData.get('email') as string)?.trim();

    if (!fullName || fullName.length < 3) {
      return {
        ...prevState,
        errors: { fullName: 'Full name must be at least 3 characters' },
      };
    }
    if (!email || !email.includes('@')) {
      return {
        ...prevState,
        errors: { email: 'Please enter a valid email address' },
      };
    }

    return {
      currentStep: 2,
      data: { ...prevState.data, fullName, email },
      errors: {},
    };
  }

  // Step 2 Validation & Final Submission
  if (step === 2) {
    const plan = formData.get('plan') as string;
    const billingPeriod = formData.get('billingPeriod') as string;

    if (!plan) {
      return {
        ...prevState,
        errors: { plan: 'Please select a plan' },
      };
    }

    const finalPayload = {
      ...prevState.data,
      plan,
      billingPeriod: billingPeriod || 'monthly',
    };

    // Perform database write / payment setup
    await saveRegistrationToDatabase(finalPayload);

    return {
      currentStep: 3,
      data: finalPayload,
      errors: {},
      isComplete: true,
    };
  }

  return prevState;
}

async function saveRegistrationToDatabase(payload: any) {
  // DB logic...
}

```

---

### Step 2: Implement the Client Multi-Step Component

Use `useActionState` to drive the form. Render only the active step's inputs while preserving the previous step's inputs via `defaultValue` or hidden fields if needed.

```tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { wizardAction, WizardState } from './actions/wizardAction';

const initialState: WizardState = {
  currentStep: 1,
  data: {},
  errors: {},
  isComplete: false,
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      name="direction"
      value="next"
      disabled={pending}
      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
    >
      {pending ? 'Processing...' : label}
    </button>
  );
}

export function RegistrationWizard() {
  const [state, formAction] = useActionState(wizardAction, initialState);

  if (state.isComplete) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-green-600">All Set!</h2>
        <p>Welcome, {state.data.fullName}. Your {state.data.plan} account is ready.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg shadow-sm">
      <div className="mb-4 flex justify-between text-sm font-semibold text-gray-500">
        <span>Step {state.currentStep} of 2</span>
        <span>{state.currentStep === 1 ? 'Personal Info' : 'Plan Selection'}</span>
      </div>

      <form action={formAction} className="space-y-4">
        {/* Pass the active step indicator into FormData */}
        <input type="hidden" name="step" value={state.currentStep} />

        {/* STEP 1: Personal Info */}
        {state.currentStep === 1 && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                name="fullName"
                defaultValue={state.data.fullName ?? ''}
                className="w-full border p-2 rounded"
              />
              {state.errors?.fullName && (
                <p className="text-sm text-red-500">{state.errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={state.data.email ?? ''}
                className="w-full border p-2 rounded"
              />
              {state.errors?.email && (
                <p className="text-sm text-red-500">{state.errors.email}</p>
              )}
            </div>

            <div className="flex justify-end">
              <SubmitButton label="Continue to Plan →" />
            </div>
          </div>
        )}

        {/* STEP 2: Plan Selection */}
        {state.currentStep === 2 && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Choose Plan</label>
              <select
                name="plan"
                defaultValue={state.data.plan ?? 'pro'}
                className="w-full border p-2 rounded"
              >
                <option value="basic">Basic ($9/mo)</option>
                <option value="pro">Pro ($29/mo)</option>
                <option value="enterprise">Enterprise ($99/mo)</option>
              </select>
              {state.errors?.plan && (
                <p className="text-sm text-red-500">{state.errors.plan}</p>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <button
                type="submit"
                name="direction"
                value="prev"
                className="px-4 py-2 border rounded"
              >
                ← Back
              </button>
              <SubmitButton label="Complete Registration" />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

```

---

### Architectural Advantages in React 19

* **Zero Client-Side Form Libraries:** No need for heavy form management dependencies (e.g., Formik, React Hook Form) for standard step workflows.
* **Resilient Draft State:** Moving backward and forward restores values seamlessly using `state.data` bound to each field's `defaultValue`.
* **Isolated Step Validation:** The server action validates only the submitted step's fields, preventing premature errors for steps the user hasn't seen yet.
* **Built-in Async Transitions:** Loading states (`useFormStatus`), disabled buttons, and validation error updates are handled inside transition boundaries without manual `isSubmitting` booleans.
