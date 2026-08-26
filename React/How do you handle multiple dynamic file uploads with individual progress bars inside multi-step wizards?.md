Managing multiple dynamic file uploads within a multi-step wizard requires tracking each file's upload lifecycle independently (progress percentage, S3 presigned URL generation, error/abort states) using `XMLHttpRequest` (or fetch streams), while syncing the confirmed file metadata into your form state for subsequent steps.

---

### Step 1: Types and Upload Contracts

```typescript
// types/batch-upload-wizard.ts
import { z } from 'zod';

export const UploadedFileSchema = z.object({
  id: z.string(),
  fileKey: z.string().startsWith('uploads/temp/'),
  fileName: z.string().min(1),
  fileSize: z.number().positive(),
  mimeType: z.string(),
});

export const BatchStepSchema = z.object({
  projectName: z.string().min(2, 'Project name is required'),
  documents: z.array(UploadedFileSchema).min(1, 'At least one file must be uploaded'),
});

export type UploadedFileMeta = z.infer<typeof UploadedFileSchema>;

export type WizardState = {
  currentStep: 1 | 2;
  projectName?: string;
  documents: UploadedFileMeta[];
  error?: string | null;
  fieldErrors?: Record<string, string[]>;
  isComplete?: boolean;
};

export interface FileUploadItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  fileKey?: string;
  error?: string;
  xhr?: XMLHttpRequest;
}

```

---

### Step 2: Presigned Batch Server Actions

```typescript
// app/actions/batch-upload.ts
'use server';

import { S3Client, PutObjectCommand, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { BatchStepSchema, type WizardState } from '@/types/batch-upload-wizard';
import db from '@/lib/db';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

// 1. Generate presigned URL for a single file in the batch
export async function getPresignedBatchFileUrlAction(fileName: string, mimeType: string) {
  const safeName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const tempKey = `uploads/temp/${crypto.randomUUID()}-${safeName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: tempKey,
    ContentType: mimeType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  return { uploadUrl, fileKey: tempKey };
}

// 2. Finalize batch submission
export async function finalizeBatchWizardAction(
  prevState: WizardState,
  formData: FormData
): Promise<WizardState> {
  const intent = formData.get('intent') as 'next' | 'back' | 'submit';

  if (intent === 'back') {
    return { ...prevState, currentStep: 1, error: null };
  }

  // Parse JSON-encoded documents array from hidden input
  let parsedDocs = [];
  try {
    parsedDocs = JSON.parse((formData.get('documentsPayload') as string) || '[]');
  } catch {
    return { ...prevState, error: 'Malformed document metadata payload' };
  }

  const raw = {
    projectName: formData.get('projectName'),
    documents: parsedDocs,
  };

  const validated = BatchStepSchema.safeParse(raw);
  if (!validated.success) {
    return {
      ...prevState,
      fieldErrors: validated.error.flatten().fieldErrors,
      error: 'Please fix validation errors and ensure uploads are complete.',
    };
  }

  if (prevState.currentStep === 1) {
    return {
      currentStep: 2,
      projectName: validated.data.projectName,
      documents: validated.data.documents,
      error: null,
      fieldErrors: undefined,
    };
  }

  // Final step: Promote S3 keys & persist to DB
  if (intent === 'submit' && prevState.currentStep === 2) {
    try {
      const permanentDocs = await Promise.all(
        prevState.documents.map(async (doc) => {
          const permKey = doc.fileKey.replace('uploads/temp/', 'documents/permanent/');

          // S3 Server-side Copy
          await s3.send(
            new CopyObjectCommand({
              Bucket: BUCKET_NAME,
              CopySource: `${BUCKET_NAME}/${encodeURIComponent(doc.fileKey)}`,
              Key: permKey,
              MetadataDirective: 'COPY',
            })
          );

          // S3 Temp Object Cleanup
          await s3.send(
            new DeleteObjectCommand({
              Bucket: BUCKET_NAME,
              Key: doc.fileKey,
            })
          );

          return { ...doc, fileKey: permKey };
        })
      );

      await db.project.create({
        data: {
          name: prevState.projectName!,
          files: {
            create: permanentDocs.map((d) => ({
              s3Key: d.fileKey,
              name: d.fileName,
              size: d.fileSize,
              mimeType: d.mimeType,
            })),
          },
        },
      });

      return {
        currentStep: 1,
        documents: [],
        isComplete: true,
      };
    } catch (err: any) {
      return {
        ...prevState,
        error: err.message || 'Failed to finalize project files.',
      };
    }
  }

  return prevState;
}

```

---

### Step 3: Dynamic Batch Uploader with Per-File Progress

Using `XMLHttpRequest` gives real-time `upload.onprogress` hooks and cancellation (`xhr.abort()`):

```tsx
// app/components/BatchFileUploader.tsx
'use client';

import { useState } from 'react';
import { getPresignedBatchFileUrlAction } from '@/app/actions/batch-upload';
import type { FileUploadItem, UploadedFileMeta } from '@/types/batch-upload-wizard';

interface BatchUploaderProps {
  files: UploadedFileMeta[];
  onFilesChange: (files: UploadedFileMeta[]) => void;
  error?: string[];
}

export function BatchFileUploader({ files, onFilesChange, error }: BatchUploaderProps) {
  const [uploadQueue, setUploadQueue] = useState<FileUploadItem[]>([]);

  const handleSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;

    const newQueueItems: FileUploadItem[] = selectedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      progress: 0,
      status: 'pending',
    }));

    setUploadQueue((prev) => [...prev, ...newQueueItems]);

    // Start uploads concurrently
    newQueueItems.forEach(startUpload);
    e.target.value = ''; // Reset file input
  };

  const startUpload = async (item: FileUploadItem) => {
    try {
      // 1. Get Presigned S3 URL
      const { uploadUrl, fileKey } = await getPresignedBatchFileUrlAction(
        item.file.name,
        item.file.type || 'application/octet-stream'
      );

      const xhr = new XMLHttpRequest();

      // Track active XHR on state for cancellation
      setUploadQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: 'uploading', xhr, fileKey } : q))
      );

      // 2. Track fine-grained upload progress
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, progress: percent } : q))
          );
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Mark completed
          setUploadQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, progress: 100, status: 'completed' } : q))
          );

          // Append to confirmed form documents
          const confirmedMeta: UploadedFileMeta = {
            id: item.id,
            fileKey,
            fileName: item.file.name,
            fileSize: item.file.size,
            mimeType: item.file.type || 'application/octet-stream',
          };
          onFilesChange([...files, confirmedMeta]);
        } else {
          setUploadQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, status: 'error', error: 'Upload failed' } : q))
          );
        }
      };

      xhr.onerror = () => {
        setUploadQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, status: 'error', error: 'Network error' } : q))
        );
      };

      xhr.open('PUT', uploadUrl);
      xhr.setRequestHeader('Content-Type', item.file.type || 'application/octet-stream');
      xhr.send(item.file);
    } catch (err: any) {
      setUploadQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: 'error', error: err.message } : q))
      );
    }
  };

  const handleCancel = (item: FileUploadItem) => {
    item.xhr?.abort();
    setUploadQueue((prev) => prev.filter((q) => q.id !== item.id));
  };

  const handleRemoveConfirmed = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
    setUploadQueue((prev) => prev.filter((q) => q.id !== id));
  };

  const isAnyUploading = uploadQueue.some((q) => q.status === 'uploading');

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
          Upload Files (Multiple Allowed)
        </label>
        <input
          type="file"
          multiple
          onChange={handleSelectFiles}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
        />
      </div>

      {/* Dynamic Upload List with Individual Progress Bars */}
      {uploadQueue.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto p-1">
          {uploadQueue.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-gray-50 border rounded-lg text-xs space-y-1.5 transition"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-800 truncate max-w-[220px]">
                  {item.file.name}
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500 font-mono">
                    {(item.file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>

                  {item.status === 'uploading' && (
                    <button
                      type="button"
                      onClick={() => handleCancel(item)}
                      className="text-red-500 hover:underline font-semibold"
                    >
                      Cancel
                    </button>
                  )}

                  {item.status === 'completed' && (
                    <button
                      type="button"
                      onClick={() => handleRemoveConfirmed(item.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Progress Track */}
              {item.status === 'uploading' && (
                <div className="space-y-1">
                  <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-1.5 transition-all duration-100"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-blue-600 text-right">{item.progress}%</div>
                </div>
              )}

              {item.status === 'completed' && (
                <span className="text-emerald-700 font-medium">✓ Upload Complete</span>
              )}

              {item.status === 'error' && (
                <span className="text-red-600 font-medium">⚠ {item.error || 'Failed'}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error[0]}</p>}

      {isAnyUploading && (
        <p className="text-[11px] text-amber-600 animate-pulse font-medium">
          Uploading files in background... please wait before submitting.
        </p>
      )}
    </div>
  );
}

```

---

### Step 4: Multi-Step Wizard Integration

```tsx
// app/components/BatchWizardClient.tsx
'use client';

import { useActionState, useState } from 'react';
import { finalizeBatchWizardAction } from '@/app/actions/batch-upload';
import { BatchFileUploader } from './BatchFileUploader';
import type { WizardState, UploadedFileMeta } from '@/types/batch-upload-wizard';

const initialState: WizardState = {
  currentStep: 1,
  documents: [],
  error: null,
};

export function BatchWizardClient() {
  const [state, formAction, isPending] = useActionState(finalizeBatchWizardAction, initialState);
  const [documents, setDocuments] = useState<UploadedFileMeta[]>([]);

  if (state.isComplete) {
    return (
      <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
        <h3 className="font-bold text-emerald-900 text-lg">Batch Complete</h3>
        <p className="text-emerald-700 text-sm">All files and project details were saved successfully.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white border rounded-xl shadow-sm p-6 space-y-5">
      <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider text-gray-400 border-b pb-3">
        <span className={state.currentStep === 1 ? 'text-blue-600 font-bold' : ''}>1. Project & Files</span>
        <span className={state.currentStep === 2 ? 'text-blue-600 font-bold' : ''}>2. Review & Finalize</span>
      </div>

      {state.error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs border border-red-200 rounded">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        {/* Pass confirmed uploaded metadata via hidden input */}
        <input type="hidden" name="documentsPayload" value={JSON.stringify(documents)} />

        {state.currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1">
                Project Name
              </label>
              <input
                name="projectName"
                defaultValue={state.projectName || ''}
                placeholder="Enterprise Migration"
                className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
              {state.fieldErrors?.projectName && (
                <p className="text-xs text-red-500 mt-1">{state.fieldErrors.projectName[0]}</p>
              )}
            </div>

            <BatchFileUploader
              files={documents}
              onFilesChange={setDocuments}
              error={state.fieldErrors?.documents}
            />
          </div>
        )}

        {state.currentStep === 2 && (
          <div className="p-4 bg-gray-50 border rounded-lg text-sm space-y-3">
            <h4 className="font-semibold text-gray-900 border-b pb-1">Review Details</h4>
            <p><strong>Project:</strong> {state.projectName}</p>
            <div>
              <strong>Files to Attach ({state.documents.length}):</strong>
              <ul className="list-disc list-inside mt-1 text-xs text-gray-600 space-y-0.5">
                {state.documents.map((d) => (
                  <li key={d.id}>
                    {d.fileName} ({(d.fileSize / (1024 * 1024)).toFixed(2)} MB)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4 border-t">
          {state.currentStep > 1 && (
            <button
              type="submit"
              name="intent"
              value="back"
              disabled={isPending}
              className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Back
            </button>
          )}

          {state.currentStep < 2 ? (
            <button
              type="submit"
              name="intent"
              value="next"
              disabled={isPending || documents.length === 0}
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
              {isPending ? 'Finalizing Batch...' : 'Confirm & Submit'}
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

* **Decoupled Binary Streams via `XMLHttpRequest`:** Avoid sending binaries through Server Actions. Direct-to-S3 uploads with `xhr.upload.onprogress` give users live progress bars without taxing the server.
* **Metadata Marshalling via Hidden Input:** Serializing confirmed file descriptors as a JSON string (`documentsPayload`) ensures dynamic array lengths validate cleanly against Zod schemas.
* **Lifecycle Purge & S3 Promotion:** The server-side `CopyObjectCommand` moves files from `uploads/temp/` to permanent folders during Step 2 finalization, while an S3 Lifecycle rule automatically sweeps unfinalized temporary files after 24 hours.
