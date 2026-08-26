When building multi-step forms with dynamic branching, steps and validation rules are not linear. A choice in Step 1 (e.g., *Account Type: Individual vs. Business*) alters the required steps, schemas, and backward navigation history.

The standard architectural pattern models this as a **Directed Acyclic Graph (DAG) State Machine** within a React 19 Server Action using `useActionState` and Zod discriminated validation.

---

### Transition Graph Architecture

```
                       ┌──▶ [Step: Business KYC] ──▶ [Step: Ownership] ──┐
                       │                                                 │
[Step: Account Type] ──┤                                                 ├──▶ [Step: Review]
                       │                                                 │
                       └──▶ [Step: Individual KYC] ──────────────────────┘

```

* **Dynamic History Stack:** Going "Back" pops the previous step from an explicit history stack rather than subtracting an index counter.
* **Orphan Data Pruning:** If a user backtracks and changes a root branching field, stale attributes belonging to abandoned branches are stripped before validation.
* **Isolated Step Validation:** Intermediate steps validate only their active branch schema, while the final step runs an end-to-end discriminated union.

---

### Step 1: Define Dynamic Step Types and Discriminated Schemas

```typescript
// types/dynamic-branch-wizard.ts
import { z } from 'zod';

export type StepId =
  | 'ACCOUNT_TYPE'
  | 'INDIVIDUAL_KYC'
  | 'BUSINESS_KYC'
  | 'BUSINESS_OWNERSHIP'
  | 'REVIEW';

export const AccountTypeSchema = z.object({
  accountType: z.enum(['INDIVIDUAL', 'BUSINESS']),
  email: z.string().email('Valid email is required'),
});

export const IndividualKycSchema = z.object({
  legalFullName: z.string().min(2, 'Full name is required'),
  nationalIdNumber: z.string().min(4, 'National ID is required'),
});

export const BusinessKycSchema = z.object({
  legalEntityName: z.string().min(2, 'Entity name is required'),
  taxIdentificationNumber: z.string().min(4, 'Tax ID is required'),
});

export const BusinessOwnershipSchema = z.object({
  ultimateBeneficiary: z.string().min(2, 'Beneficiary name is required'),
  ownershipPercentage: z.coerce.number().min(1).max(100, 'Must be between 1 and 100'),
});

// Final Master Schema (Discriminated Union)
export const MasterOnboardingSchema = z.discriminatedUnion('accountType', [
  z.object({
    accountType: z.literal('INDIVIDUAL'),
    email: z.string().email(),
    legalFullName: z.string().min(2),
    nationalIdNumber: z.string().min(4),
  }),
  z.object({
    accountType: z.literal('BUSINESS'),
    email: z.string().email(),
    legalEntityName: z.string().min(2),
    taxIdentificationNumber: z.string().min(4),
    ultimateBeneficiary: z.string().min(2),
    ownershipPercentage: z.coerce.number().min(1).max(100),
  }),
]);

export type OnboardingData = {
  accountType?: 'INDIVIDUAL' | 'BUSINESS';
  email?: string;
  legalFullName?: string;
  nationalIdNumber?: string;
  legalEntityName?: string;
  taxIdentificationNumber?: string;
  ultimateBeneficiary?: string;
  ownershipPercentage?: number;
};

export interface WizardState {
  currentStep: StepId;
  history: StepId[];
  data: OnboardingData;
  error?: string | null;
  fieldErrors?: Record<string, string[]>;
  isComplete?: boolean;
}

```

---

### Step 2: Transition Graph & Pruning Engine

Encapsulate step routing and cleanup functions:

```typescript
// lib/wizard-machine.ts
import { StepId, OnboardingData } from '@/types/dynamic-branch-wizard';

export function getNextStep(current: StepId, data: OnboardingData): StepId {
  switch (current) {
    case 'ACCOUNT_TYPE':
      return data.accountType === 'BUSINESS' ? 'BUSINESS_KYC' : 'INDIVIDUAL_KYC';
    case 'INDIVIDUAL_KYC':
      return 'REVIEW';
    case 'BUSINESS_KYC':
      return 'BUSINESS_OWNERSHIP';
    case 'BUSINESS_OWNERSHIP':
      return 'REVIEW';
    case 'REVIEW':
      return 'REVIEW';
  }
}

/**
 * Prunes orphaned branch fields when a branch pivot occurs in Step 1.
 */
export function pruneObsoleteBranchData(
  previousData: OnboardingData,
  newAccountType: 'INDIVIDUAL' | 'BUSINESS'
): OnboardingData {
  if (previousData.accountType === newAccountType) {
    return previousData;
  }

  const { email } = previousData;

  if (newAccountType === 'INDIVIDUAL') {
    return { accountType: 'INDIVIDUAL', email };
  } else {
    return { accountType: 'BUSINESS', email };
  }
}

```

---

### Step 3: Server Action with Branch State Machine

```typescript
// app/actions/dynamic-branch-action.ts
'use server';

import {
  AccountTypeSchema,
  IndividualKycSchema,
  BusinessKycSchema,
  BusinessOwnershipSchema,
  MasterOnboardingSchema,
  type WizardState,
  type StepId,
} from '@/types/dynamic-branch-wizard';
import { getNextStep, pruneObsoleteBranchData } from '@/lib/wizard-machine';
import db from '@/lib/db';

export async function dynamicBranchWizardAction(
  prevState: WizardState,
  formData: FormData
): Promise<WizardState> {
  const intent = formData.get('intent') as 'next' | 'back' | 'submit';

  // 1. Handle Backward Navigation via History Stack
  if (intent === 'back') {
    const history = [...prevState.history];
    const previousStep = history.pop() || 'ACCOUNT_TYPE';

    return {
      ...prevState,
      currentStep: previousStep,
      history,
      error: null,
      fieldErrors: undefined,
    };
  }

  // 2. Validate Step: ACCOUNT_TYPE
  if (prevState.currentStep === 'ACCOUNT_TYPE') {
    const parsed = AccountTypeSchema.safeParse({
      accountType: formData.get('accountType'),
      email: formData.get('email'),
    });

    if (!parsed.success) {
      return {
        ...prevState,
        fieldErrors: parsed.error.flatten().fieldErrors,
        error: 'Please fix the errors before continuing.',
      };
    }

    const prunedData = pruneObsoleteBranchData(prevState.data, parsed.data.accountType);
    const mergedData = { ...prunedData, ...parsed.data };
    const next = getNextStep('ACCOUNT_TYPE', mergedData);

    return {
      currentStep: next,
      history: [...prevState.history, 'ACCOUNT_TYPE'],
      data: mergedData,
      error: null,
      fieldErrors: undefined,
    };
  }

  // 3. Validate Step: INDIVIDUAL_KYC
  if (prevState.currentStep === 'INDIVIDUAL_KYC') {
    const parsed = IndividualKycSchema.safeParse({
      legalFullName: formData.get('legalFullName'),
      nationalIdNumber: formData.get('nationalIdNumber'),
    });

    if (!parsed.success) {
      return {
        ...prevState,
        fieldErrors: parsed.error.flatten().fieldErrors,
        error: 'Please verify personal details.',
      };
    }

    const mergedData = { ...prevState.data, ...parsed.data };
    const next = getNextStep('INDIVIDUAL_KYC', mergedData);

    return {
      currentStep: next,
      history: [...prevState.history, 'INDIVIDUAL_KYC'],
      data: mergedData,
      error: null,
      fieldErrors: undefined,
    };
  }

  // 4. Validate Step: BUSINESS_KYC
  if (prevState.currentStep === 'BUSINESS_KYC') {
    const parsed = BusinessKycSchema.safeParse({
      legalEntityName: formData.get('legalEntityName'),
      taxIdentificationNumber: formData.get('taxIdentificationNumber'),
    });

    if (!parsed.success) {
      return {
        ...prevState,
        fieldErrors: parsed.error.flatten().fieldErrors,
        error: 'Please verify company details.',
      };
    }

    const mergedData = { ...prevState.data, ...parsed.data };
    const next = getNextStep('BUSINESS_KYC', mergedData);

    return {
      currentStep: next,
      history: [...prevState.history, 'BUSINESS_KYC'],
      data: mergedData,
      error: null,
      fieldErrors: undefined,
    };
  }

  // 5. Validate Step: BUSINESS_OWNERSHIP
  if (prevState.currentStep === 'BUSINESS_OWNERSHIP') {
    const parsed = BusinessOwnershipSchema.safeParse({
      ultimateBeneficiary: formData.get('ultimateBeneficiary'),
      ownershipPercentage: formData.get('ownershipPercentage'),
    });

    if (!parsed.success) {
      return {
        ...prevState,
        fieldErrors: parsed.error.flatten().fieldErrors,
        error: 'Please verify ownership details.',
      };
    }

    const mergedData = { ...prevState.data, ...parsed.data };
    const next = getNextStep('BUSINESS_OWNERSHIP', mergedData);

    return {
      currentStep: next,
      history: [...prevState.history, 'BUSINESS_OWNERSHIP'],
      data: mergedData,
      error: null,
      fieldErrors: undefined,
    };
  }

  // 6. Final Step: End-to-End Submission
  if (intent === 'submit' && prevState.currentStep === 'REVIEW') {
    const masterValidation = MasterOnboardingSchema.safeParse(prevState.data);

    if (!masterValidation.success) {
      return {
        ...prevState,
        currentStep: 'ACCOUNT_TYPE',
        history: [],
        error: 'State corruption detected. Please review all steps.',
      };
    }

    try {
      await db.onboardingRecord.create({
        data: masterValidation.data,
      });

      return {
        currentStep: 'ACCOUNT_TYPE',
        history: [],
        data: {},
        isComplete: true,
      };
    } catch (err: any) {
      return {
        ...prevState,
        error: err.message || 'Database error during submission.',
      };
    }
  }

  return prevState;
}

```

---

### Step 4: Client Multi-Step Component (`useActionState`)

```tsx
// app/components/DynamicBranchWizardClient.tsx
'use client';

import { useActionState } from 'react';
import { dynamicBranchWizardAction } from '@/app/actions/dynamic-branch-action';
import type { WizardState } from '@/types/dynamic-branch-wizard';

const initialState: WizardState = {
  currentStep: 'ACCOUNT_TYPE',
  history: [],
  data: { accountType: 'INDIVIDUAL' },
  error: null,
};

export function DynamicBranchWizardClient() {
  const [state, formAction, isPending] = useActionState(
    dynamicBranchWizardAction,
    initialState
  );

  if (state.isComplete) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
        <h3 className="text-emerald-900 font-bold text-lg">Onboarding Complete</h3>
        <p className="text-emerald-700 text-sm">Your application has passed validation and is submitted.</p>
      </div>
    );
  }

  const { currentStep, data, fieldErrors, error } = state;

  return (
    <div className="max-w-lg mx-auto bg-white border rounded-xl shadow-sm p-6 space-y-5">
      {/* Dynamic Progress Indicator */}
      <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-gray-400 border-b pb-3">
        <span className={currentStep === 'ACCOUNT_TYPE' ? 'text-blue-600 font-bold' : ''}>
          1. Account
        </span>
        <span
          className={
            currentStep === 'INDIVIDUAL_KYC' || currentStep === 'BUSINESS_KYC'
              ? 'text-blue-600 font-bold'
              : ''
          }
        >
          2. KYC
        </span>
        {data.accountType === 'BUSINESS' && (
          <span className={currentStep === 'BUSINESS_OWNERSHIP' ? 'text-blue-600 font-bold' : ''}>
            3. Ownership
          </span>
        )}
        <span className={currentStep === 'REVIEW' ? 'text-blue-600 font-bold' : ''}>
          {data.accountType === 'BUSINESS' ? '4. Review' : '3. Review'}
        </span>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs border border-red-200 rounded">
          {error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* STEP 1: Account Type Selection */}
        {currentStep === 'ACCOUNT_TYPE' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                Account Category
              </label>
              <select
                name="accountType"
                defaultValue={data.accountType || 'INDIVIDUAL'}
                className="w-full border p-2 rounded-lg text-sm bg-white"
              >
                <option value="INDIVIDUAL">Individual Account</option>
                <option value="BUSINESS">Corporate / Business Account</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                defaultValue={data.email || ''}
                className="w-full border p-2 rounded-lg text-sm"
                required
              />
              {fieldErrors?.email && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.email[0]}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2 (BRANCH A): Individual KYC */}
        {currentStep === 'INDIVIDUAL_KYC' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                Full Legal Name
              </label>
              <input
                name="legalFullName"
                defaultValue={data.legalFullName || ''}
                className="w-full border p-2 rounded-lg text-sm"
                required
              />
              {fieldErrors?.legalFullName && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.legalFullName[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                National ID / Passport Number
              </label>
              <input
                name="nationalIdNumber"
                defaultValue={data.nationalIdNumber || ''}
                className="w-full border p-2 rounded-lg text-sm"
                required
              />
              {fieldErrors?.nationalIdNumber && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.nationalIdNumber[0]}</p>
              )}
            </div>
          </div>
        )}

        {/* STEP 2 (BRANCH B): Business KYC */}
        {currentStep === 'BUSINESS_KYC' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                Legal Entity Name
              </label>
              <input
                name="legalEntityName"
                defaultValue={data.legalEntityName || ''}
                className="w-full border p-2 rounded-lg text-sm"
                required
              />
              {fieldErrors?.legalEntityName && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.legalEntityName[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                Tax Identification Number (TIN / EIN)
              </label>
              <input
                name="taxIdentificationNumber"
                defaultValue={data.taxIdentificationNumber || ''}
                className="w-full border p-2 rounded-lg text-sm"
                required
              />
              {fieldErrors?.taxIdentificationNumber && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.taxIdentificationNumber[0]}
                </p>
              )}
            </div>
          </div>
        )}

        {/* STEP 3 (BRANCH B ONLY): Business Ownership */}
        {currentStep === 'BUSINESS_OWNERSHIP' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                Ultimate Beneficial Owner (UBO)
              </label>
              <input
                name="ultimateBeneficiary"
                defaultValue={data.ultimateBeneficiary || ''}
                className="w-full border p-2 rounded-lg text-sm"
                required
              />
              {fieldErrors?.ultimateBeneficiary && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.ultimateBeneficiary[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                Equity Ownership (%)
              </label>
              <input
                name="ownershipPercentage"
                type="number"
                defaultValue={data.ownershipPercentage || 100}
                min={1}
                max={100}
                className="w-full border p-2 rounded-lg text-sm"
                required
              />
              {fieldErrors?.ownershipPercentage && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.ownershipPercentage[0]}</p>
              )}
            </div>
          </div>
        )}

        {/* FINAL STEP: Dynamic Review */}
        {currentStep === 'REVIEW' && (
          <div className="p-4 bg-gray-50 border rounded-lg text-sm space-y-2">
            <h4 className="font-semibold text-gray-900 border-b pb-1">Review Details</h4>
            <p><strong>Account Type:</strong> {data.accountType}</p>
            <p><strong>Email:</strong> {data.email}</p>

            {data.accountType === 'INDIVIDUAL' ? (
              <>
                <p><strong>Full Name:</strong> {data.legalFullName}</p>
                <p><strong>National ID:</strong> {data.nationalIdNumber}</p>
              </>
            ) : (
              <>
                <p><strong>Entity Name:</strong> {data.legalEntityName}</p>
                <p><strong>Tax ID:</strong> {data.taxIdentificationNumber}</p>
                <p><strong>Beneficiary:</strong> {data.ultimateBeneficiary}</p>
                <p><strong>Ownership:</strong> {data.ownershipPercentage}%</p>
              </>
            )}
          </div>
        )}

        {/* Action Controls */}
        <div className="flex justify-between pt-4 border-t">
          {state.history.length > 0 && (
            <button
              type="submit"
              name="intent"
              value="back"
              disabled={isPending}
              className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition"
            >
              Back
            </button>
          )}

          {currentStep !== 'REVIEW' ? (
            <button
              type="submit"
              name="intent"
              value="next"
              disabled={isPending}
              className="ml-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {isPending ? 'Validating...' : 'Next Step'}
            </button>
          ) : (
            <button
              type="submit"
              name="intent"
              value="submit"
              disabled={isPending}
              className="ml-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
            >
              {isPending ? 'Submitting...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

```

---

### Core Principles for Dynamic Step Validation

* **Explicit History Stack over Step Arithmetic:** By tracking `history: StepId[]`, going backwards pops the exact node the user just visited, regardless of whether their branch was 2 steps or 4 steps long.
* **Orphan Data Stripping:** Pruning inactive branch properties (`pruneObsoleteBranchData`) prevents leftover form values from conflicting with Zod's discriminated union at final submission.
* **Discriminated Union on Final Submit:** Validating `MasterOnboardingSchema` ensures complete type safety across all branch paths before the payload touches the database.
