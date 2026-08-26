Handling dynamic branching where subsequent steps depend on earlier choices requires a **deterministic state machine** paired with a **directed acyclic graph (DAG)** of step transitions.

Rather than hardcoding index incrementation (`step + 1`), dynamic pathing dynamically evaluates the accumulated form state to determine the valid next step, previous step, and branch-specific validation rules.

---

### Step Graph Architecture

```
                       ┌──▶ [Step: Business Details] ──┐
                       │                               │
[Step: Account Type] ──┤                               ├──▶ [Step: Review & Submit]
                       │                               │
                       └──▶ [Step: Personal Details] ──┘

```

* **Step 1 (`account_type`):** User chooses `individual` vs. `business`.
* **Step 2 (Dynamic):** If `business`, branch to `business_details`; if `individual`, branch to `personal_details`.
* **Step 3 (`review`):** Both paths merge into a unified review and submit screen.
* **Pruning Invariant:** If a user returns to Step 1 and changes their selection, all conflicting downstream branch fields must be pruned from state.

---

### Step 1: Define Schemas and Transition Graph

```typescript
// types/branching-wizard.ts
import { z } from 'zod';

export type StepId = 'account_type' | 'business_details' | 'personal_details' | 'review';

export const AccountTypeSchema = z.object({
  accountType: z.enum(['individual', 'business']),
  contactEmail: z.string().email('Valid email is required'),
});

export const BusinessDetailsSchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  taxId: z.string().min(4, 'Valid Tax ID is required'),
  numberOfEmployees: z.coerce.number().int().positive('Must be at least 1'),
});

export const PersonalDetailsSchema = z.object({
  legalName: z.string().min(2, 'Full name is required'),
  nationalId: z.string().min(4, 'ID number is required'),
});

export interface WizardData {
  accountType?: 'individual' | 'business';
  contactEmail?: string;
  companyName?: string;
  taxId?: string;
  numberOfEmployees?: number;
  legalName?: string;
  nationalId?: string;
}

export interface BranchingWizardState {
  currentStep: StepId;
  data: WizardData;
  error?: string | null;
  fieldErrors?: Record<string, string[]>;
  isComplete?: boolean;
}

// ── Deterministic Transition Graph Helper ──
export function getNextStep(current: StepId, data: WizardData): StepId {
  switch (current) {
    case 'account_type':
      return data.accountType === 'business' ? 'business_details' : 'personal_details';
    case 'business_details':
    case 'personal_details':
      return 'review';
    case 'review':
      return 'review';
  }
}

export function getPreviousStep(current: StepId, data: WizardData): StepId {
  switch (current) {
    case 'review':
      return data.accountType === 'business' ? 'business_details' : 'personal_details';
    case 'business_details':
    case 'personal_details':
      return 'account_type';
    case 'account_type':
      return 'account_type';
  }
}

```

---

### Step 2: Implement the Master Server Action

The Server Action validates data using the active branch schema, cleans up obsolete fields if the root choice changed, and computes the next step via the transition graph:

```typescript
// app/actions/branching-wizard.ts
'use server';

import {
  AccountTypeSchema,
  BusinessDetailsSchema,
  PersonalDetailsSchema,
  getNextStep,
  getPreviousStep,
  type BranchingWizardState,
  type WizardData,
} from '@/types/branching-wizard';
import db from '@/lib/db';

export async function branchingWizardAction(
  prevState: BranchingWizardState,
  formData: FormData
): Promise<BranchingWizardState> {
  const intent = formData.get('intent') as 'next' | 'back' | 'submit';

  // 1. Handle Dynamic Back Navigation
  if (intent === 'back') {
    const prevStep = getPreviousStep(prevState.currentStep, prevState.data);
    return {
      ...prevState,
      currentStep: prevStep,
      error: null,
      fieldErrors: undefined,
    };
  }

  // 2. Validate Step: account_type
  if (prevState.currentStep === 'account_type') {
    const raw = {
      accountType: formData.get('accountType'),
      contactEmail: formData.get('contactEmail'),
    };

    const parsed = AccountTypeSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        ...prevState,
        fieldErrors: parsed.error.flatten().fieldErrors,
        error: 'Please fill in all account fields correctly.',
      };
    }

    // Prune stale fields if accountType changed after navigating backward
    const typeChanged = prevState.data.accountType !== parsed.data.accountType;
    let updatedData: WizardData = { ...prevState.data, ...parsed.data };

    if (typeChanged) {
      if (parsed.data.accountType === 'individual') {
        delete updatedData.companyName;
        delete updatedData.taxId;
        delete updatedData.numberOfEmployees;
      } else {
        delete updatedData.legalName;
        delete updatedData.nationalId;
      }
    }

    const nextStep = getNextStep('account_type', updatedData);

    return {
      currentStep: nextStep,
      data: updatedData,
      error: null,
      fieldErrors: undefined,
    };
  }

  // 3. Validate Step: business_details
  if (prevState.currentStep === 'business_details') {
    const raw = {
      companyName: formData.get('companyName'),
      taxId: formData.get('taxId'),
      numberOfEmployees: formData.get('numberOfEmployees'),
    };

    const parsed = BusinessDetailsSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        ...prevState,
        fieldErrors: parsed.error.flatten().fieldErrors,
        error: 'Please correct corporate details.',
      };
    }

    const updatedData: WizardData = { ...prevState.data, ...parsed.data };
    const nextStep = getNextStep('business_details', updatedData);

    return {
      currentStep: nextStep,
      data: updatedData,
      error: null,
      fieldErrors: undefined,
    };
  }

  // 4. Validate Step: personal_details
  if (prevState.currentStep === 'personal_details') {
    const raw = {
      legalName: formData.get('legalName'),
      nationalId: formData.get('nationalId'),
    };

    const parsed = PersonalDetailsSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        ...prevState,
        fieldErrors: parsed.error.flatten().fieldErrors,
        error: 'Please correct personal identity fields.',
      };
    }

    const updatedData: WizardData = { ...prevState.data, ...parsed.data };
    const nextStep = getNextStep('personal_details', updatedData);

    return {
      currentStep: nextStep,
      data: updatedData,
      error: null,
      fieldErrors: undefined,
    };
  }

  // 5. Final Step: review & submit
  if (intent === 'submit' && prevState.currentStep === 'review') {
    try {
      await db.customerOnboarding.create({
        data: prevState.data,
      });

      return {
        currentStep: 'account_type',
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

### Step 3: Client Component with `useActionState`

The client component displays dynamic breadcrumbs and renders the input controls matching the active graph node:

```tsx
// app/components/DynamicBranchingWizard.tsx
'use client';

import { useActionState } from 'react';
import { branchingWizardAction } from '@/app/actions/branching-wizard';
import type { BranchingWizardState } from '@/types/branching-wizard';

const initialState: BranchingWizardState = {
  currentStep: 'account_type',
  data: {
    accountType: 'individual',
  },
  error: null,
};

export function DynamicBranchingWizard() {
  const [state, formAction, isPending] = useActionState(branchingWizardAction, initialState);

  if (state.isComplete) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 text-emerald-900">
        <h3 className="font-bold text-lg">Onboarding Complete</h3>
        <p className="text-sm">Your dynamic application was successfully validated and saved.</p>
      </div>
    );
  }

  const { currentStep, data, fieldErrors, error } = state;

  return (
    <div className="max-w-lg mx-auto bg-white border rounded-xl shadow-sm p-6 space-y-5">
      {/* Dynamic Breadcrumbs */}
      <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-gray-400 border-b pb-3">
        <span className={currentStep === 'account_type' ? 'text-blue-600' : ''}>
          1. Account
        </span>
        <span
          className={
            currentStep === 'business_details' || currentStep === 'personal_details'
              ? 'text-blue-600'
              : ''
          }
        >
          2. {data.accountType === 'business' ? 'Business Profile' : 'Personal Profile'}
        </span>
        <span className={currentStep === 'review' ? 'text-blue-600' : ''}>
          3. Review
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs border border-red-200 rounded">
          {error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* STEP 1: Account Type Selection */}
        {currentStep === 'account_type' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Account Type</label>
              <select
                name="accountType"
                defaultValue={data.accountType || 'individual'}
                className="w-full border p-2 rounded text-sm mt-1 bg-white"
              >
                <option value="individual">Individual Account</option>
                <option value="business">Corporate / Business Account</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Contact Email</label>
              <input
                name="contactEmail"
                type="email"
                defaultValue={data.contactEmail || ''}
                className="w-full border p-2 rounded text-sm mt-1"
                required
              />
              {fieldErrors?.contactEmail && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.contactEmail[0]}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2 (BRANCH A): Business Details */}
        {currentStep === 'business_details' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Company Name</label>
              <input
                name="companyName"
                defaultValue={data.companyName || ''}
                className="w-full border p-2 rounded text-sm mt-1"
                required
              />
              {fieldErrors?.companyName && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.companyName[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Tax Identification Number</label>
              <input
                name="taxId"
                defaultValue={data.taxId || ''}
                className="w-full border p-2 rounded text-sm mt-1"
                required
              />
              {fieldErrors?.taxId && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.taxId[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Total Employees</label>
              <input
                name="numberOfEmployees"
                type="number"
                defaultValue={data.numberOfEmployees || 1}
                className="w-full border p-2 rounded text-sm mt-1"
                required
              />
            </div>
          </div>
        )}

        {/* STEP 2 (BRANCH B): Personal Details */}
        {currentStep === 'personal_details' && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Full Legal Name</label>
              <input
                name="legalName"
                defaultValue={data.legalName || ''}
                className="w-full border p-2 rounded text-sm mt-1"
                required
              />
              {fieldErrors?.legalName && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.legalName[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">National ID / Passport Number</label>
              <input
                name="nationalId"
                defaultValue={data.nationalId || ''}
                className="w-full border p-2 rounded text-sm mt-1"
                required
              />
              {fieldErrors?.nationalId && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.nationalId[0]}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Unified Review Branch */}
        {currentStep === 'review' && (
          <div className="p-4 bg-gray-50 border rounded-lg text-sm space-y-2">
            <h4 className="font-semibold text-gray-900 border-b pb-1">Review Information</h4>
            <p><strong>Account Type:</strong> {data.accountType}</p>
            <p><strong>Email:</strong> {data.contactEmail}</p>

            {data.accountType === 'business' ? (
              <>
                <p><strong>Company:</strong> {data.companyName}</p>
                <p><strong>Tax ID:</strong> {data.taxId}</p>
                <p><strong>Team Size:</strong> {data.numberOfEmployees}</p>
              </>
            ) : (
              <>
                <p><strong>Legal Name:</strong> {data.legalName}</p>
                <p><strong>National ID:</strong> {data.nationalId}</p>
              </>
            )}
          </div>
        )}

        {/* Form Controls */}
        <div className="flex justify-between pt-4 border-t">
          {currentStep !== 'account_type' && (
            <button
              type="submit"
              name="intent"
              value="back"
              disabled={isPending}
              className="px-4 py-2 border rounded text-sm font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
          )}

          {currentStep !== 'review' ? (
            <button
              type="submit"
              name="intent"
              value="next"
              disabled={isPending}
              className="ml-auto px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isPending ? 'Validating...' : 'Next Step'}
            </button>
          ) : (
            <button
              type="submit"
              name="intent"
              value="submit"
              disabled={isPending}
              className="ml-auto px-4 py-2 bg-emerald-600 text-white rounded text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50"
            >
              {isPending ? 'Submitting...' : 'Confirm & Complete'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

```

---

### Core Resilience Checklist

* **State Pruning:** Always clean up child branch variables if parent discriminant fields change to keep state payloads concise and eliminate conflicting attributes in database schemas.
* **Semantic Enums Over Numbers:** Use string enum identifiers (`account_type`, `business_details`, `personal_details`) to avoid index misalignment bugs when steps are dynamically injected or skipped.
* **Independent Transition Functions:** Decouple `getNextStep()` and `getPreviousStep()` into pure helper functions so they can be unit-tested across all permutations of wizard data without mocking React components.
