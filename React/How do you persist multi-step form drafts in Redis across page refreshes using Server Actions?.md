Persisting multi-step form drafts in Redis across page reloads uses a **session-bound draft store**.

Instead of relying solely on client memory or hidden form fields, the Server Action reads a persistent session/draft ID from an `httpOnly` cookie, saves intermediate progress to Redis with a TTL (e.g., 24 hours), and rehydrates the draft on initial Server Component render.

---

### Architecture & Data Flow

```
[Initial Page Load / Refresh]
       │
       ├── Server Component reads `draft_session_id` from cookies
       ├── Rehydrates draft from Redis: `redis.get("draft:<session_id>")`
       └── Passes initial state into `<RegistrationWizard initialData={draft} />`
              │
              ▼
[Step Progression / Save Draft]
       ├── User submits Step 1 / Step 2 via `useActionState`
       ├── Server Action validates step fields
       ├── Updates draft in Redis: `redis.set("draft:<session_id>", data, { ex: 86400 })`
       └── Returns updated state with `{ currentStep: next, data: updated }`
              │
              ▼
[Final Submit]
       ├── Server Action commits full record to primary database
       ├── Clears draft: `redis.del("draft:<session_id>")`
       └── Deletes or rotates the draft session cookie

```

---

### Step 1: Redis Draft Service Helper

Encapsulate session resolution, reading, writing, and cleanup into a dedicated helper using an `httpOnly` cookie:

```typescript
// lib/draft-storage.ts
import { cookies } from 'next/headers';
import { Redis } from '@upstash/redis';
import type { WizardFormData } from '@/types/wizard';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const DRAFT_COOKIE_NAME = 'wizard_draft_sid';
const DRAFT_TTL_SECONDS = 60 * 60 * 24; // 24 hours

export interface DraftPayload {
  currentStep: number;
  data: Partial<WizardFormData>;
  updatedAt: number;
}

// 1. Get or create a secure session ID
export async function getOrCreateDraftSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const existingSid = cookieStore.get(DRAFT_COOKIE_NAME)?.value;

  if (existingSid) return existingSid;

  const newSid = crypto.randomUUID();
  cookieStore.set(DRAFT_COOKIE_NAME, newSid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: DRAFT_TTL_SECONDS,
  });

  return newSid;
}

// 2. Fetch draft from Redis
export async function getDraft(): Promise<DraftPayload | null> {
  const cookieStore = await cookies();
  const sid = cookieStore.get(DRAFT_COOKIE_NAME)?.value;
  if (!sid) return null;

  return await redis.get<DraftPayload>(`draft:${sid}`);
}

// 3. Save draft to Redis with TTL
export async function saveDraft(
  currentStep: number,
  data: Partial<WizardFormData>
): Promise<void> {
  const sid = await getOrCreateDraftSessionId();
  const payload: DraftPayload = {
    currentStep,
    data,
    updatedAt: Date.now(),
  };

  await redis.set(`draft:${sid}`, payload, { ex: DRAFT_TTL_SECONDS });
}

// 4. Clear draft upon final submission
export async function clearDraft(): Promise<void> {
  const cookieStore = await cookies();
  const sid = cookieStore.get(DRAFT_COOKIE_NAME)?.value;

  if (sid) {
    await redis.del(`draft:${sid}`);
    cookieStore.delete(DRAFT_COOKIE_NAME);
  }
}

```

---

### Step 2: Server Action with Redis Persistence

Update the wizard action to synchronize state changes to Redis on every forward transition:

```typescript
// app/actions/wizard.ts
'use server';

import { Step1Schema, Step2Schema, MasterWizardSchema, type WizardState } from '@/types/wizard';
import { saveDraft, clearDraft } from '@/lib/draft-storage';
import db from '@/lib/db';

export async function wizardAction(
  prevState: WizardState,
  formData: FormData
): Promise<WizardState> {
  const intent = formData.get('intent') as 'next' | 'back' | 'submit';

  // 1. Backwards Navigation
  if (intent === 'back') {
    const newStep = Math.max(1, prevState.currentStep - 1);
    await saveDraft(newStep, prevState.data);

    return {
      ...prevState,
      currentStep: newStep,
      error: null,
      fieldErrors: undefined,
    };
  }

  // 2. Step 1 Validation & Redis Sync
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
        error: 'Please fix the errors in Step 1.',
      };
    }

    const mergedData = { ...prevState.data, ...parsed.data };
    await saveDraft(2, mergedData); // Save Step 2 progress to Redis

    return {
      currentStep: 2,
      data: mergedData,
      error: null,
      fieldErrors: undefined,
    };
  }

  // 3. Step 2 Validation & Redis Sync
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
        error: 'Please fix the errors in Step 2.',
      };
    }

    const mergedData = { ...prevState.data, ...parsed.data };
    await saveDraft(3, mergedData); // Save Step 3 progress to Redis

    return {
      currentStep: 3,
      data: mergedData,
      error: null,
      fieldErrors: undefined,
    };
  }

  // 4. Final Submission
  if (intent === 'submit' && prevState.currentStep === 3) {
    const fullValidation = MasterWizardSchema.safeParse(prevState.data);

    if (!fullValidation.success) {
      return {
        ...prevState,
        currentStep: 1,
        error: 'Incomplete or invalid draft. Please start over.',
      };
    }

    try {
      // Permanent DB write
      await db.user.create({ data: fullValidation.data });

      // Clean up Redis and cookie
      await clearDraft();

      return {
        currentStep: 4,
        data: {},
        isComplete: true,
      };
    } catch (err: any) {
      return {
        ...prevState,
        error: err.message || 'Failed to complete registration.',
      };
    }
  }

  return prevState;
}

```

---

### Step 3: Server Component Rehydration

The Server Component reads the existing draft during the initial SSR render pass so page reloads immediately mount the user at their last saved step:

```tsx
// app/register/page.tsx (Server Component)
import { getDraft } from '@/lib/draft-storage';
import { RegistrationWizardClient } from '@/app/components/RegistrationWizardClient';
import type { WizardState } from '@/types/wizard';

export default async function RegisterPage() {
  // Read existing progress from Redis
  const draft = await getDraft();

  const initialState: WizardState = {
    currentStep: draft?.currentStep ?? 1,
    data: draft?.data ?? {},
    error: null,
  };

  return (
    <main className="max-w-md mx-auto py-10 px-4 space-y-4">
      {draft && (
        <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-800 rounded text-xs flex justify-between items-center">
          <span>Resumed saved draft from your last session</span>
          <span className="font-mono text-gray-500">
            Step {draft.currentStep} of 3
          </span>
        </div>
      )}

      <RegistrationWizardClient initialState={initialState} />
    </main>
  );
}

```

---

### Step 4: Client Component Consumption

Pass the server-rehydrated state directly into `useActionState`:

```tsx
// app/components/RegistrationWizardClient.tsx
'use client';

import { useActionState } from 'react';
import { wizardAction } from '@/app/actions/wizard';
import type { WizardState } from '@/types/wizard';

export function RegistrationWizardClient({
  initialState,
}: {
  initialState: WizardState;
}) {
  const [state, formAction, isPending] = useActionState(wizardAction, initialState);

  if (state.isComplete) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-center space-y-2">
        <h2 className="text-xl font-bold text-emerald-800">Registration Complete!</h2>
        <p className="text-sm text-emerald-600">Your account has been created.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="border p-6 rounded-xl bg-white shadow-sm space-y-4">
      <div className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        Step {state.currentStep} of 3
      </div>

      {state.error && (
        <p className="p-2 bg-red-50 text-red-700 text-xs rounded border border-red-200">
          {state.error}
        </p>
      )}

      {/* Step 1 Fields */}
      {state.currentStep === 1 && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={state.data.email || ''}
              className="w-full border p-2 rounded text-sm mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              defaultValue={state.data.password || ''}
              className="w-full border p-2 rounded text-sm mt-1"
              required
            />
          </div>
        </div>
      )}

      {/* Step 2 Fields */}
      {state.currentStep === 2 && (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium">Full Name</label>
            <input
              name="fullName"
              type="text"
              defaultValue={state.data.fullName || ''}
              className="w-full border p-2 rounded text-sm mt-1"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              name="role"
              defaultValue={state.data.role || 'developer'}
              className="w-full border p-2 rounded text-sm mt-1 bg-white"
            >
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="manager">Manager</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 3 Fields */}
      {state.currentStep === 3 && (
        <div className="space-y-2 text-sm bg-gray-50 p-4 rounded border">
          <h3 className="font-semibold text-gray-900 border-b pb-1">Review Details</h3>
          <p><strong>Email:</strong> {state.data.email}</p>
          <p><strong>Name:</strong> {state.data.fullName}</p>
          <p><strong>Role:</strong> {state.data.role}</p>
        </div>
      )}

      {/* Action Buttons */}
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
            {isPending ? 'Saving...' : 'Save & Continue'}
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
  );
}

```

---

### Key Production Considerations

* **Encrypt Sensitive Draft Data:** If drafts contain sensitive personally identifiable information (PII) or plaintext credentials prior to final hashing, use AES-256-GCM encryption on the JSON string before saving it to Redis.
* **Sliding TTL:** Using `set(..., { ex: 86400 })` on every write refreshes the expiration window, ensuring active users don't have drafts expire mid-session while automatically pruning abandoned drafts.
* **Progressive Enhancement Compatibility:** Because session cookies and standard form POST submissions work without JavaScript, page reloads and step navigation function seamlessly across full SSR roundtrips.
