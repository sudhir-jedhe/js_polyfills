Handling dynamic branching in a multi-step form requires a **deterministic state machine** within the Server Action. Instead of hardcoding sequential steps (e.g., `step + 1`), dynamic pathing computes the next or previous step by evaluating accumulated choices stored in the form state.

---

### 1. Define Step Identifiers and Conditional Schemas

Use semantic step identifiers (such as `'account' | 'business_details' | 'personal_details' | 'review'`) rather than fixed step numbers:

```typescript
// types/dynamic-wizard.ts
import { z } from 'zod';

export type AccountType = 'individual' | 'business';

export const AccountStepSchema = z.object({
  accountType: z.enum(['individual', 'business']),
  email: z.string().email('Invalid email address'),
});

export const PersonalDetailsSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
});

export const BusinessDetailsSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  taxId: z.string().min(4, 'Tax ID is required'),
  teamSize: z.coerce.number().min(1, 'Team size must be at least 1'),
});

export type StepId = 'account' | 'details' | 'review';

export interface DynamicWizardState {
  currentStep: StepId;
  data: {
    accountType?: AccountType;
    email?: string;
    fullName?: string;
    dateOfBirth?: string;
    companyName?: string;
    taxId?: string;
    teamSize?: number;
  };
  error?: string | null;
  fieldErrors?: Record<string, string[]>;
  isComplete?: boolean;
}

```

---

### 2. Implement Dynamic Branching in the Server Action

The Server Action validates data using the schema corresponding to the chosen branch, prunes obsolete branch data if the user altered an earlier choice, and transitions to the appropriate step.

```typescript
// app/actions/dynamic-wizard.ts
'use server';

import {
  AccountStepSchema,
  PersonalDetailsSchema,
  BusinessDetailsSchema,
  type DynamicWizardState,
} from '@/types/dynamic-wizard';
import db from '@/lib/db';

export async function dynamicWizardAction(
  prevState: DynamicWizardState,
  formData: FormData
): Promise<DynamicWizardState> {
  const intent = formData.get('intent') as 'next' | 'back' | 'submit';

  // 1. Handle Dynamic Back Navigation
  if (intent === 'back') {
    if (prevState.currentStep === 'review') {
      return { ...prevState, currentStep: 'details', error: null, fieldErrors: undefined };
    }
    if (prevState.currentStep === 'details') {
      return { ...prevState, currentStep: 'account', error: null, fieldErrors: undefined };
    }
    return prevState;
  }

  // 2. STEP 1: Account Type Selection
  if (prevState.currentStep === 'account') {
    const raw = {
      accountType: formData.get('accountType'),
      email: formData.get('email'),
    };

    const parsed = AccountStepSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        ...prevState,
        fieldErrors: parsed.error.flatten().fieldErrors,
        error: 'Please fill out all required fields.',
      };
    }

    // Prune details if the user changed account types after filling Step 2
    const typeChanged = prevState.data.accountType !== parsed.data.accountType;
    const sanitizedData = typeChanged
      ? { accountType: parsed.data.accountType, email: parsed.data.email }
      : { ...prevState.data, ...parsed.data };

    return {
      currentStep: 'details',
      data: sanitizedData,
      error: null,
      fieldErrors: undefined,
    };
  }

  // 3. STEP 2: Conditional Details Branching
  if (prevState.currentStep === 'details') {
    const accountType = prevState.data.accountType;

    if (accountType === 'business') {
      const rawBusiness = {
        companyName: formData.get('companyName'),
        taxId: formData.get('taxId'),
        teamSize: formData.get('teamSize'),
      };

      const parsed = BusinessDetailsSchema.safeParse(rawBusiness);
      if (!parsed.success) {
        return {
          ...prevState,
          fieldErrors: parsed.error.flatten().fieldErrors,
          error: 'Please verify business details.',
        };
      }

      return {
        currentStep: 'review',
        data: { ...prevState.data, ...parsed.data },
        error: null,
        fieldErrors: undefined,
      };
    } else {
      // Individual Account Branch
      const rawPersonal = {
        fullName: formData.get('fullName'),
        dateOfBirth: formData.get('dateOfBirth'),
      };

      const parsed = PersonalDetailsSchema.safeParse(rawPersonal);
      if (!parsed.success) {
        return {
          ...prevState,
          fieldErrors: parsed.error.flatten().fieldErrors,
          error: 'Please verify personal details.',
        };
      }

      return {
        currentStep: 'review',
        data: { ...prevState.data, ...parsed.data },
        error: null,
        fieldErrors: undefined,
      };
    }
  }

  // 4. STEP 3: Final Submission & Storage
  if (intent === 'submit' && prevState.currentStep === 'review') {
    try {
      await db.registration.create({
        data: prevState.data,
      });

      return {
        currentStep: 'account',
        data: {},
        isComplete: true,
      };
    } catch (err: any) {
      return {
        ...prevState,
        error: err.message || 'Failed to submit registration.',
      };
    }
  }

  return prevState;
}

```

---

### 3. Client Component Rendering

Conditionally render form controls based on `state.currentStep` and `state.data.accountType`:

```tsx
// app/components/DynamicWizard.tsx
'use client';

import { useActionState } from 'react';
import { dynamicWizardAction } from '@/app/actions/dynamic-wizard';
import type { DynamicWizardState } from '@/types/dynamic-wizard';

const initialDynamicState: DynamicWizardState = {
  currentStep: 'account',
  data: {
    accountType: 'individual',
  },
  error: null,
};

export function DynamicWizard() {
  const [state, formAction, isPending] = useActionState(
    dynamicWizardAction,
    initialDynamicState
  );

  if (state.isComplete) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
        <h3 className="font-bold">Application Complete</h3>
        <p className="text-sm mt-1">Your details have been successfully submitted.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-5">
      {/* Dynamic Progress Indicator */}
      <div className="flex justify-between text-xs font-semibold uppercase text-gray-400 border-b pb-3">
        <span className={state.currentStep === 'account' ? 'text-blue-600' : ''}>1. Account Type</span>
        <span className={state.currentStep === 'details' ? 'text-blue-600' : ''}>
          2. {state.data.accountType === 'business' ? 'Company Details' : 'Personal Details'}
        </span>
        <span className={state.currentStep === 'review' ? 'text-blue-600' : ''}>3. Review</span>
      </div>

      {state.error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs border border-red-200 rounded">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* STEP 1: Account Type */}
        {state.currentStep === 'account' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Account Category</label>
              <select
                name="accountType"
                defaultValue={state.data.accountType || 'individual'}
                className="w-full border p-2 rounded text-sm mt-1 bg-white"
              >
                <option value="individual">Individual / Personal</option>
                <option value="business">Corporate / Business</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Email Address</label>
              <input
                name="email"
                type="email"
                defaultValue={state.data.email || ''}
                className="w-full border p-2 rounded text-sm mt-1"
                required
              />
              {state.fieldErrors?.email && (
                <p className="text-red-500 text-xs mt-1">{state.fieldErrors.email[0]}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: Branch A - Business Details */}
        {state.currentStep === 'details' && state.data.accountType === 'business' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Company Name</label>
              <input
                name="companyName"
                defaultValue={state.data.companyName || ''}
                className="w-full border p-2 rounded text-sm mt-1"
                required
              />
              {state.fieldErrors?.companyName && (
                <p className="text-red-500 text-xs mt-1">{state.fieldErrors.companyName[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Tax ID / VAT</label>
              <input
                name="taxId"
                defaultValue={state.data.taxId || ''}
                className="w-full border p-2 rounded text-sm mt-1"
                required
              />
              {state.fieldErrors?.taxId && (
                <p className="text-red-500 text-xs mt-1">{state.fieldErrors.taxId[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Team Size</label>
              <input
                name="teamSize"
                type="number"
                defaultValue={state.data.teamSize || 1}
                className="w-full border p-2 rounded text-sm mt-1"
                required
              />
            </div>
          </div>
        )}

        {/* STEP 2: Branch B - Individual Details */}
        {state.currentStep === 'details' && state.data.accountType === 'individual' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Full Name</label>
              <input
                name="fullName"
                defaultValue={state.data.fullName || ''}
                className="w-full border p-2 rounded text-sm mt-1"
                required
              />
              {state.fieldErrors?.fullName && (
                <p className="text-red-500 text-xs mt-1">{state.fieldErrors.fullName[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Date of Birth</label>
              <input
                name="dateOfBirth"
                type="date"
                defaultValue={state.data.dateOfBirth || ''}
                className="w-full border p-2 rounded text-sm mt-1"
                required
              />
              {state.fieldErrors?.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">{state.fieldErrors.dateOfBirth[0]}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Unified Review Branch */}
        {state.currentStep === 'review' && (
          <div className="p-4 bg-gray-50 border rounded text-sm space-y-2">
            <h4 className="font-semibold text-gray-900 border-b pb-1">Review Details</h4>
            <p><strong>Account Type:</strong> {state.data.accountType}</p>
            <p><strong>Email:</strong> {state.data.email}</p>

            {state.data.accountType === 'business' ? (
              <>
                <p><strong>Company:</strong> {state.data.companyName}</p>
                <p><strong>Tax ID:</strong> {state.data.taxId}</p>
                <p><strong>Team Size:</strong> {state.data.teamSize}</p>
              </>
            ) : (
              <>
                <p><strong>Full Name:</strong> {state.data.fullName}</p>
                <p><strong>Date of Birth:</strong> {state.data.dateOfBirth}</p>
              </>
            )}
          </div>
        )}

        {/* Navigation Actions */}
        <div className="flex justify-between pt-4 border-t">
          {state.currentStep !== 'account' && (
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

          {state.currentStep !== 'review' ? (
            <button
              type="submit"
              name="intent"
              value="next"
              disabled={isPending}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Validating...' : 'Next'}
            </button>
          ) : (
            <button
              type="submit"
              name="intent"
              value="submit"
              disabled={isPending}
              className="ml-auto px-4 py-2 bg-emerald-600 text-white rounded text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Confirm Submission'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

```

---

### Core Architectural Rules for Dynamic Branching

* **Branch Data Pruning:** If a user navigates back to Step 1 and changes their decision (e.g., switches from `'business'` to `'individual'`), prune the obsolete branch fields (`companyName`, `taxId`) from `state.data` to prevent lingering attributes from polluting final payloads.
* **Semantic Step Identifiers:** Use semantic strings (`'account' | 'details' | 'review'`) instead of numeric counters to eliminate off-by-one errors when steps are skipped or dynamically inserted.
* **Branch-Specific Validation Guards:** Validate only the schema matching the active branch on each pass; never run unified schemas until the final `'submit'` phase.
