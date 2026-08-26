Handling file uploads in a multi-step wizard requires special consideration: **`File` objects and binary streams cannot be serialized back and forth across intermediate server-action roundtrips** in React's Flight protocol without massive performance penalties and loss of reference identity.

The industry-standard pattern is **Two-Phase Binary Staging**:

1. Upload the file during the upload step directly to temporary object storage (S3, Cloudflare R2, or a temporary disk bucket) and return a signed temporary ID / URL.
2. Store only the lightweight metadata string (`fileKey` or `tempUrl`) in the wizard's accumulated state across subsequent steps.
3. On final submission, the server commits the staged file permanently.

---

### Step 1: Server Action for Multi-Step Binary Processing

```typescript
// app/actions/upload-wizard.ts
'use server';

import { z } from 'zod';
import { uploadToTempStorage, commitTempFile } from '@/lib/storage';

export interface WizardFormState {
  currentStep: number;
  data: {
    // Step 1: Metadata
    projectName?: string;
    // Step 2: Staged File Reference
    fileKey?: string;
    fileName?: string;
    fileSize?: number;
    // Step 3: Confirmation / Notes
    notes?: string;
  };
  errors?: Record<string, string[]>;
  isCompleted?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export async function processWizardAction(
  prevState: WizardFormState,
  formData: FormData
): Promise<WizardFormState> {
  const intent = formData.get('intent') as 'next' | 'back' | 'submit';

  if (intent === 'back') {
    return {
      ...prevState,
      currentStep: Math.max(1, prevState.currentStep - 1),
      errors: undefined,
    };
  }

  // STEP 1: Project Metadata
  if (prevState.currentStep === 1) {
    const projectName = formData.get('projectName') as string;
    if (!projectName || projectName.trim().length < 3) {
      return {
        ...prevState,
        errors: { projectName: ['Project name must be at least 3 characters'] },
      };
    }
    return {
      currentStep: 2,
      data: { ...prevState.data, projectName },
      errors: undefined,
    };
  }

  // STEP 2: File Upload / Binary Handling
  if (prevState.currentStep === 2) {
    const file = formData.get('file') as File | null;

    // Check if user already uploaded a file and is just clicking "Next"
    if (!file || file.size === 0) {
      if (prevState.data.fileKey) {
        return { ...prevState, currentStep: 3, errors: undefined };
      }
      return {
        ...prevState,
        errors: { file: ['Please select a file to upload'] },
      };
    }

    // Binary validation
    if (file.size > MAX_FILE_SIZE) {
      return {
        ...prevState,
        errors: { file: ['File size must be under 5MB'] },
      };
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return {
        ...prevState,
        errors: { file: ['Only JPEG, PNG, or PDF files are supported'] },
      };
    }

    // Read binary buffer on the server & stage to temp storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempKey = await uploadToTempStorage({
      name: file.name,
      type: file.type,
      buffer,
    });

    return {
      currentStep: 3,
      data: {
        ...prevState.data,
        fileKey: tempKey,
        fileName: file.name,
        fileSize: file.size,
      },
      errors: undefined,
    };
  }

  // STEP 3: Final Review & Permanent Commit
  if (prevState.currentStep === 3) {
    const notes = formData.get('notes') as string;

    if (!prevState.data.fileKey) {
      return {
        ...prevState,
        currentStep: 2,
        errors: { file: ['File upload is missing or expired'] },
      };
    }

    // Move file from temporary to permanent storage bucket
    const permanentUrl = await commitTempFile(prevState.data.fileKey);

    // Save record to database
    await db.project.create({
      data: {
        name: prevState.data.projectName!,
        fileUrl: permanentUrl,
        fileName: prevState.data.fileName!,
        notes,
      },
    });

    return {
      currentStep: 4,
      data: { ...prevState.data, notes },
      isCompleted: true,
      errors: undefined,
    };
  }

  return prevState;
}

```

---

### Step 2: Client Wizard Form Component

```tsx
// app/components/FileUploadWizard.tsx
'use client';

import { useActionState } from 'react';
import { processWizardAction, type WizardFormState } from '@/app/actions/upload-wizard';

const initialState: WizardFormState = {
  currentStep: 1,
  data: {},
};

export function FileUploadWizard() {
  const [state, formAction, isPending] = useActionState(processWizardAction, initialState);

  if (state.isCompleted) {
    return (
      <div className="p-6 bg-green-50 border rounded text-center space-y-2">
        <h2 className="text-lg font-bold text-green-800">Upload Complete!</h2>
        <p className="text-sm text-green-700">
          Project <strong>{state.data.projectName}</strong> created with file{' '}
          <strong>{state.data.fileName}</strong>.
        </p>
      </div>
    );
  }

  return (
    // enctype="multipart/form-data" is required for binary file inputs
    <form
      action={formAction}
      encType="multipart/form-data"
      className="max-w-md mx-auto p-6 border rounded shadow-sm space-y-4"
    >
      {/* Progress Bar */}
      <div className="text-xs font-semibold text-gray-500 flex justify-between mb-4">
        <span className={state.currentStep >= 1 ? 'text-blue-600' : ''}>1. Info</span>
        <span className={state.currentStep >= 2 ? 'text-blue-600' : ''}>2. Upload</span>
        <span className={state.currentStep >= 3 ? 'text-blue-600' : ''}>3. Review</span>
      </div>

      {/* STEP 1: Project Information */}
      {state.currentStep === 1 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Project Name</label>
          <input
            name="projectName"
            defaultValue={state.data.projectName || ''}
            className="w-full border p-2 rounded"
          />
          {state.errors?.projectName && (
            <p className="text-xs text-red-500">{state.errors.projectName[0]}</p>
          )}
        </div>
      )}

      {/* STEP 2: File Upload */}
      {state.currentStep === 2 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium">Upload Document / Image</label>
          
          {state.data.fileName && (
            <div className="p-2 bg-gray-50 border rounded text-xs flex justify-between items-center">
              <span>Attached: <strong>{state.data.fileName}</strong></span>
              <span className="text-gray-400">({Math.round((state.data.fileSize || 0) / 1024)} KB)</span>
            </div>
          )}

          <input
            type="file"
            name="file"
            accept=".jpg,.jpeg,.png,.pdf"
            className="w-full border p-2 rounded text-sm"
          />
          {state.errors?.file && (
            <p className="text-xs text-red-500">{state.errors.file[0]}</p>
          )}
        </div>
      )}

      {/* STEP 3: Review & Final Notes */}
      {state.currentStep === 3 && (
        <div className="space-y-3">
          <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
            <p><strong>Project:</strong> {state.data.projectName}</p>
            <p><strong>File:</strong> {state.data.fileName}</p>
          </div>

          <div>
            <label className="block text-sm font-medium">Additional Notes</label>
            <textarea
              name="notes"
              defaultValue={state.data.notes || ''}
              className="w-full border p-2 rounded text-sm"
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-between pt-4 border-t">
        {state.currentStep > 1 && (
          <button
            type="submit"
            name="intent"
            value="back"
            disabled={isPending}
            className="px-4 py-2 bg-gray-100 rounded text-sm"
          >
            Back
          </button>
        )}

        <button
          type="submit"
          name="intent"
          value={state.currentStep === 3 ? 'submit' : 'next'}
          disabled={isPending}
          className="ml-auto px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending
            ? 'Processing...'
            : state.currentStep === 3
            ? 'Complete Project'
            : 'Next Step'}
        </button>
      </div>
    </form>
  );
}

```

---

### Core Best Practices for Binary Data in Actions

* **Always Specify `encType="multipart/form-data"`:** Without this attribute on `<form>`, the browser serializes `FormData` as urlencoded text, stripping the binary payload.
* **Stage, Don't Re-stream:** Never attempt to pass raw `File` or `ArrayBuffer` instances down into component props or storage states across steps. Server Actions should upload immediately and pass back a reference key (`fileKey`).
* **Handle S3 Direct Upload Alternative for Huge Files (>10MB):** For large binaries, avoid routing bytes through your server action compute instance. Instead, have the Server Action generate a pre-signed S3/GCS PUT URL, upload directly from client JavaScript, and pass the resulting URL into the wizard state.
