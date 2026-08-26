Moving an object from a temporary staging directory (e.g., `uploads/temp/*`) to a permanent destination (e.g., `documents/permanent/*`) in Amazon S3 is handled via the **`CopyObjectCommand`**, followed by a **`DeleteObjectCommand`**.

Because S3 performs copies entirely within the AWS infrastructure without downloading the file bytes to your application server, the operation executes with low latency and zero memory overhead on your Server Action runtime.

---

### Step 1: Implement the S3 Promotion Helper

Create a helper function using the `@aws-sdk/client-s3` package that copies the object to its final path and removes the temporary artifact:

```typescript
// lib/s3-storage.ts
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

export interface PromoteObjectResult {
  permanentKey: string;
  sourceKey: string;
}

/**
 * Copies an S3 object from temporary staging to a permanent path and deletes the temp source.
 */
export async function promoteS3Object(tempKey: string, entityId: string): Promise<PromoteObjectResult> {
  // Validate that the key originates from the temp directory to prevent arbitrary copying
  if (!tempKey.startsWith('uploads/temp/')) {
    throw new Error('Invalid temporary S3 key path');
  }

  // Extract raw filename
  const fileName = tempKey.split('/').pop() || 'file';
  const permanentKey = `documents/permanent/${entityId}/${fileName}`;

  // 1. Copy object inside S3 (Server-side copy within AWS)
  await s3.send(
    new CopyObjectCommand({
      Bucket: BUCKET_NAME,
      CopySource: `${BUCKET_NAME}/${encodeURIComponent(tempKey)}`,
      Key: permanentKey,
      MetadataDirective: 'COPY',
    })
  );

  // 2. Remove the temporary staging object
  await s3.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: tempKey,
    })
  );

  return { permanentKey, sourceKey: tempKey };
}

```

---

### Step 2: Integrate into the Finalizing Server Action

Call the promotion helper inside a database transaction during the final submission step:

```typescript
// app/actions/finalize-upload.ts
'use server';

import { z } from 'zod';
import { promoteS3Object } from '@/lib/s3-storage';
import db from '@/lib/db';

const FinalizeSchema = z.object({
  title: z.string().min(3),
  tempKey: z.string().startsWith('uploads/temp/'),
  fileName: z.string().min(1),
  fileSize: z.coerce.number().positive(),
});

export type FinalizeState = {
  status: 'idle' | 'success' | 'error';
  error?: string | null;
  documentId?: string;
};

export async function finalizeDocumentSubmissionAction(
  prevState: FinalizeState,
  formData: FormData
): Promise<FinalizeState> {
  const parsed = FinalizeSchema.safeParse({
    title: formData.get('title'),
    tempKey: formData.get('tempKey'),
    fileName: formData.get('fileName'),
    fileSize: formData.get('fileSize'),
  });

  if (!parsed.success) {
    return {
      status: 'error',
      error: 'Invalid submission data or missing temporary file.',
    };
  }

  const { title, tempKey, fileName, fileSize } = parsed.data;

  try {
    const documentId = crypto.randomUUID();

    // 1. Promote S3 file from staging to permanent storage
    const { permanentKey } = await promoteS3Object(tempKey, documentId);

    // 2. Persist record with permanent S3 key in Database
    await db.document.create({
      data: {
        id: documentId,
        title,
        s3Key: permanentKey,
        fileName,
        fileSize,
        createdAt: new Date(),
      },
    });

    return {
      status: 'success',
      documentId,
    };
  } catch (err: any) {
    console.error('Failed to finalize document submission:', err);
    return {
      status: 'error',
      error: err.message || 'Failed to move file to permanent storage.',
    };
  }
}

```

---

### Step 3: Wire with `useActionState` in the Client

```tsx
// app/components/FinalizeStepForm.tsx
'use client';

import { useActionState } from 'react';
import { finalizeDocumentSubmissionAction, type FinalizeState } from '@/app/actions/finalize-upload';

interface FinalizeStepFormProps {
  title: string;
  tempKey: string;
  fileName: string;
  fileSize: number;
}

const initialState: FinalizeState = {
  status: 'idle',
  error: null,
};

export function FinalizeStepForm({
  title,
  tempKey,
  fileName,
  fileSize,
}: FinalizeStepFormProps) {
  const [state, formAction, isPending] = useActionState(
    finalizeDocumentSubmissionAction,
    initialState
  );

  if (state.status === 'success') {
    return (
      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-sm">
        Document finalized successfully! Document ID: <strong>{state.documentId}</strong>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 max-w-md border p-4 rounded-lg bg-white">
      <h3 className="font-semibold text-gray-900">Review & Finalize</h3>

      <div className="text-sm space-y-1 bg-gray-50 p-3 rounded border">
        <p><strong>Title:</strong> {title}</p>
        <p><strong>File:</strong> {fileName} ({(fileSize / (1024 * 1024)).toFixed(2)} MB)</p>
      </div>

      {state.status === 'error' && (
        <p className="text-xs text-red-600 bg-red-50 p-2 border border-red-200 rounded">
          {state.error}
        </p>
      )}

      {/* Hidden values passed to the Server Action */}
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="tempKey" value={tempKey} />
      <input type="hidden" name="fileName" value={fileName} />
      <input type="hidden" name="fileSize" value={fileSize} />

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-sm font-medium transition disabled:opacity-50"
      >
        {isPending ? 'Moving to permanent storage...' : 'Confirm & Save Document'}
      </button>
    </form>
  );
}

```

---

### Key Operational Protections

* **URL Encoding in `CopySource`:** The `CopySource` parameter format is `${bucketName}/${objectKey}`. If the filename or folder contains spaces or non-ASCII characters, URI-encode the key (`encodeURIComponent(tempKey)`) to prevent AWS S3 parsing errors.
* **Staging Auto-Pruning via S3 Lifecycle Rules:** Configure an S3 Lifecycle Rule on the prefix `uploads/temp/` to automatically delete objects older than 1–3 days. If users abandon the wizard before reaching the final submit step, S3 cleans up the orphan files at zero compute cost.
* **Strict Source Key Guardrails:** Always validate that `tempKey` explicitly begins with `uploads/temp/` inside the server action to prevent malicious clients from moving or overwriting unauthorized objects in other bucket folders.
