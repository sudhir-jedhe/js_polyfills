When handling multi-step wizards that contain both standard metadata (strings, numbers, choices) and file attachments, submitting binary file data on every intermediate step causes severe memory bloat, high network overhead, and potential payload size limits in Server Actions (e.g., Next.js's default 1MB/4MB Server Action body limit).

The standard architectural pattern decouples **binary file transfer** from **step progression**:

1. **Metadata Steps (Steps 1 & 3):** Handled via standard progressive enhancement `useActionState` Server Actions.
2. **File Upload Step (Step 2):** The client requests a presigned S3/R2 URL or uploads the file to an isolated staging route, saving only the returned **storage key and file metadata** (`fileKey`, `fileName`, `fileSize`, `mimeType`) into the wizard state.
3. **Finalization Step:** The Server Action associates the stored metadata with the verified file key and commits the database record.

---

### Architecture & Data Flow

```
[Step 1: Application Metadata]
       │
       ▼ (Server Action via useActionState)
Validates metadata ──▶ Advances to Step 2

[Step 2: File Attachment Step]
       │
       ├── 1. Client calls `getPresignedUrlAction({ fileName, mimeType })`
       │      └── Server returns short-lived S3/R2 PUT URL + `tempKey`
       │
       ├── 2. Browser streams binary directly to cloud storage (0MB server RAM)
       │
       └── 3. Wizard form updates hidden inputs with `{ fileKey: tempKey, fileName, fileSize }`
              └── Server Action validates metadata presence ──▶ Advances to Step 3

[Step 3: Review & Finalize]
       │
       ▼ (Server Action via useActionState)
Server Action promotes file from temp to permanent storage and creates DB record

```

---

### Step 1: Types and Step Schemas

```typescript
// types/multipart-wizard.ts
import { z } from 'zod';

export const Step1Schema = z.object({
  applicantName: z.string().min(2, 'Name is required'),
  department: z.enum(['ENGINEERING', 'DESIGN', 'MARKETING']),
});

export const Step2FileMetaSchema = z.object({
  fileKey: z.string().startsWith('uploads/temp/', 'Valid file attachment is required'),
  fileName: z.string().min(1, 'File name missing'),
  fileSize: z.coerce.number().positive('File size must be greater than 0'),
  mimeType: z.string().min(1, 'MIME type missing'),
});

export type WizardData = {
  applicantName?: string;
  department?: 'ENGINEERING' | 'DESIGN' | 'MARKETING';
  fileKey?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
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

### Step 2: Storage Helper & Server Actions

```typescript
// app/actions/multipart-wizard.ts
'use server';

import { S3Client, PutObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Step1Schema, Step2FileMetaSchema, type WizardState } from '@/types/multipart-wizard';
import db from '@/lib/db';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

// 1. Presigned Upload URL Generator
export async function getPresignedUploadUrlAction(fileName: string, mimeType: string) {
  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const tempKey = `uploads/temp/${crypto.randomUUID()}-${safeName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: tempKey,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 minutes
  return { uploadUrl, fileKey: tempKey };
}

// 2. Master Wizard Navigation Action
export async function multipartWizardAction(
  prevState: WizardState,
  formData: FormData
): Promise<WizardState> {
  const intent = formData.get('intent') as 'next' | 'back' | 'submit';

  // Backward navigation
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
      applicantName: formData.get('applicantName'),
      department: formData.get('department'),
    });

    if (!parsed.success) {
      return {
        ...prevState,
        fieldErrors: parsed.error.flatten().fieldErrors,
        error: 'Please resolve form errors in Step 1.',
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
    const parsed = Step2FileMetaSchema.safeParse({
      fileKey: formData.get('fileKey'),
      fileName: formData.get('fileName'),
      fileSize: formData.get('fileSize'),
      mimeType: formData.get('mimeType'),
    });

    if (!parsed.success) {
      return {
        ...prevState,
        fieldErrors: parsed.error.flatten().fieldErrors,
        error: 'Please upload a valid document before proceeding.',
      };
    }

    return {
      currentStep: 3,
      data: { ...prevState.data, ...parsed.data },
      error: null,
      fieldErrors: undefined,
    };
  }

  // Step 3: Promote S3 Object and Commit Database Record
  if (intent === 'submit' && prevState.currentStep === 3) {
    try {
      const { applicantName, department, fileKey, fileName, fileSize, mimeType } = prevState.data;

      if (!fileKey || !applicantName) {
        throw new Error('Incomplete wizard submission.');
      }

      // Promote file from temporary staging to permanent directory
      const permanentKey = fileKey.replace('uploads/temp/', 'documents/permanent/');

      await s3.send(
        new CopyObjectCommand({
          Bucket: BUCKET_NAME,
          CopySource: `${BUCKET_NAME}/${encodeURIComponent(fileKey)}`,
          Key: permanentKey,
          MetadataDirective: 'COPY',
        })
      );

      await s3.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: fileKey,
        })
      );

      // Persist record
      await db.application.create({
        data: {
          applicantName,
          department: department!,
          fileUrl: permanentKey,
          fileName: fileName!,
          fileSize: fileSize!,
          mimeType: mimeType!,
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
        error: err.message || 'Failed to finalize submission.',
      };
    }
  }

  return prevState;
}

```

---

### Step 3: Direct Upload Input Component

```tsx
// app/components/S3DirectUploadField.tsx
'use client';

import { useState } from 'react';
import { getPresignedUploadUrlAction } from '@/app/actions/multipart-wizard';

interface S3UploadProps {
  initialKey?: string;
  initialName?: string;
  initialSize?: number;
  initialMime?: string;
  error?: string[];
}

export function S3DirectUploadField({
  initialKey,
  initialName,
  initialSize,
  initialMime,
  error,
}: S3UploadProps) {
  const [fileKey, setFileKey] = useState(initialKey || '');
  const [fileName, setFileName] = useState(initialName || '');
  const [fileSize, setFileSize] = useState(initialSize || 0);
  const [mimeType, setMimeType] = useState(initialMime || '');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File size exceeds the 25MB limit.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // 1. Fetch Presigned URL
      const { uploadUrl, fileKey: key } = await getPresignedUploadUrlAction(file.name, file.type);

      // 2. Direct upload to S3
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });

      if (!uploadRes.ok) throw new Error('Upload failed');

      setFileKey(key);
      setFileName(file.name);
      setFileSize(file.size);
      setMimeType(file.type);
    } catch (err: any) {
      setUploadError('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700">
        Supporting Document (PDF, PNG, JPG up to 25MB)
      </label>

      <input
        type="file"
        disabled={isUploading}
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
      />

      {isUploading && (
        <div className="text-xs text-blue-600 animate-pulse font-medium">
          Uploading directly to cloud storage...
        </div>
      )}

      {fileName && !isUploading && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex justify-between items-center">
          <span>Attached: <strong>{fileName}</strong></span>
          <span>{(fileSize / (1024 * 1024)).toFixed(2)} MB</span>
        </div>
      )}

      {(uploadError || error) && (
        <p className="text-xs text-red-500">{uploadError || error?.[0]}</p>
      )}

      {/* Hidden inputs submitted with the form action */}
      <input type="hidden" name="fileKey" value={fileKey} />
      <input type="hidden" name="fileName" value={fileName} />
      <input type="hidden" name="fileSize" value={fileSize} />
      <input type="hidden" name="mimeType" value={mimeType} />
    </div>
  );
}

```

---

### Step 4: Multi-Step Client Wizard (`useActionState`)

```tsx
// app/components/MultipartWizard.tsx
'use client';

import { useActionState } from 'react';
import { multipartWizardAction } from '@/app/actions/multipart-wizard';
import { S3DirectUploadField } from './S3DirectUploadField';
import type { WizardState } from '@/types/multipart-wizard';

const initialState: WizardState = {
  currentStep: 1,
  data: {},
};

export function MultipartWizard() {
  const [state, formAction, isPending] = useActionState(multipartWizardAction, initialState);

  if (state.isComplete) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2 text-emerald-900">
        <h3 className="font-bold text-lg">Application Submitted</h3>
        <p className="text-sm">Your metadata and attached documents were successfully recorded.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white border rounded-xl shadow-sm p-6 space-y-5">
      {/* Step Indicators */}
      <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-gray-400 border-b pb-3">
        <span className={state.currentStep === 1 ? 'text-blue-600 font-bold' : ''}>1. Details</span>
        <span className={state.currentStep === 2 ? 'text-blue-600 font-bold' : ''}>2. Upload</span>
        <span className={state.currentStep === 3 ? 'text-blue-600 font-bold' : ''}>3. Review</span>
      </div>

      {state.error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs border border-red-200 rounded">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* STEP 1: Metadata */}
        {state.currentStep === 1 && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                Applicant Name
              </label>
              <input
                name="applicantName"
                defaultValue={state.data.applicantName || ''}
                placeholder="Jane Doe"
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              {state.fieldErrors?.applicantName && (
                <p className="text-xs text-red-500 mt-1">{state.fieldErrors.applicantName[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-gray-700 mb-1">
                Department
              </label>
              <select
                name="department"
                defaultValue={state.data.department || 'ENGINEERING'}
                className="w-full border rounded-lg p-2 text-sm bg-white"
              >
                <option value="ENGINEERING">Engineering</option>
                <option value="DESIGN">Design</option>
                <option value="MARKETING">Marketing</option>
              </select>
            </div>
          </div>
        )}

        {/* STEP 2: File Upload */}
        {state.currentStep === 2 && (
          <S3DirectUploadField
            initialKey={state.data.fileKey}
            initialName={state.data.fileName}
            initialSize={state.data.fileSize}
            initialMime={state.data.mimeType}
            error={state.fieldErrors?.fileKey}
          />
        )}

        {/* STEP 3: Review */}
        {state.currentStep === 3 && (
          <div className="p-4 bg-gray-50 border rounded-lg text-sm space-y-2">
            <h4 className="font-semibold text-gray-900 border-b pb-1">Submission Summary</h4>
            <p><strong>Applicant:</strong> {state.data.applicantName}</p>
            <p><strong>Department:</strong> {state.data.department}</p>
            <p><strong>Attached File:</strong> {state.data.fileName} ({(Number(state.data.fileSize) / (1024 * 1024)).toFixed(2)} MB)</p>
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
              className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50 transition"
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
              {isPending ? 'Finalizing...' : 'Submit Application'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

```

---

### Core Resilience Patterns

* **Zero Binary Forwarding:** S3 keys (`uploads/temp/...`) flow through form transitions as lightweight strings rather than raw byte buffers, eliminating Server Action body size limit crashes.
* **Orphan Cleanup via S3 Lifecycle:** Configure an S3 Bucket Lifecycle Rule on prefix `uploads/temp/` with a 24-hour expiration. Abandoned wizard sessions are purged by AWS without requiring custom cron jobs.
* **Strict Bucket Separation:** Validate that incoming `fileKey` fields strictly begin with `uploads/temp/` inside the final Server Action before copying to prevent directory traversal or unauthorized file overwrites.
