***  How do you handle multi-step form wizards with file uploads and binary FormData in React 19 Server Actions?.md ***

Handling file uploads across a multi-step wizard presents a unique challenge: **native `<input type="file" />` elements cannot retain their value across step re-renders or navigation for browser security reasons**, and raw `File` / `Blob` instances cannot be retained in persistent serializable state across server boundaries.

The idiomatic solution in React 19 is **Staged / Eager Uploads**:

1. When the user selects and submits a file during a step, the Server Action immediately uploads the binary data to temporary storage (S3 bucket, Vercel Blob, Cloudinary, or a temp database table).
2. The Server Action returns a persistent reference (e.g., `tempFileId`, URL, or metadata token) in the action state.
3. Subsequent steps pass along the persistent token (via hidden fields or state), avoiding repeated multi-megabyte binary transfers on later steps.
4. On the final step, the Server Action commits the temporary file record to permanent storage.

---

### Step 1: Define the Wizard Action & File Staging

The Server Action handles both standard text inputs and binary `File` objects extracted via `formData.get('fileField')`.

```typescript
// app/actions/onboardingWizardAction.ts
'use server';

export interface WizardState {
  currentStep: number;
  data: {
    companyName?: string;
    website?: string;
    // Store uploaded file references, NOT raw File objects
    documentUrl?: string;
    documentName?: string;
    documentSize?: number;
    billingTier?: string;
  };
  errors?: Record<string, string>;
  isComplete?: boolean;
}

export async function onboardingWizardAction(
  prevState: WizardState,
  formData: FormData
): Promise<WizardState> {
  const step = Number(formData.get('step') ?? prevState.currentStep);
  const direction = formData.get('direction') as 'next' | 'prev';

  // Navigation: Backwards
  if (direction === 'prev') {
    return {
      ...prevState,
      currentStep: Math.max(1, step - 1),
      errors: {},
    };
  }

  // STEP 1: Text Fields
  if (step === 1) {
    const companyName = (formData.get('companyName') as string)?.trim();
    const website = (formData.get('website') as string)?.trim();

    if (!companyName) {
      return {
        ...prevState,
        errors: { companyName: 'Company name is required' },
      };
    }

    return {
      currentStep: 2,
      data: { ...prevState.data, companyName, website },
      errors: {},
    };
  }

  // STEP 2: File Upload (Binary Processing)
  if (step === 2) {
    const file = formData.get('verificationDoc') as File | null;
    const existingDocUrl = formData.get('existingDocUrl') as string | null;

    // If a file was already uploaded previously and user didn't pick a new one
    if ((!file || file.size === 0) && existingDocUrl) {
      return {
        currentStep: 3,
        data: prevState.data,
        errors: {},
      };
    }

    // Validate new file
    if (!file || file.size === 0) {
      return {
        ...prevState,
        errors: { verificationDoc: 'Please select a verification document' },
      };
    }

    // Validate size (< 5MB) and type
    if (file.size > 5 * 1024 * 1024) {
      return {
        ...prevState,
        errors: { verificationDoc: 'File size must be under 5MB' },
      };
    }

    // Process & Stage Upload
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadedAsset = await stageFileInStorage({
      name: file.name,
      type: file.type,
      buffer,
    });

    return {
      currentStep: 3,
      data: {
        ...prevState.data,
        documentUrl: uploadedAsset.url,
        documentName: file.name,
        documentSize: file.size,
      },
      errors: {},
    };
  }

  // STEP 3: Final Commit
  if (step === 3) {
    const billingTier = formData.get('billingTier') as string;

    const finalPayload = {
      ...prevState.data,
      billingTier,
    };

    // Promote staged file to permanent record and save user
    await commitRegistrationToDb(finalPayload);

    return {
      currentStep: 4,
      data: finalPayload,
      errors: {},
      isComplete: true,
    };
  }

  return prevState;
}

// Simulated Cloud/DB Storage handler
async function stageFileInStorage({ name, buffer }: { name: string; type: string; buffer: Buffer }) {
  // e.g. PutObjectCommand in AWS S3 or bucket.upload()
  const tempUrl = `https://storage.example.com/temp/${Date.now()}-${name}`;
  return { url: tempUrl };
}

async function commitRegistrationToDb(payload: any) {
  // Persist record to DB
}

```

---

### Step 2: The Multi-Step Component with File State

When rendering Step 2, if a file was previously uploaded, display a preview card with the file name and pass the `documentUrl` via a hidden input so re-navigating doesn't force re-uploading.

```tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { onboardingWizardAction, WizardState } from './actions/onboardingWizardAction';

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
      disabled={pending}
      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
    >
      {pending ? 'Uploading & Processing...' : label}
    </button>
  );
}

export function OnboardingWizard() {
  const [state, formAction] = useActionState(onboardingWizardAction, initialState);

  if (state.isComplete) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-green-600">Verification Submitted!</h2>
        <p>Document: {state.data.documentName}</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-6 border rounded-lg shadow-sm">
      <div className="mb-4 text-sm font-semibold text-gray-500">
        Step {state.currentStep} of 3
      </div>

      {/* Note: React handles multipart/form-data encoding automatically */}
      <form action={formAction} className="space-y-4">
        <input type="hidden" name="step" value={state.currentStep} />

        {/* STEP 1: Text Info */}
        {state.currentStep === 1 && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Company Name</label>
              <input
                name="companyName"
                defaultValue={state.data.companyName ?? ''}
                className="w-full border p-2 rounded"
              />
              {state.errors?.companyName && (
                <p className="text-sm text-red-500">{state.errors.companyName}</p>
              )}
            </div>

            <div className="flex justify-end">
              <SubmitButton label="Continue to Upload →" />
            </div>
          </div>
        )}

        {/* STEP 2: Binary File Upload */}
        {state.currentStep === 2 && (
          <div className="space-y-3">
            <label className="block text-sm font-medium">Proof of Incorporation (PDF/Image)</label>

            {/* Display already uploaded file details if navigating back */}
            {state.data.documentUrl && (
              <div className="p-3 bg-gray-50 border rounded flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-green-600">✓ Uploaded: </span>
                  {state.data.documentName}
                </div>
                <input type="hidden" name="existingDocUrl" value={state.data.documentUrl} />
              </div>
            )}

            <input
              type="file"
              name="verificationDoc"
              accept=".pdf,.png,.jpg"
              className="w-full border p-2 rounded"
            />
            {state.errors?.verificationDoc && (
              <p className="text-sm text-red-500">{state.errors.verificationDoc}</p>
            )}

            <div className="flex justify-between pt-4">
              <button
                type="submit"
                name="direction"
                value="prev"
                className="px-4 py-2 border rounded"
              >
                ← Back
              </button>
              <SubmitButton label={state.data.documentUrl ? 'Keep & Continue →' : 'Upload & Continue →'} />
            </div>
          </div>
        )}

        {/* STEP 3: Final Review & Tier Selection */}
        {state.currentStep === 3 && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Select Plan</label>
              <select
                name="billingTier"
                defaultValue={state.data.billingTier ?? 'starter'}
                className="w-full border p-2 rounded"
              >
                <option value="starter">Starter</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>

            <div className="p-3 bg-gray-50 rounded text-sm space-y-1">
              <p><strong>Company:</strong> {state.data.companyName}</p>
              <p><strong>Attached Doc:</strong> {state.data.documentName}</p>
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
              <SubmitButton label="Submit Verification" />
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

```

---

### Key Architectural Guidelines

* **Automatic `enctype` Negotiation:** When passing a native `File` via a `<form action={serverAction}>`, React automatically configures the submission headers as `multipart/form-data` under the hood.
* **Server Action Body Size Limits:** Frameworks enforce body size limits on Server Actions (e.g., Next.js defaults to 1MB or configured via `serverActions.bodySizeLimit` in `next.config.js`). For uploads larger than 10MB, bypass the Server Action for the raw binary and use a direct-to-S3 signed URL upload, then pass only the resulting URL into the Server Action.
* **Orphan Cleanup:** Staged files that are uploaded in Step 2 but abandoned before Step 3 should have an automatic TTL/lifecycle expiration rule on your bucket (e.g., auto-delete objects in the `/temp/` prefix after 24 hours).
