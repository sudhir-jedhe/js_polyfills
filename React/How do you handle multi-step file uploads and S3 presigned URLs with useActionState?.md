Streaming large binary files directly through Server Actions or Next.js server runtimes causes memory spikes, network timeouts, and function execution limits.

The standard production pattern decouples **direct client-to-S3 storage uploads via presigned URLs** from **metadata and step progression handled by `useActionState**`.

---

### Architecture & Data Flow

```
[Step 1: Details & Metadata]
       │
       ▼ (useActionState)
Server Action validates metadata ──▶ Advances to Step 2

[Step 2: Direct S3 File Upload]
       │
       ├── 1. Client calls dedicated Server Action: `getPresignedUploadUrlAction(fileInfo)`
       │      └── Server validates file constraints and returns a short-lived S3 PUT URL
       │
       ├── 2. Browser uploads binary directly to S3 via `fetch(presignedUrl, { method: 'PUT', body: file })`
       │      └── Progress bar updates in real time; 0MB load on the Next.js server
       │
       └── 3. On upload complete, user submits form via `useActionState`
              └── Server Action links the S3 file key into the wizard state ──▶ Advances to Step 3 (Review)

[Step 3: Review & Finalize]
       │
       ▼ (useActionState)
Server Action commits DB transaction (associates metadata + permanent S3 key)

```

---

### Step 1: Types and Step Schemas

```typescript
// types/upload-wizard.ts
import { z } from 'zod';

export const Step1Schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  category: z.enum(['documents', 'images', 'reports']),
});

export const Step2Schema = z.object({
  fileKey: z.string().min(1, 'File upload is required'),
  fileName: z.string().min(1),
  fileSize: z.coerce.number().max(50 * 1024 * 1024, 'Max size 50MB'),
});

export type WizardData = {
  title?: string;
  category?: 'documents' | 'images' | 'reports';
  fileKey?: string;
  fileName?: string;
  fileSize?: number;
};

export type WizardState = {
  currentStep: 1 | 2 | 3;
  data: WizardData;
  error?: string | null;
  fieldErrors?: Record<string, string[]>;
  isComplete?: boolean;
};

```

---

### Step 2: Presigned URL Generation & Master Server Actions

Keep presigned URL generation as a targeted helper action, while the master wizard action coordinates step validation:

```typescript
// app/actions/upload-wizard.ts
'use server';

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Step1Schema, Step2Schema, type WizardState } from '@/types/upload-wizard';
import db from '@/lib/db';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// 1. Standalone Action: Generates presigned S3 PUT URL
export async function getPresignedUploadUrlAction(fileName: string, fileType: string) {
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const fileKey = `uploads/temp/${crypto.randomUUID()}-${cleanFileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: fileKey,
    ContentType: fileType,
  });

  // Short-lived 5-minute URL
  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  return { uploadUrl, fileKey };
}

// 2. Master Wizard Action for useActionState
export async function uploadWizardAction(
  prevState: WizardState,
  formData: FormData
): Promise<WizardState> {
  const intent = formData.get('intent') as 'next' | 'back' | 'submit';

  if (intent === 'back') {
    return {
      ...prevState,
      currentStep: Math.max(1, prevState.currentStep - 1) as 1 | 2 | 3,
      error: null,
      fieldErrors: undefined,
    };
  }

  // Step 1: Validate Basic Details
  if (prevState.currentStep === 1) {
    const parsed = Step1Schema.safeParse({
      title: formData.get('title'),
      category: formData.get('category'),
    });

    if (!parsed.success) {
      return {
        ...prevState,
        fieldErrors: parsed.error.flatten().fieldErrors,
        error: 'Please fix validation errors.',
      };
    }

    return {
      currentStep: 2,
      data: { ...prevState.data, ...parsed.data },
      error: null,
      fieldErrors: undefined,
    };
  }

  // Step 2: Validate File Metadata
  if (prevState.currentStep === 2) {
    const parsed = Step2Schema.safeParse({
      fileKey: formData.get('fileKey'),
      fileName: formData.get('fileName'),
      fileSize: formData.get('fileSize'),
    });

    if (!parsed.success) {
      return {
        ...prevState,
        fieldErrors: parsed.error.flatten().fieldErrors,
        error: 'Please complete the file upload before proceeding.',
      };
    }

    return {
      currentStep: 3,
      data: { ...prevState.data, ...parsed.data },
      error: null,
      fieldErrors: undefined,
    };
  }

  // Step 3: Final Commit
  if (intent === 'submit' && prevState.currentStep === 3) {
    try {
      await db.uploadRecord.create({
        data: {
          title: prevState.data.title!,
          category: prevState.data.category!,
          s3Key: prevState.data.fileKey!,
          fileName: prevState.data.fileName!,
          fileSize: prevState.data.fileSize!,
        },
      });

      return {
        currentStep: 1,
        data: {},
        isComplete: true,
      };
    } catch (err: any) {
      return {
        ...prevState,
        error: err.message || 'Failed to save final submission.',
      };
    }
  }

  return prevState;
}

```

---

### Step 3: Client File Uploader with Direct S3 Upload

Create a dedicated client component for Step 2 that obtains the presigned URL, performs the direct `fetch` PUT request with upload progress, and populates hidden fields for the parent form action:

```tsx
// app/components/S3DirectUploadField.tsx
'use client';

import { useState } from 'react';
import { getPresignedUploadUrlAction } from '@/app/actions/upload-wizard';

interface S3DirectUploadFieldProps {
  initialKey?: string;
  initialName?: string;
  initialSize?: number;
  error?: string[];
}

export function S3DirectUploadField({
  initialKey,
  initialName,
  initialSize,
  error,
}: S3DirectUploadFieldProps) {
  const [fileKey, setFileKey] = useState(initialKey || '');
  const [fileName, setFileName] = useState(initialName || '');
  const [fileSize, setFileSize] = useState<number>(initialSize || 0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      setUploadError('File exceeds maximum size of 50MB.');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      // 1. Request presigned URL from server
      const { uploadUrl, fileKey: key } = await getPresignedUploadUrlAction(file.name, file.type);

      // 2. Direct binary upload to S3
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error('S3 upload failed');

      // 3. Update hidden input state
      setFileKey(key);
      setFileName(file.name);
      setFileSize(file.size);
    } catch (err: any) {
      setUploadError('Failed to upload file to storage. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Attachment (Max 50MB)</label>
      
      <input
        type="file"
        onChange={handleFileChange}
        disabled={uploading}
        className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />

      {uploading && (
        <div className="text-xs text-blue-600 flex items-center gap-2 animate-pulse">
          <span>Uploading directly to storage...</span>
        </div>
      )}

      {fileName && !uploading && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex justify-between items-center">
          <span>Uploaded: <strong>{fileName}</strong></span>
          <span>{(fileSize / (1024 * 1024)).toFixed(2)} MB</span>
        </div>
      )}

      {(uploadError || error) && (
        <p className="text-xs text-red-500">{uploadError || error?.[0]}</p>
      )}

      {/* Hidden inputs submitted with the form */}
      <input type="hidden" name="fileKey" value={fileKey} />
      <input type="hidden" name="fileName" value={fileName} />
      <input type="hidden" name="fileSize" value={fileSize} />
    </div>
  );
}

```

---

### Step 4: Multi-Step Wizard Container (`useActionState`)

Assemble the wizard, rendering the file upload field in Step 2:

```tsx
// app/components/UploadWizard.tsx
'use client';

import { useActionState } from 'react';
import { uploadWizardAction } from '@/app/actions/upload-wizard';
import { S3DirectUploadField } from './S3DirectUploadField';
import type { WizardState } from '@/types/upload-wizard';

const initialState: WizardState = {
  currentStep: 1,
  data: {},
};

export function UploadWizard() {
  const [state, formAction, isPending] = useActionState(uploadWizardAction, initialState);

  if (state.isComplete) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
        <h3 className="font-bold">Submission Received!</h3>
        <p className="text-sm mt-1">Your metadata and S3 upload were successfully processed.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-xl shadow-sm space-y-4">
      {/* Progress */}
      <div className="flex justify-between text-xs font-semibold uppercase text-gray-400 border-b pb-2">
        <span className={state.currentStep >= 1 ? 'text-blue-600' : ''}>1. Metadata</span>
        <span className={state.currentStep >= 2 ? 'text-blue-600' : ''}>2. Upload</span>
        <span className={state.currentStep >= 3 ? 'text-blue-600' : ''}>3. Review</span>
      </div>

      {state.error && (
        <div className="p-2.5 bg-red-50 text-red-700 text-xs border border-red-200 rounded">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* STEP 1: Metadata */}
        {state.currentStep === 1 && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium">Document Title</label>
              <input
                name="title"
                defaultValue={state.data.title || ''}
                className="w-full border p-2 rounded text-sm mt-1"
                required
              />
              {state.fieldErrors?.title && (
                <p className="text-red-500 text-xs mt-1">{state.fieldErrors.title[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium">Category</label>
              <select
                name="category"
                defaultValue={state.data.category || 'documents'}
                className="w-full border p-2 rounded text-sm mt-1 bg-white"
              >
                <option value="documents">Documents</option>
                <option value="images">Images</option>
                <option value="reports">Reports</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: S3 Direct Upload */}
        {state.currentStep === 2 && (
          <S3DirectUploadField
            initialKey={state.data.fileKey}
            initialName={state.data.fileName}
            initialSize={state.data.fileSize}
            error={state.fieldErrors?.fileKey}
          />
        )}

        {/* STEP 3: Review */}
        {state.currentStep === 3 && (
          <div className="p-3.5 bg-gray-50 border rounded text-sm space-y-1.5">
            <h4 className="font-semibold text-gray-900 border-b pb-1">Review & Confirm</h4>
            <p><strong>Title:</strong> {state.data.title}</p>
            <p><strong>Category:</strong> {state.data.category}</p>
            <p><strong>File:</strong> {state.data.fileName} ({(Number(state.data.fileSize) / (1024 * 1024)).toFixed(2)} MB)</p>
          </div>
        )}

        {/* Actions */}
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
              {isPending ? 'Saving...' : 'Finalize Upload'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

```

---

### Key Production Considerations

* **S3 Lifecycle Rules for Temporary Uploads:** Save files initially under `uploads/temp/*`. Configure an S3 Bucket Lifecycle Policy to auto-delete objects in `uploads/temp/` after 24 hours. During Step 3 finalization, move the file to `uploads/permanent/*` so abandoned multi-step uploads are cleaned up without manual cron jobs.
* **CORS Configuration on S3:** Configure the S3 Bucket CORS configuration to accept `PUT` methods from your domain and expose standard headers (`ETag`, `Content-Type`).
* **Content-Type Locking:** Sign the presigned URL with the exact `ContentType` header. If the browser attempts to change the MIME type during the `fetch(uploadUrl, ...)` call, S3 rejects the upload with a `403 Forbidden` signature mismatch.
