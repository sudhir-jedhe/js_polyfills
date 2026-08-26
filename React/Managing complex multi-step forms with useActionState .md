Managing multi-step wizard forms with React 19’s `useActionState` requires coordinating **step navigation**, **incremental validation**, and **accumulated state persistence** across server roundtrips.

The cleanest architecture treats the form state as a **single accumulated state machine** returned and updated by the Server Action on each step transition.

---

### Architecture & Data Flow

```
[Step 1: Account Info] ──▶ Action Validates Step 1 ──▶ State Updated: { step: 2, formData: {...} }
                                                              │
[Step 2: Profile Details] ◀───────────────────────────────────┘
       │
       ▼
Action Validates Step 2 ──▶ State Updated: { step: 3, formData: {...} }
       │
[Step 3: Review & Submit] ──▶ Action Commits to DB ──▶ State Updated: { step: 'complete', data: {...} }

```

---

### Step 1: Define the Multi-Step State & Zod Schemas

Define per-step validation schemas and a master accumulated state type:

```typescript
// types/wizard.ts
import { z } from 'zod';

export const Step1Schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const Step2Schema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  role: z.enum(['developer', 'designer', 'manager'], {
    message: 'Please select a valid role',
  }),
});

export const MasterWizardSchema = Step1Schema.merge(Step2Schema);
export type WizardFormData = z.infer<typeof MasterWizardSchema>;

export type WizardState = {
  currentStep: number;
  data: Partial<WizardFormData>;
  error?: string | null;
  fieldErrors?: Partial<Record<keyof WizardFormData, string[]>>;
  isComplete?: boolean;
};

```

---

### Step 2: Implement the Master Server Action

The action inspects `intent` (e.g., `next`, `back`, `submit`), validates only the current step's fields, merges them into the persistent data payload, and advances `currentStep`:

```typescript
// app/actions/wizard.ts
'use server';

import { Step1Schema, Step2Schema, MasterWizardSchema, type WizardState } from '@/types/wizard';
import db from '@/lib/db';

export async function wizardAction(
  prevState: WizardState,
  formData: FormData
): Promise<WizardState> {
  const intent = formData.get('intent') as 'next' | 'back' | 'submit';

  // 1. Handle Backwards Navigation (No validation needed)
  if (intent === 'back') {
    return {
      ...prevState,
      currentStep: Math.max(1, prevState.currentStep - 1),
      error: null,
      fieldErrors: undefined,
    };
  }

  // 2. Step 1 Validation & Progression
  if (prevState.currentStep === 1) {
    const rawStep1 = {
      email: formData.get('email'),
      password: formData.get('password'),
    };

    const parsed = Step1Schema.safeParse(rawStep1);
    if (!parsed.success) {
      return {
        ...prevState,
        fieldErrors: parsed.error.flatten().fieldErrors,
        error: 'Please correct the errors in Step 1.',
      };
    }

    return {
      currentStep: 2,
      data: { ...prevState.data, ...parsed.data },
      error: null,
      fieldErrors: undefined,
    };
  }

  // 3. Step 2 Validation & Progression
  if (prevState.currentStep === 2) {
    const rawStep2 = {
      fullName: formData.get('fullName'),
      role: formData.get('role'),
    };

    const parsed = Step2Schema.safeParse(rawStep2);
    if (!parsed.success) {
      return {
        ...prevState,
        fieldErrors: parsed.error.flatten().fieldErrors,
        error: 'Please correct the errors in Step 2.',
      };
    }

    return {
      currentStep: 3,
      data: { ...prevState.data, ...parsed.data },
      error: null,
      fieldErrors: undefined,
    };
  }

  // 4. Final Submission (Step 3)
  if (intent === 'submit' && prevState.currentStep === 3) {
    const fullValidation = MasterWizardSchema.safeParse(prevState.data);

    if (!fullValidation.success) {
      return {
        ...prevState,
        currentStep: 1, // Reset to first invalid step if corrupted
        error: 'Incomplete form data. Please review your entries.',
      };
    }

    try {
      await db.user.create({ data: fullValidation.data });

      return {
        currentStep: 4,
        data: {},
        isComplete: true,
      };
    } catch (err: any) {
      return {
        ...prevState,
        error: err.message || 'Database error: Could not complete registration.',
      };
    }
  }

  return prevState;
}

```

---

### Step 3: Client Wizard Component with `useActionState`

In the client component, `useActionState` maintains the accumulated state. Hidden inputs preserve previous values, while step-specific fields mount conditionally based on `state.currentStep`:

```tsx
// app/components/RegistrationWizard.tsx
'use client';

import { useActionState } from 'react';
import { wizardAction } from '@/app/actions/wizard';
import type { WizardState } from '@/types/wizard';

const initialWizardState: WizardState = {
  currentStep: 1,
  data: {},
  error: null,
};

export function RegistrationWizard() {
  const [state, formAction, isPending] = useActionState(wizardAction, initialWizardState);

  if (state.isComplete) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center space-y-2">
        <h2 className="text-xl font-bold text-green-800">Registration Complete!</h2>
        <p className="text-sm text-green-700">Your account has been successfully created.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 border rounded-xl bg-white shadow-sm space-y-6">
      {/* Step Indicator */}
      <div className="flex justify-between items-center border-b pb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
        <span className={state.currentStep >= 1 ? 'text-blue-600' : ''}>1. Account</span>
        <span className={state.currentStep >= 2 ? 'text-blue-600' : ''}>2. Profile</span>
        <span className={state.currentStep >= 3 ? 'text-blue-600' : ''}>3. Review</span>
      </div>

      {state.error && (
        <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* STEP 1: Account Info */}
        {state.currentStep === 1 && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                defaultValue={state.data.email || ''}
                className="w-full border p-2 rounded mt-1 text-sm"
                required
              />
              {state.fieldErrors?.email && (
                <p className="text-red-500 text-xs mt-1">{state.fieldErrors.email[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Password</label>
              <input
                name="password"
                type="password"
                defaultValue={state.data.password || ''}
                className="w-full border p-2 rounded mt-1 text-sm"
                required
              />
              {state.fieldErrors?.password && (
                <p className="text-red-500 text-xs mt-1">{state.fieldErrors.password[0]}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Profile Details */}
        {state.currentStep === 2 && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                name="fullName"
                type="text"
                defaultValue={state.data.fullName || ''}
                className="w-full border p-2 rounded mt-1 text-sm"
                required
              />
              {state.fieldErrors?.fullName && (
                <p className="text-red-500 text-xs mt-1">{state.fieldErrors.fullName[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Role</label>
              <select
                name="role"
                defaultValue={state.data.role || 'developer'}
                className="w-full border p-2 rounded mt-1 text-sm bg-white"
              >
                <option value="developer">Developer</option>
                <option value="designer">Designer</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 3: Review */}
        {state.currentStep === 3 && (
          <div className="space-y-2 text-sm bg-gray-50 p-4 rounded border">
            <h3 className="font-semibold text-gray-900 border-b pb-1">Review Information</h3>
            <p><strong>Email:</strong> {state.data.email}</p>
            <p><strong>Full Name:</strong> {state.data.fullName}</p>
            <p><strong>Role:</strong> {state.data.role}</p>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex justify-between pt-4 border-t">
          {state.currentStep > 1 && (
            <button
              type="submit"
              name="intent"
              value="back"
              disabled={isPending}
              className="px-4 py-2 border rounded text-sm font-medium hover:bg-gray-50"
            >
              Back
            </button>
          )}

          {state.currentStep < 3 ? (
            <button
              type="submit"
              name="intent"
              value="next"
              disabled={isPending}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Validating...' : 'Continue'}
            </button>
          ) : (
            <button
              type="submit"
              name="intent"
              value="submit"
              disabled={isPending}
              className="ml-auto px-4 py-2 bg-emerald-600 text-white rounded text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              {isPending ? 'Submitting...' : 'Confirm & Register'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

```

---

### Key Best Practices for Multi-Step Forms

* **Single Server Action vs. Multiple Actions:** Consolidating step transitions into a single action handler with an `intent` flag allows the state machine to share context and preserve the unified `WizardState` tuple cleanly without race conditions.
* **Preserving Uncontrolled Inputs with `defaultValue`:** Use `defaultValue={state.data.field}` so that if a user navigates backwards and forwards, their previously entered inputs are populated without turning inputs into sluggish controlled components.
* **Server-Side Re-validation on Submit:** Never trust intermediate step data blindly. On the final `'submit'` intent, always run the combined `MasterWizardSchema.safeParse(prevState.data)` to verify that no required properties were dropped or manipulated.
* **Transient Session Persistence (Optional):** For multi-page reloads or lengthy wizard flows, save `prevState.data` into encrypted HTTP-only session cookies or server-side Redis draft keys between steps.
